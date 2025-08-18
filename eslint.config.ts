import url from "node:url";

import markdown from "@eslint/markdown";
import * as configs from "@local/configs/eslint";
import configFlatGitignore from "eslint-config-flat-gitignore";
import pluginVitest from "eslint-plugin-vitest";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const dirname = url.fileURLToPath(new URL(".", import.meta.url));

const GLOB_TS = ["*.{ts,tsx,cts,mts}", "**/*.{ts,tsx,cts,mts}"];
const GLOB_MD = ["*.md", "**/*.md"];
const GLOB_TEST = [
  "**/*.spec.{ts,tsx,cts,mts}",
  "**/*.test.{ts,tsx,cts,mts}",
  "**/spec.{ts,tsx,cts,mts}",
  "**/test.{ts,tsx,cts,mts}",
];

const GLOB_CONFIG = ["*.config.{ts,tsx,cts,mts}", "**/*.config.{ts,tsx,cts,mts}"];
const GLOB_SCRIPT = ["scripts/**/*.{ts,cts,mts}"];
const GLOB_IGNORES = [
  ...configFlatGitignore().ignores,
  "apps",
  "docs",
  "test",
  "examples",
  "**/*.js",
  "**/*.d.ts",
];

const packagesTsConfigs = [
  "packages/*/tsconfig.json",
  "packages/*/*/tsconfig.json",
];

export default tseslint.config(
  globalIgnores(GLOB_IGNORES),
  {
    extends: [
      markdown.configs.recommended,
    ],
    files: GLOB_MD,
    ignores: [
      "**/README.md",
      "packages/**/docs/**/*.md",
    ],
    language: "markdown/gfm",
    rules: {
      "markdown/no-html": "warn",
      "markdown/no-missing-label-refs": "off",
    },
  },
  {
    extends: [
      ...tseslint.configs.strictTypeChecked,
      configs.typescript,
    ],
    files: GLOB_TS,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: packagesTsConfigs,
        projectService: true,
        tsconfigRootDir: dirname,
      },
    },
  },
  {
    extends: [
      tseslint.configs.disableTypeChecked,
    ],
    files: [...GLOB_SCRIPT, ...GLOB_CONFIG],
    languageOptions: {
      parserOptions: {
        project: false,
        projectService: false,
      },
    },
    rules: {
      "function/function-return-boolean": "off",
      "no-console": "off",
    },
  },
  {
    extends: [
      pluginVitest.configs.recommended,
    ],
    files: GLOB_TEST,
    languageOptions: {
      globals: {
        ...pluginVitest.environments.env.globals,
      },
      parserOptions: {
        project: "tsconfig.json",
        projectService: true,
        tsconfigRootDir: dirname,
      },
    },
    plugins: {
      vitest: pluginVitest,
    },
    rules: {
      "@typescript-eslint/no-empty-function": ["error", { allow: ["arrowFunctions"] }],
    },
  },
);
