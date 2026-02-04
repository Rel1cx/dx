import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import { messages, nullishComparison } from "./nullish-comparison";

test("nullish-comparison", () => {
  const ret = ruleTester({
    invalid: [
      {
        code: tsx`
          if (a === null) { }
        `,
        errors: [
          {
            message: messages.default({ op: "==" }),
            suggestions: [
              {
                message: messages.replace({ expr: "a == null" }),
                output: tsx`
                  if (a == null) { }
                `,
              },
            ],
          },
        ],
      },
      {
        code: tsx`
          if (a !== null) { }
        `,
        errors: [
          {
            message: messages.default({ op: "!=" }),
            suggestions: [
              {
                message: messages.replace({ expr: "a != null" }),
                output: tsx`
                  if (a != null) { }
                `,
              },
            ],
          },
        ],
      },
      {
        code: tsx`
          if (null !== a) { }
        `,
        errors: [
          {
            message: messages.default({ op: "!=" }),
            suggestions: [
              {
                message: messages.replace({ expr: "null != a" }),
                output: tsx`
                  if (null != a) { }
                `,
              },
            ],
          },
        ],
      },
      {
        code: tsx`
          if (a === undefined) { }
        `,
        errors: [
          {
            message: messages.default({ op: "==" }),
            suggestions: [
              {
                message: messages.replace({ expr: "a == null" }),
                output: tsx`
                  if (a == null) { }
                `,
              },
            ],
          },
        ],
      },
      {
        code: tsx`
          if (undefined !== b) { }
        `,
        errors: [
          {
            message: messages.default({ op: "!=" }),
            suggestions: [
              {
                message: messages.replace({ expr: "null != b" }),
                output: tsx`
                  if (null != b) { }
                `,
              },
            ],
          },
        ],
      },
    ],
    ruleFn: nullishComparison,
    tsx: true,
    valid: [
      tsx`
        if (a == null) { }
      `,
      tsx`
        if (b != null) { }
      `,
      tsx`
        if (c === 42) { }
      `,
      tsx`
        if (null != d) { }
      `,
    ],
  });
  expect(ret).toBe(false);
});
