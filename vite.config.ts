import envCaster from "@niku/vite-env-caster";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import camelcase from "camelcase";
import path from "node:path";
import url from "node:url";
import type { BuildEnvironmentOptions } from "vite";
import { defineConfig } from "vite";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Client Build Configuration
const clientBuildConfig: BuildEnvironmentOptions = {
  outDir: "dist/client",
  emitAssets: true,
  copyPublicDir: true,
  emptyOutDir: true,
};

// Server Build Configuration
const serverBuildConfig: BuildEnvironmentOptions = {
  ssr: true,
  outDir: "dist/server",
  copyPublicDir: false,
  emptyOutDir: true,
  rolldownOptions: {
    input: path.resolve(__dirname, "src/server/server.ts"),
    output: {
      entryFileNames: "[name].js",
      chunkFileNames: "assets/[name]-[hash].js",
      assetFileNames: "assets/[name]-[hash][extname]",
    },
  },
};

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig((configEnv) => {
  return {
    resolve: {
      tsconfigPaths: true,
    },
    define: {
      "import.meta.env.VITE_BUILD_DATE": JSON.stringify(
        new Date().toISOString(),
      ),
    },
    plugins: [
      tailwindcss(),
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "./src/client/router/routes",
        generatedRouteTree: "./src/client/router/codegen/routeTree.gen.ts",
        routeFileIgnorePattern: "\\.ts$",
        routeToken: {
          // https://tanstack.com/router/v1/docs/api/file-based-routing#routetoken
          regex: "\\+layout",
        },
        indexToken: {
          // https://tanstack.com/router/v1/docs/api/file-based-routing#indextoken
          regex: "\\+page",
        },
        semicolons: true,
        quoteStyle: "double",
        tmpDir: "./src/router/codegen/.tanstack",
      }),
      viteReact({ compiler: true }),
      envCaster({
        transformKey: (plainKey) => camelcase(plainKey.replace("VITE_", "")),
        declaration: "./src/types/global/env.d.ts",
        exportName: "env",
        moduleName: "@/vite-env",
        typeCasters: {
          number: {
            isType(plainValue, type) {
              if (type) {
                return type.toLowerCase() === "number";
              }

              // Reject empty strings
              if (plainValue === "") return false;

              return !Number.isNaN(Number(plainValue));
            },
            castValue: (plainValue) => Number(plainValue),
            typescriptType: () => "number",
          },
        },
      }),
    ],
    build: configEnv.mode === "server" ? serverBuildConfig : clientBuildConfig,
  };
});
