import eslint from "@eslint/js";
import { baseConfig, tanstackRouterConfig } from "@ostermann/eslint-config";
import { defineConfig, globalIgnores } from "eslint/config";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";

export default defineConfig([
  eslint.configs.recommended,
  globalIgnores(["node_modules", "scripts", "openapi-ts.config.ts"]),
  {
    extends: [baseConfig, tanstackRouterConfig],
  },
  // Rules for all js/ts files
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: {
      "simple-import-sort": simpleImportSortPlugin,
    },
    languageOptions: {
      sourceType: "module",
    },
    rules: {
      // check-file
      "check-file/filename-naming-convention": "off",
      // no-relative-import-paths
      "no-relative-import-paths/no-relative-import-paths": [
        "warn",
        { allowSameFolder: false, rootDir: "src", prefix: "@" },
      ],
      // no-restricted-imports
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "helper/TanstackQuery",
              importNames: ["queryClient"],
              message: "Please use 'useQueryClient' or 'context.queryClient'",
            },
            {
              name: "usehooks-ts",
              importNames: ["useDebounceCallback"],
              message: "Please use 'useDebouncedCallback'",
            },
            {
              name: "@tanstack/react-form",
              importNames: ["useForm"],
              message: "Please use 'useAppForm'",
            },
          ],
          patterns: ["@mui/*/*/*"],
        },
      ],
    },
  },
]);
