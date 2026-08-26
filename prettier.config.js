import { tailwindConfig } from "@ostermann/prettier-config/tailwind";

/**
 * @type {import("prettier").Config &
 *   import("prettier-plugin-jsdoc").Options &
 *   import("prettier-plugin-tailwindcss").PluginOptions}
 */
const config = {
  ...tailwindConfig,
  // Jsdoc setup
  jsdocCapitalizeDescription: false,
  jsdocSeparateReturnsFromParam: true,
  // Tailwind Setup
  plugins: [
    "prettier-plugin-jsdoc",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-packagejson",
  ],
  tailwindStylesheet: "./src/styles/tailwind.css",
  tailwindAttributes: [
    "class",
    "className",
    "tw",
    "/.*className.*/",
    "/.*ClassName.*/",
  ],
  tailwindFunctions: ["classnames", "clsx", "cn", "cva", "tv"],
};

// eslint-disable-next-line import/no-default-export
export default config;
