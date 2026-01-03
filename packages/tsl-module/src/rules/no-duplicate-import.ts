import type { unit } from "@let/eff";
import { P, match } from "ts-pattern";
import { defineRule } from "tsl";
import ts from "typescript";

export const messages = {
  noDuplicateImport: (p: { source: string }) =>
    `Duplicate import from module ${p.source}. Combine into a single import statement.`,
} as const;

/**
 * Rule to disallow duplicate imports from the same module. Combine multiple import statements from the same module into a single statement.
 *
 * @example
 *
 * ```ts
 * // Incorrect
 * import { A } from 'module';
 * import { B } from 'module';
 * ```
 *
 * ```ts
 * // Incorrect
 * import type { A } from 'module';
 * import type { B } from 'module';
 * ```
 *
 * @example
 *
 * ```ts
 * // Correct
 * import { A, B } from 'module';
 * ```
 *
 * ```ts
 * // Correct
 * import { A } from 'moduleA';
 * import type { B } from 'moduleA';
 * ```
 */
export const noDuplicateImport = defineRule(() => {
  return {
    name: "module/no-duplicate-import",
    createData() {
      return [
        new Set<string>(), // for import
        new Set<string>(), // for import type
        new Set<string>(), // for import defer
      ] as const;
    },
    visitor: {
      ImportDeclaration(ctx, node) {
        const importSource = node.moduleSpecifier.getText();
        const importSet = ctx.data[
          match<ts.ImportPhaseModifierSyntaxKind | unit, 0 | 1 | 2>(node.importClause?.phaseModifier)
            .with(P.nullish, () => 0)
            .with(ts.SyntaxKind.TypeKeyword, () => 1)
            .with(ts.SyntaxKind.DeferKeyword, () => 2)
            .otherwise(() => 0)
        ];
        if (importSet.has(importSource)) {
          ctx.report({
            node: node.moduleSpecifier,
            message: messages.noDuplicateImport({ source: importSource }),
          });
          return;
        }
        importSet.add(importSource);
      },
    },
  };
});
