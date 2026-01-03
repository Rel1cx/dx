import { defineRule } from "tsl";

export const messages = {
  noDuplicateExports: (p: { source: string }) =>
    `Duplicate export to module ${p.source}. Combine into a single export statement.`,
} as const;

/**
 * Rule to disallow duplicate exports from the same module. Combine multiple export statements to the same module into a single statement.
 *
 * @todo Add autofix to merge duplicate exports automatically.
 *
 * @example
 *
 * ```ts
 * // Incorrect
 * export { A } from 'module';
 * export { B } from 'module';
 * ```
 *
 * ```ts
 * // Incorrect
 * export type { A } from 'module';
 * export type { B } from 'module';
 * ```
 *
 * @example
 *
 * ```ts
 * // Correct
 * export { A, B } from 'module';
 * ```
 *
 * ```ts
 * // Correct
 * export { A } from 'moduleA';
 * export type { B } from 'moduleA';
 * ```
 */
export const noDuplicateExports = defineRule(() => {
  return {
    name: "module/no-duplicate-exports",
    createData() {
      return [
        new Set<string>(), // for export
        new Set<string>(), // for export type
      ] as const;
    },
    visitor: {
      ExportDeclaration(ctx, node) {
        if (node.moduleSpecifier == null) return; // skip non-re-export exports
        const exportSource = node.moduleSpecifier.getText();
        const seen = ctx.data[node.isTypeOnly ? 1 : 0];
        if (seen.has(exportSource)) {
          ctx.report({
            node,
            message: messages.noDuplicateExports({ source: exportSource }),
          });
          return;
        }
        seen.add(exportSource);
      },
    },
  };
});
