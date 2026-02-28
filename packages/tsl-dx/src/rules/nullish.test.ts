import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import { messages, nullish } from "./nullish";

test("nullish", () => {
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
      {
        // undefined on the left side with ===
        code: tsx`
          if (undefined === x) { }
        `,
        errors: [
          {
            message: messages.default({ op: "==" }),
            suggestions: [
              {
                message: messages.replace({ expr: "null == x" }),
                output: tsx`
                  if (null == x) { }
                `,
              },
            ],
          },
        ],
      },
      {
        // undefined on the left side with !==
        code: tsx`
          if (undefined !== y) { }
        `,
        errors: [
          {
            message: messages.default({ op: "!=" }),
            suggestions: [
              {
                message: messages.replace({ expr: "null != y" }),
                output: tsx`
                  if (null != y) { }
                `,
              },
            ],
          },
        ],
      },
    ],
    ruleFn: nullish,
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
      tsx`
        let x: null;
      `,
      // Loose equality with null is valid
      tsx`
        if (x == null) { }
      `,
      // Comparison with other values
      tsx`
        if (y === 0) { }
      `,
      tsx`
        if (z === '') { }
      `,
      tsx`
        if (w === false) { }
      `,
    ],
  });
  expect(ret).toBe(false);
});
