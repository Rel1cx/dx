import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import {
  messages,
  noMultilineTemplateExpressionWithoutAutoDedent,
} from "./no-multiline-template-expression-without-auto-dedent";

test("no-multiline-template-expression-without-auto-dedent", () => {
  const ret = ruleTester({
    invalid: [
      {
        code: "`\n`",
        errors: [
          {
            message: messages.useDedentTag(),
            suggestions: [
              {
                message: messages.addDedentTag({ name: "dedent" }),
                output: 'import dedent from "dedent";\ndedent`\n`',
              },
            ],
          },
        ],
      },
      {
        // Template with content spanning multiple lines
        code: "`\nhello world\n`",
        errors: [
          {
            message: messages.useDedentTag(),
            suggestions: [
              {
                message: messages.addDedentTag({ name: "dedent" }),
                output: 'import dedent from "dedent";\ndedent`\nhello world\n`',
              },
            ],
          },
        ],
      },
      {
        // Multiple line breaks
        code: "`line1\nline2\nline3`",
        errors: [
          {
            message: messages.useDedentTag(),
            suggestions: [
              {
                message: messages.addDedentTag({ name: "dedent" }),
                output: 'import dedent from "dedent";\ndedent`line1\nline2\nline3`',
              },
            ],
          },
        ],
      },
      {
        // Template starting with newline
        code: "`\n  indented content\n`",
        errors: [
          {
            message: messages.useDedentTag(),
            suggestions: [
              {
                message: messages.addDedentTag({ name: "dedent" }),
                output: 'import dedent from "dedent";\ndedent`\n  indented content\n`',
              },
            ],
          },
        ],
      },
    ],
    ruleFn: noMultilineTemplateExpressionWithoutAutoDedent,
    tsx: true,
    valid: [
      {
        code: "``",
      },
      {
        code: "dedent`\n`",
      },
      {
        // Single line template is valid
        code: "`hello world`",
      },
      {
        // Other tagged templates are valid
        code: "sql`\nSELECT * FROM table\n`",
      },
      {
        // Tagged template with multiple lines
        code: "styled`\ncolor: red;\n`",
      },
      {
        // Empty template on single line
        code: "`template`",
      },
    ],
  });
  expect(ret).toBe(false);
});
