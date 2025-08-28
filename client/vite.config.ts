/// <reference types="vitest" />
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import type { PluginOption, UserConfigExport } from "vite";
import { defineConfig, loadEnv } from "vite";
import mkcert from "vite-plugin-mkcert";
import tsconfigPaths from "vite-tsconfig-paths";

const fullReloadAlways: PluginOption = {
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" });
    return [];
  },
} as PluginOption;

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  let configuration: UserConfigExport = {
    plugins: [
      mkcert(),
      tsconfigPaths(),
      tanstackRouter({
        target: "react",
        routesDirectory: "./src/router/routes",
        generatedRouteTree: "./src/router/routeTree.gen.ts",
        autoCodeSplitting: false,
        semicolons: true,
        quoteStyle: "double",
      }),
      react(),
    ],

    test: {
      globals: true,
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/styles/_MFLManagerColors.scss";',
          quietDeps: true,
        },
      },
    },

    server: {
      port: parseInt(env.PORT),
    },
  };

  if (command === "serve" && mode !== "test") {
    configuration = {
      ...configuration,

      // plugins: [...configuration.plugins, fullReloadAlways],

      preview: {
        ...configuration.server,
        open: false,
      },

      server: {
        ...configuration.server,
        open: "/",
      },
    };
  }

  return configuration;
});
