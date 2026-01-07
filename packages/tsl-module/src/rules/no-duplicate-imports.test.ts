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
            suggestions: [
              {
                message: "Merge duplicate imports",
                output: tsx`
                  import { A, B } from 'module';\n
                `,
              },
            ],
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
            suggestions: [
              {
                message: "Merge duplicate imports",
                output: tsx`
                  import type { A, B } from 'module';\n
                `,
              },
            ],
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
            suggestions: [
              {
                message: "Merge duplicate imports",
                output: tsx`
                  import defer { foo } from 'module';\n
                `,
              },
            ],
          },
        ],
      },
      {
        code: tsx`
          import foo, { type bar, baz } from 'module';
          import foo2, { type qux, quux } from 'module';
          import foo3, { corge } from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.noDuplicateImports({ source: "'module'" }),
            suggestions: [
              {
                message: "Merge duplicate imports",
                output: tsx`
                  import foo, { type bar, baz, type qux, quux } from 'module';\n
                  import foo3, { corge } from 'module';
                `,
              },
            ],
          },
          {
            line: 3,
            message: messages.noDuplicateImports({ source: "'module'" }),
            suggestions: [
              {
                message: "Merge duplicate imports",
                output: tsx`
                  import foo, { type bar, baz, corge } from 'module';
                  import foo2, { type qux, quux } from 'module';\n
                `,
              },
            ],
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
