import eslint from "@eslint/js";
import {
  baseConfig,
  tailwindConfig,
  tanstackRouterConfig,
} from "@ostermann/eslint-config";
import { defineConfig, globalIgnores } from "eslint/config";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default defineConfig([
  eslint.configs.recommended,
  globalIgnores(["node_modules", "scripts", "openapi-ts.config.ts"]),
  {
    extends: [baseConfig, tailwindConfig(), tanstackRouterConfig],
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
  // Rules for all ts files
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    extends: [tseslint.configs.eslintRecommended, tseslint.configs.recommended],
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {},
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
    },
    languageOptions: {
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // typescript-eslint
      "@typescript-eslint/no-deprecated": "error",
    },
  },
  // Remove filename conventions for routes
  {
    files: [
      "src/main.tsx",
      "src/client/router/**/*.js",
      "src/client/router/**/*.jsx",
      "src/client/router/**/*.ts",
      "src/client/router/**/*.tsx",
    ],
    plugins: {
      "simple-import-sort": simpleImportSortPlugin,
    },
    languageOptions: {
      sourceType: "module",
    },
    rules: {
      // check-file
      "check-file/filename-naming-convention": "off",
    },
  },
]);
