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
      {
        // More than 2 duplicate exports
        code: tsx`
          export { A } from 'module';
          export { B } from 'module';
          export { C } from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: "'module'" }),
            suggestions: [
              {
                message: "Merge duplicate exports",
                output: tsx`\nexport { A, B } from 'module';\nexport { C } from 'module';`,
              },
            ],
          },
          {
            line: 3,
            message: messages.default({ source: "'module'" }),
            suggestions: [
              {
                message: "Merge duplicate exports",
                output: tsx`\nexport { B } from 'module';\nexport { A, C } from 'module';`,
              },
            ],
          },
        ],
      },
      {
        // Export with aliases
        code: tsx`
          export { A as B } from 'module';
          export { C as D } from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: "'module'" }),
            suggestions: [
              {
                message: "Merge duplicate exports",
                output: tsx`\nexport { A as B, C as D } from 'module';`,
              },
            ],
          },
        ],
      },
      {
        // Multiple named exports combined
        code: tsx`
          export { A, B } from 'module';
          export { C, D } from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: "'module'" }),
            suggestions: [
              {
                message: "Merge duplicate exports",
                output: tsx`\nexport { A, B, C, D } from 'module';`,
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
      // Mixed type and non-type exports from same module should not be flagged
      tsx`
        export { A } from 'module';
        export type { B } from 'module';
      `,
      // Export with aliases
      tsx`
        export { A as B } from 'module1';
        export { C as D } from 'module2';
      `,
      // Multiple named exports from different modules
      tsx`
        export { A, B } from 'module1';
        export { C, D } from 'module2';
      `,
    ],
  });
  expect(ret).toBe(false);
});
