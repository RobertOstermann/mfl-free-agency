module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    "@stylistic",
    "@tanstack/query",
    "@typescript-eslint",
    "eslint-plugin-import",
    "eslint-plugin-tsdoc",
    "import",
    "import-newlines",
    "jsx-no-leaked-values",
    "react",
    // "react-compiler",
    "react-hooks",
    "simple-import-sort",
    "unused-imports",
  ],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    // @stylistic
    "@stylistic/comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        enums: "always-multiline",
        exports: "always-multiline",
        functions: "always-multiline",
      },
    ],
    "@stylistic/comma-spacing": [
      "error",
      {
        before: false,
        after: true,
      },
    ],
    "@stylistic/eol-last": "error",
    "@stylistic/no-multiple-empty-lines": [
      "error",
      {
        max: 1,
        maxBOF: 0,
      },
    ],
    "@stylistic/no-trailing-spaces": "error",
    "@stylistic/operator-linebreak": [
      "error",
      "after",
      { overrides: { "?": "before", ":": "before" } },
    ],
    "@stylistic/quotes": ["error", "double", "avoid-escape"],
    "@stylistic/semi": "error",
    // @tanstack
    "@tanstack/query/exhaustive-deps": "off",
    // @typescript
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/consistent-type-exports": "error",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        disallowTypeAnnotations: true,
        fixStyle: "separate-type-imports",
      },
    ],
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    // import
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-default-export": "error",
    "import/no-duplicates": "error",
    "import/no-empty-named-blocks": "error",
    // "import/no-cycle": [
    //   "error",
    //   {
    //     maxDepth: 10,
    //     ignoreExternal: true,
    //   },
    // ],
    "import-newlines/enforce": ["error", { items: 5, forceSingleLine: false }],
    // jsx-no-leaked-values
    "jsx-no-leaked-values/jsx-no-leaked-values": "error",
    // react
    "react/jsx-uses-react": "error",
    "react/jsx-tag-spacing": [
      "warn",
      {
        closingSlash: "never",
        beforeSelfClosing: "always",
        afterOpening: "never",
        beforeClosing: "never",
      },
    ],
    "react/jsx-wrap-multilines": [
      "error",
      {
        declaration: "parens-new-line",
        assignment: "parens-new-line",
        return: "parens-new-line",
        arrow: "parens-new-line",
      },
    ],
    "react/react-in-jsx-scope": "off",
    "react/display-name": "off",
    "react/no-unescaped-entities": "off",
    // react-compiler
    // "react-compiler/react-compiler": "error",
    // react-hooks
    "react-hooks/exhaustive-deps": "off",
    // simple-import-sort
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    // other
    "no-unused-vars": "off",
    // "unused-imports/no-unused-imports": "error",
    "tsdoc/syntax": "warn",
  },
  overrides: [
    {
      files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
      rules: {
        "simple-import-sort/imports": [
          "error",
          {
            groups: [
              ["React", "^react", "^@?\\w"],
              ["^\\u0000"],
              ["^(router)(/.*|$)(?<!\\.scss)"],
              [
                "^(api|assets|components|data|helper|hooks|pages|store|styles|theme|types)(/.*|$)(?<!\\.scss)",
                "^\\.",
              ],
              ["^.+\\.(s?css|png)$"],
            ],
          },
        ],
        "no-restricted-imports": [
          "error",
          {
            paths: [
              {
                name: "@mui/material",
                importNames: ["Button"],
                message: "Please use 'components/mui/button/Button'",
              },
              {
                name: "@mui/material",
                importNames: ["Card"],
                message: "Please use 'components/mui/card/Card'",
              },
              {
                name: "@mui/material",
                importNames: ["CardActionArea"],
                message: "Please use 'components/mui/card/CardActionArea'",
              },
              {
                name: "@mui/material",
                importNames: ["CardContent"],
                message: "Please use 'components/mui/card/CardContent'",
              },
              {
                name: "@mui/material",
                importNames: ["TableContainer"],
                message: "Please use 'components/mui/table/TableContainer'",
              },
              {
                name: "@mui/material",
                importNames: ["Toolbar"],
                message: "Please use 'components/mui/toolbar/Toolbar'",
              },
            ],
            patterns: ["@mui/*/*/*", "!@mui/*/*/Grid2"],
          },
        ],
      },
    },
  ],
  settings: {
    react: {
      version: "detect",
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        // always try to resolve types under `<root>@types` directory
        // even it doesn't contain any source code, like `@types/unist`
        alwaysTryTypes: true,

        // use <root>/path/to/folder/tsconfig.json
        project: "tsconfig.json",
        // "project": [
        //   "tsconfig.json",
        //   "tsconfig.node.json"
        // ]
      },
    },
  },
};
