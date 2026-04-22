import { type AST, defineRule } from "tsl";
import ts from "typescript";

import { printNode } from "../utils/print-node";

export const messages = {
  default: (p: { source: string }) => `Duplicate export from module ${p.source}.`,
} as const;

type ReExportDeclaration = AST.ExportDeclaration & { exportClause: {}; moduleSpecifier: {} };

function isReExportDeclaration(node: AST.ExportDeclaration): node is ReExportDeclaration {
  return node.exportClause != null && node.moduleSpecifier != null;
}

/**
 * Rule to detect and merge duplicate `export from` statements from the same module.
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
 * // Correct
 * export { A, B } from 'module';
 * ```
 */
export const noDuplicateExports = defineRule(() => {
  return {
    name: "dx/no-duplicate-exports",
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
            message: messages.default({ source }),
            suggestions: buildSuggestions(duplicateExport, node),
          });
          return;
        }
        ctx.data.exports.push(node);
      },
    },
  };
});

function buildSuggestions(existing: ReExportDeclaration, incoming: ReExportDeclaration) {
  switch (true) {
    case ts.isNamedExports(existing.exportClause)
      && ts.isNamedExports(incoming.exportClause): {
      const seen = new Set<string>();
      const elements: ts.ExportSpecifier[] = [];
      for (const el of [...existing.exportClause.elements, ...incoming.exportClause.elements]) {
        const text = el.getText();
        if (seen.has(text)) continue;
        seen.add(text);
        elements.push(ts.factory.createExportSpecifier(
          el.isTypeOnly,
          el.propertyName != null ? ts.factory.createIdentifier(el.propertyName.text) : undefined,
          ts.factory.createIdentifier(el.name.text),
        ));
      }
      const specifierText = existing.moduleSpecifier.getText();
      const isSingleQuote = specifierText.startsWith("'");
      const specifierValue = specifierText.slice(1, -1);
      const exportDecl = ts.factory.createExportDeclaration(
        undefined,
        existing.isTypeOnly,
        ts.factory.createNamedExports(elements),
        ts.factory.createStringLiteral(specifierValue, isSingleQuote),
      );
      return [
        {
          message: "Merge duplicate exports",
          changes: [
            {
              start: incoming.getFullStart(),
              end: incoming.getEnd(),
              newText: "",
            },
            {
              node: existing,
              newText: printNode(exportDecl),
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
