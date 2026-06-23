import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import { messages, noUnsafeAs } from "./no-unsafe-as";

test("no-unsafe-as", () => {
  const ret = ruleTester({
    invalid: [
      {
        code: tsx`
          const x = 1 as number;
        `,
        errors: [
          {
            line: 1,
            message: messages.default({ type: "number" }),
          },
        ],
      },
      {
        code: tsx`
          const x = 1 as any;
        `,
        errors: [
          {
            line: 1,
            message: messages.default({ type: "any" }),
          },
        ],
      },
      {
        code: tsx`
          const x = 1 as string;
        `,
        errors: [
          {
            line: 1,
            message: messages.default({ type: "string" }),
          },
        ],
      },
      {
        code: tsx`
          const x = value as SomeType;
        `,
        errors: [
          {
            line: 1,
            message: messages.default({ type: "SomeType" }),
          },
        ],
      },
      {
        code: tsx`
          const x = (value as unknown) as SomeType;
        `,
        errors: [
          {
            line: 1,
            message: messages.default({ type: "SomeType" }),
          },
        ],
      },
    ],
    ruleFn: noUnsafeAs,
    tsx: true,
    valid: [
      tsx`
        const x = 1 as const;
      `,
      tsx`
        const x = 1 as unknown;
      `,
      tsx`
        const x = (1 + 1) as unknown;
      `,
      tsx`
        const x = value satisfies string;
      `,
      tsx`
        const x = <string>value;
      `,
    ],
  });
  expect(ret).toBe(false);
});
