import chalk from "chalk";
import express from "express";
import * as fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import url from "node:url";
import type { ViteDevServer } from "vite";

import { loadEnvironment } from "@/utilities/loadEnv";

loadEnvironment();

const PORT =
  typeof process.env.PORT !== "undefined"
    ? parseInt(process.env.PORT, 10)
    : 3000;
const HMR_PORT =
  typeof process.env.HMR_PORT !== "undefined"
    ? parseInt(process.env.HMR_PORT, 10)
    : 3001;

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Module that exports the express-ready tRPC middleware. */
const TRPC_MODULE = "/src/server/trpc.ts";

type TrpcMiddleWare = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => void;

/**
 * Load the tRPC middleware through vite's SSR module graph.
 *
 * Going through vite rather than a static import means the module can be
 * re-instantiated on demand, so editing a router does not require restarting
 * the node process the vite dev server lives in.
 *
 * @param viteServer - The vite dev server owning the SSR module graph.
 */
async function loadTrpcMiddleWare(
  viteServer: ViteDevServer,
): Promise<TrpcMiddleWare> {
  const loaded = (await viteServer.ssrLoadModule(TRPC_MODULE)) as {
    trpcMiddleWare: TrpcMiddleWare;
  };

  return loaded.trpcMiddleWare;
}

type Shortcut = { action: () => Promise<void> | void; description: string };

/**
 * Bind interactive CLI shortcuts to stdin for a vite dev server.
 *
 * @param viteServer - The vite dev server to control.
 */
function bindShortcuts(viteServer: ViteDevServer) {
  if (!process.stdin.isTTY || process.env.CI) return;

  const shortcuts: Record<string, Shortcut> = {
    r: {
      description: "restart the vite server",
      action: async () => {
        await viteServer.restart();
        console.info(chalk.green("Vite server restarted"));
      },
    },
    u: {
      description: "show server url",
      action: () => {
        console.info(
          chalk.dim("Server available at: ") +
            chalk.cyan(`http://localhost:${PORT}`),
        );
      },
    },
    c: {
      description: "clear console",
      action: () => {
        console.clear();
      },
    },
    q: {
      description: "quit",
      action: async () => {
        await viteServer.close();
        process.exit(0);
      },
    },
  };

  const readlineInterface = readline.createInterface({ input: process.stdin });

  let actionRunning = false;

  readlineInterface.on("line", async (line) => {
    if (actionRunning) return;

    const input = line.trim().toLowerCase();

    if (input === "h") {
      console.info(chalk.bold("\n  Shortcuts"));
      Object.entries(shortcuts).forEach(([key, { description }]) => {
        console.info(
          chalk.dim("  press ") +
            chalk.bold(`${key} + enter`) +
            chalk.dim(` to ${description}`),
        );
      });
      console.info();

      return;
    }

    const shortcut = shortcuts[input];
    if (!shortcut) return;

    actionRunning = true;
    await shortcut.action();
    actionRunning = false;
  });
}

export const createServer = async (
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
) => {
  const app = express();

  if (!isProd) {
    const vite = await import("vite");
    const viteServer = await vite.createServer({
      root,
      logLevel: isTest ? "error" : "info",
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: HMR_PORT,
        },
      },
      appType: "custom",
    });

    // Load the tRPC middleware through vite's SSR module graph rather than
    // importing it at the top of this file. The express app outlives every
    // edit, so a change under src/server/ only invalidates the module here
    // instead of restarting the process and tearing down the HMR socket that
    // the browser is attached to.
    //
    // The load is deferred to the first request and cached. A module that
    // throws while evaluating (a syntax error, a bad env var) then surfaces as
    // a failed request rather than an unhandled rejection that takes the whole
    // dev server down with it.
    let trpcMiddleWarePromise: Promise<TrpcMiddleWare> | undefined;

    viteServer.watcher.on("change", (file) => {
      const changed = path.relative(root, file);
      if (!changed.startsWith(path.join("src", "server"))) return;

      // Drop the cached module so the next request re-evaluates it.
      trpcMiddleWarePromise = undefined;
      console.info(
        chalk.dim(chalk.green("  ➜")) +
          chalk.dim("  server reloaded ") +
          chalk.dim(changed),
      );
    });

    app.use("/trpc", (req, res, next) => {
      trpcMiddleWarePromise ??= loadTrpcMiddleWare(viteServer);

      trpcMiddleWarePromise.then(
        (trpcMiddleWare) => trpcMiddleWare(req, res, next),
        (e: unknown) => {
          // Let the next request retry instead of caching the rejection.
          trpcMiddleWarePromise = undefined;
          if (e instanceof Error) viteServer.ssrFixStacktrace(e);
          next(e);
        },
      );
    });

    // Use vite's connect instance as middleware
    app.use(viteServer.middlewares);

    // In middleware mode vite has no httpServer of its own, so
    // `viteServer.bindCLIShortcuts` returns early and never binds stdin. Bind
    // the shortcuts we care about manually instead.
    bindShortcuts(viteServer);

    // Handle any requests that don't match an API route by serving the React app's index.html
    app.get("/{*splat}", async (req, res, next) => {
      try {
        let html = fs.readFileSync(path.resolve(root, "index.html"), "utf-8");

        // Transform HTML using Vite plugins.
        html = await viteServer.transformIndexHtml(req.url, html);

        res.send(html);
      } catch (e) {
        return next(e);
      }
    });

    return { app };
  } else {
    const { trpcMiddleWare } = await import("@/server/trpc");

    app.use("/trpc", trpcMiddleWare);

    app.use(express.static(path.resolve(__dirname, "../client")));

    // Handle any requests that don't match an API route by serving the React app's index.html
    app.get("/{*splat}", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../client", "index.html"));
    });
  }

  return { app };
};

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(PORT, (error) => {
      if (error) throw error;
      console.info(
        chalk.dim("Server available at: ") +
          chalk.cyan(`http://localhost:${PORT}`),
      );
      console.info();

      console.info(
        chalk.dim(chalk.green("  ➜")) +
          chalk.dim("  press ") +
          chalk.bold("h + enter") +
          chalk.dim(" to show shortcuts"),
      );
    }),
  );
}
