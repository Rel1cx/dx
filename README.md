# eslint-plugin-function

The ESLint plugin for function-related rules.

> [!WARNING]
> This package is a work in progress and is not yet ready for production use.

## Installation

```sh
# npm
npm install --save-dev eslint-plugin-function
```

## Configure ESLint

```js
// eslint.config.js

// @ts-check
import eslintJs from "@eslint/js";
import pluginFunction from "eslint-plugin-function";
import tseslint from "typescript-eslint";

export default tseslint.config({
  files: ["**/*.ts", "**/*.tsx"],
  extends: [
    eslintJs.configs.recommended,
    tseslint.configs["recommended-type-checked"],
  ],
  plugins: {
    function: pluginFunction,
  },
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    // Enforce functions matching the given pattern always return a boolean value
    "function/function-return-boolean": ["error", { pattern: "/^(is|has|should)/" }],
  },
});
```
