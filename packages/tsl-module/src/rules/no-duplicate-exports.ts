import { type AST, defineRule } from "tsl";
import ts from "typescript";

export const messages = {
  noDuplicateExports: (p: { source: string }) => `Duplicate export from module ${p.source}.`,
} as const;

type ReExportDeclaration = AST.ExportDeclaration & { exportClause: {}; moduleSpecifier: {} };

function isReExportDeclaration(node: AST.ExportDeclaration): node is ReExportDeclaration {
  return node.exportClause != null && node.moduleSpecifier != null;
}

/**
 * Rule to detect and merge duplicate `export from` statements from the same module.
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
    createData(): { exports: ReExportDeclaration[] } {
      return { exports: [] };
    },
    visitor: {
      ExportDeclaration(ctx, node) {
        if (!isReExportDeclaration(node)) return; // skip non-re-export exports
        const source = node.moduleSpecifier.getText();
        const duplicateExport = ctx.data.exports
          .find((exp) => exp.isTypeOnly === node.isTypeOnly && exp.moduleSpecifier.getText() === source);
        if (duplicateExport != null) {
          ctx.report({
            node,
            message: messages.noDuplicateExports({ source }),
            suggestions: buildSuggestions(duplicateExport, node),
          });
          return;
        }
        ctx.data.exports.push(node);
      },
    },
  };
});

function buildSuggestions(a: ReExportDeclaration, b: ReExportDeclaration) {
  switch (true) {
    case ts.isNamedExports(a.exportClause)
      && ts.isNamedExports(b.exportClause): {
      const aElements = a.exportClause.elements.map((el) => el.getText());
      const bElements = b.exportClause.elements.map((el) => el.getText());
      const parts = Array.from(new Set([...aElements, ...bElements])).sort();
      return [
        {
          message: "Merge duplicate exports",
          changes: [
            {
              node: a,
              newText: "",
            },
            {
              node: b,
              // dprint-ignore
              newText: `export ${a.isTypeOnly ? "type " : ""}{ ${parts.join(", ")} } from ${a.moduleSpecifier.getText()};`,
            },
          ],
        },
      ];
    }
    // TODO: handle other exportClause kinds if needed
    default:
      return [];
  }
}
