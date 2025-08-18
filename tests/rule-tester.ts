import { RuleTester } from "@typescript-eslint/rule-tester";
import path from "node:path";

const rootPath = path.join(__dirname, "./fixtures");

export const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      project: "./tsconfig.json",
      sourceType: "module",
      tsconfigRootDir: rootPath,
    },
  },
});
