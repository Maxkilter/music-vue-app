import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import vitest from "@vitest/eslint-plugin";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    files: ["**/*.{test,spec}.{js,mjs,cjs,ts,tsx}"],
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
        "vitest/expect-expect": "error",
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
];
