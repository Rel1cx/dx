import url from "node:url";

import markdown from "@eslint/markdown";
import {
  GLOB_CONFIGS,
  GLOB_MD,
  GLOB_SCRIPTS,
  GLOB_TESTS,
  GLOB_TS,
  disableTypeChecked,
  strictTypeChecked,
} from "@local/configs/eslint";
import configFlatGitignore from "eslint-config-flat-gitignore";
import pluginVitest from "eslint-plugin-vitest";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const dirname = url.fileURLToPath(new URL(".", import.meta.url));

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
      strictTypeChecked,
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
      disableTypeChecked,
    ],
    files: [...GLOB_SCRIPTS, ...GLOB_CONFIGS],
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
    files: GLOB_TESTS,
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
