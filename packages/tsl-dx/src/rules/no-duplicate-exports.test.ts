import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import { messages, noDuplicateExports } from "./no-duplicate-exports";

test("no-duplicate-exports", () => {
  const ret = ruleTester({
    invalid: [
      {
        code: tsx`
          export { A } from 'module';
          export { B } from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: "'module'" }),
            suggestions: [
              {
                message: "Merge duplicate exports",
                output: tsx`\nexport { A, B } from 'module';`,
              },
            ],
          },
        ],
      },
      {
        code: tsx`
          export type { A } from 'module';
          export type { B } from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: "'module'" }),
            suggestions: [
              {
                message: "Merge duplicate exports",
                output: tsx`\nexport type { A, B } from 'module';`,
              },
            ],
          },
        ],
      },
    ],
    ruleFn: noDuplicateExports,
    tsx: true,
    valid: [
      tsx`
        export { A } from 'module1';
        export { A } from 'module2';
        export { A } from 'module3';
      `,
    ],
  });
  expect(ret).toBe(false);
});
