import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import { messages, noDuplicateImports } from "./no-duplicate-imports";

test("no-duplicate-import", () => {
  const ret = ruleTester({
    invalid: [
      {
        code: tsx`
          import { A } from 'module';
          import { B } from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.noDuplicateImports({ source: "'module'" }),
          },
        ],
      },
      {
        code: tsx`
          import type { A } from 'module';
          import type { B } from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.noDuplicateImports({ source: "'module'" }),
          },
        ],
      },
      {
        code: tsx`
          import defer { foo } from 'module';
          import defer { foo } from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.noDuplicateImports({ source: "'module'" }),
          },
        ],
      },
    ],
    ruleFn: noDuplicateImports,
    tsx: true,
    valid: [
      tsx`
        import { A } from 'module1';
        import { A } from 'module2';
        import { A } from 'module3';
      `,
      tsx`
        import { A } from 'module';
        import type { A } from 'module';
        import defer { A } from 'module';
      `,
    ],
  });
  expect(ret).toBe(false);
});
