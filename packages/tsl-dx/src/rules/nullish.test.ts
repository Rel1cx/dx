import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import { messages, nullish, suggestions } from "./nullish";

test("nullish", () => {
  const ret = ruleTester({
    invalid: [
      {
        code: tsx`
          let undef: undefined;
        `,
        errors: [
          {
            message: messages.useUnitForUndefined,
            suggestions: [
              {
                message: suggestions.replaceWithExpression({ expr: "unit" }),
                output: tsx`
                  import type { unit } from '@local/eff';
                  let undef: unit;
                `,
              },
            ],
          },
        ],
      },
      {
        code: tsx`
          let undef = undefined;
        `,
        errors: [
          {
            message: messages.useUnitForUndefined,
            suggestions: [
              {
                message: suggestions.replaceWithExpression({ expr: "unit" }),
                output: tsx`
                  import { unit } from '@local/eff';
                  let undef = unit;
                `,
              },
            ],
          },
        ],
      },
      {
        code: tsx`
          if (a === null) { }
        `,
        errors: [
          {
            message: messages.useLooseNullishComparison({ op: "==" }),
            suggestions: [
              {
                message: suggestions.replaceWithExpression({ expr: "a == null" }),
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
            message: messages.useLooseNullishComparison({ op: "!=" }),
            suggestions: [
              {
                message: suggestions.replaceWithExpression({ expr: "a != null" }),
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
            message: messages.useLooseNullishComparison({ op: "!=" }),
            suggestions: [
              {
                message: suggestions.replaceWithExpression({ expr: "null != a" }),
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
            message: messages.useLooseNullishComparison({ op: "==" }),
            suggestions: [
              {
                message: suggestions.replaceWithExpression({ expr: "a == null" }),
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
            message: messages.useLooseNullishComparison({ op: "!=" }),
            suggestions: [
              {
                message: suggestions.replaceWithExpression({ expr: "null != b" }),
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
            message: messages.useLooseNullishComparison({ op: "==" }),
            suggestions: [
              {
                message: suggestions.replaceWithExpression({ expr: "null == x" }),
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
            message: messages.useLooseNullishComparison({ op: "!=" }),
            suggestions: [
              {
                message: suggestions.replaceWithExpression({ expr: "null != y" }),
                output: tsx`
                  if (null != y) { }
                `,
              },
            ],
          },
        ],
      },
      {
        // Multiple undefined usages
        code: tsx`
          let a: undefined;
          let b: undefined;
        `,
        errors: [
          {
            message: messages.useUnitForUndefined,
            suggestions: [
              {
                message: suggestions.replaceWithExpression({ expr: "unit" }),
                output: tsx`
                  import type { unit } from '@local/eff';
                  let a: unit;
                  let b: undefined;
                `,
              },
            ],
          },
          {
            message: messages.useUnitForUndefined,
            suggestions: [
              {
                message: suggestions.replaceWithExpression({ expr: "unit" }),
                output: tsx`
                  import type { unit } from '@local/eff';
                  let a: undefined;
                  let b: unit;
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
      // Using unit is valid
      tsx`
        let x: unit;
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
