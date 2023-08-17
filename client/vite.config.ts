/// <reference types="vitest" />
/* eslint-disable @typescript-eslint/no-unused-vars */
import react from "@vitejs/plugin-react";
import fs from "fs";
import { defineConfig, loadEnv, PluginOption, UserConfigExport } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const fullReloadAlways: PluginOption = {
  handleHotUpdate({ server }) {
    server.ws.send({ type: "full-reload" });
    return [];
  },
} as PluginOption;

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  let configuration: UserConfigExport = {
    plugins: [
      react(),
      tsconfigPaths(),
    ],

    test: {
      globals: true,
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/styles/_MFLManagerColors.scss";',
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
        https: {
          key: fs.readFileSync(env.SSL_KEY_FILE),
          cert: fs.readFileSync(env.SSL_CRT_FILE),
        },
        open: false,
      },

      server: {
        ...configuration.server,
        https: {
          key: fs.readFileSync(env.SSL_KEY_FILE),
          cert: fs.readFileSync(env.SSL_CRT_FILE),
        },
        open: "/",
      },
    };
  }

  return configuration;
});
