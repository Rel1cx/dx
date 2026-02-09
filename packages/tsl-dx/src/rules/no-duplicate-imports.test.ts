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
            message: messages.default({ source: "'module'" }),
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
            message: messages.default({ source: "'module'" }),
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
        // invalid import defer syntax, but for test purpose
        code: tsx`
          import defer { foo1 } from 'module';
          import defer { foo2 } from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: "'module'" }),
            suggestions: [],
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
            message: messages.default({ source: "'module'" }),
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
            message: messages.default({ source: "'module'" }),
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
      {
        code: tsx`
           import defer * as ns1 from "mod";
           import defer * as ns2 from "mod";
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: '"mod"' }),
            suggestions: [],
          },
        ],
      },
      {
        // Namespace import with named imports
        code: tsx`
          import * as ns from 'module';
          import { A } from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: "'module'" }),
            suggestions: [
              {
                message: "Merge duplicate imports",
                output: tsx`
                  import * as ns, { A } from 'module';\n
                `,
              },
            ],
          },
        ],
      },
      {
        // Default import with namespace import
        code: tsx`
          import Default from 'module';
          import * as ns from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: "'module'" }),
            suggestions: [
              {
                message: "Merge duplicate imports",
                output: tsx`
                  import Default, * as ns from 'module';\n
                `,
              },
            ],
          },
        ],
      },
      {
        // Import with aliases
        code: tsx`
          import { A as B } from 'module';
          import { C as D } from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: "'module'" }),
            suggestions: [
              {
                message: "Merge duplicate imports",
                output: tsx`
                  import { A as B, C as D } from 'module';\n
                `,
              },
            ],
          },
        ],
      },
      {
        // Three import defer statements (no suggestions)
        code: tsx`
          import defer { foo1 } from 'module';
          import defer { foo2 } from 'module';
          import defer { foo3 } from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: "'module'" }),
            suggestions: [],
          },
          {
            line: 3,
            message: messages.default({ source: "'module'" }),
            suggestions: [],
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
      // invalid import defer syntax, but for test purpose
      tsx`
        import { A } from 'module';
        import type { A } from 'module';
        import defer { A } from 'module';
      `,
      tsx`
        import defer * as ns from "mod";
      `,
      // Side-effect imports should be skipped
      tsx`
        import 'module';
        import 'module';
      `,
      // Namespace imports from different modules
      tsx`
        import * as ns1 from 'module1';
        import * as ns2 from 'module2';
      `,
      // Default imports from different modules
      tsx`
        import A from 'module1';
        import B from 'module2';
      `,
    ],
  });
  expect(ret).toBe(false);
});
