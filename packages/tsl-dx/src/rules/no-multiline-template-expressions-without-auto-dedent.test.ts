import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import {
  messages,
  noMultilineTemplateExpressionsWithoutAutoDedent,
} from "./no-multiline-template-expressions-without-auto-dedent";

test("no-multiline-template-expressions-without-auto-dedent", () => {
  const ret = ruleTester({
    invalid: [
      {
        code: "`\n`",
        errors: [
          {
            message: messages.default(),
          },
        ],
      },
    ],
    ruleFn: noMultilineTemplateExpressionsWithoutAutoDedent,
    tsx: true,
    valid: [
      {
        code: "``",
      },
      {
        code: "dedent`\n`",
      },
    ],
  });
  expect(ret).toBe(false);
});
