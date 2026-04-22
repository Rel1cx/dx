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
                  import { A, B } from 'module';
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
                  import type { A, B } from 'module';
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
        // Conflicting default imports across all three statements
        code: tsx`
          import foo, { type bar, baz } from 'module';
          import foo2, { type qux, quux } from 'module';
          import foo3, { corge } from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: "'module'" }),
            // Cannot merge: conflicting default imports foo vs foo2
            suggestions: [],
          },
          {
            line: 3,
            message: messages.default({ source: "'module'" }),
            // Cannot merge: conflicting default imports foo vs foo3
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
            suggestions: [],
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
            suggestions: [],
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
                  import { A as B, C as D } from 'module';
                `,
              },
            ],
          },
        ],
      },
      {
        code: tsx`
          import * as astUtils from "@typescript-eslint/utils/ast-utils";
          import { getStaticValue } from "@typescript-eslint/utils/ast-utils";
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: '"@typescript-eslint/utils/ast-utils"' }),
            suggestions: [],
          },
        ],
      },
      {
        // Conflicting default imports with no named bindings
        code: tsx`
          import A from 'module';
          import B from 'module';
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
        // Conflicting default imports with named bindings
        code: tsx`
          import A, { foo } from 'module';
          import B, { bar } from 'module';
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
        // Same default import name on both sides IS safe to merge
        code: tsx`
          import A, { foo } from 'module';
          import A, { bar } from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: "'module'" }),
            suggestions: [
              {
                message: "Merge duplicate imports",
                output: tsx`
                  import A, { foo, bar } from 'module';
                `,
              },
            ],
          },
        ],
      },
      {
        // Only existing has default, incoming has only named — merge is safe
        code: tsx`
          import Default from 'module';
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
                  import Default, { A } from 'module';
                `,
              },
            ],
          },
        ],
      },
      {
        // Only incoming has default, existing has only named — merge is safe
        code: tsx`
          import { A } from 'module';
          import Default from 'module';
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: "'module'" }),
            suggestions: [
              {
                message: "Merge duplicate imports",
                output: tsx`
                  import Default, { A } from 'module';
                `,
              },
            ],
          },
        ],
      },
      {
        // Removing duplicate import should not leave a trailing blank line
        code: tsx`
          import { A } from 'module';
          import { B } from 'module';
          const x = 1;
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: "'module'" }),
            suggestions: [
              {
                message: "Merge duplicate imports",
                output: tsx`
                  import { A, B } from 'module';
                  const x = 1;
                `,
              },
            ],
          },
        ],
      },
      {
        // Three imports from same module — no blank lines should accumulate
        code: tsx`
          import { A } from 'module';
          import { B } from 'module';
          import { C } from 'module';
          const x = 1;
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: "'module'" }),
            suggestions: [
              {
                message: "Merge duplicate imports",
                output: tsx`
                  import { A, B } from 'module';
                  import { C } from 'module';
                  const x = 1;
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
                  import { A, C } from 'module';
                  import { B } from 'module';
                  const x = 1;
                `,
              },
            ],
          },
        ],
      },
      {
        // Double-quoted module specifier should preserve quotes in output
        code: tsx`
          import { A } from "module";
          import { B } from "module";
        `,
        errors: [
          {
            line: 2,
            message: messages.default({ source: '"module"' }),
            suggestions: [
              {
                message: "Merge duplicate imports",
                output: tsx`
                  import { A, B } from "module";
                `,
              },
            ],
          },
        ],
      },
      {
        // Type-only import with default import merge
        code: tsx`
          import type Default, { A } from 'module';
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
                  import type Default, { A, B } from 'module';
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
      // invalid import defer syntax, but for test purpose
      tsx`
        import { A } from 'module';
        import type { A } from 'module';
        import defer { A } from 'module';
      `,
      // Reversed order: value first, then type
      tsx`
        import { B } from 'module';
        import type { A } from 'module';
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
