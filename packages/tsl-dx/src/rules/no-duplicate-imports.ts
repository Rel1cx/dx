import { unit } from "@local/eff";
import { match } from "ts-pattern";
import { type AST, defineRule } from "tsl";
import ts from "typescript";

export const messages = {
  default: (p: { source: string }) => `Duplicate import from module ${p.source}.`,
} as const;

type ImportKind = "value" | "type" | "defer";

type NamedBindings =
  | { kind: "named"; imports: string[] }
  | { kind: "namespace"; name: string };

interface ImportInfo {
  node: AST.ImportDeclaration;
  kind: ImportKind;
  source: string;
  defaultImport: string | unit;
  bindings: NamedBindings;
}

/**
 * Rule to detect and merge duplicate `import from` statements from the same module.
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
 * // Correct
 * import { A, B } from 'module';
 * ```
 */
export const noDuplicateImports = defineRule(() => {
  return {
    name: "dx/no-duplicate-imports",
    createData(): { imports: Map<ImportKind, ImportInfo[]> } {
      return { imports: new Map([["value", []], ["type", []], ["defer", []]]) };
    },
    visitor: {
      ImportDeclaration(ctx, node) {
        if (node.importClause == null) return; // skip side-effect imports
        const importKind = match(node.importClause.phaseModifier)
          .with(ts.SyntaxKind.TypeKeyword, () => "type" as const)
          .with(ts.SyntaxKind.DeferKeyword, () => "defer" as const)
          .otherwise(() => "value" as const);
        const importSource = node.moduleSpecifier.getText();
        const importInfo = {
          node,
          source: importSource,
          kind: importKind,
          defaultImport: node.importClause.name?.getText(),
          bindings: match(node.importClause.namedBindings)
            .with({ kind: ts.SyntaxKind.NamedImports }, (nb) => ({
              kind: "named" as const,
              imports: nb.elements.map((el) => el.getText()),
            }))
            .with({ kind: ts.SyntaxKind.NamespaceImport }, (nb) => ({
              kind: "namespace" as const,
              name: nb.name.getText(),
            }))
            .otherwise(() => ({ kind: "named" as const, imports: [] })),
        } as const satisfies ImportInfo;
        const existingImports = ctx.data.imports.get(importKind)!;
        const duplicateImport = existingImports.find((imp) => imp.source === importInfo.source);
        if (duplicateImport == null) {
          existingImports.push(importInfo);
          return;
        }
        ctx.report({
          node,
          message: messages.default({ source: importInfo.source }),
          suggestions: buildSuggestions(duplicateImport, importInfo),
        });
      },
    },
  };
});

function buildSuggestions(existing: ImportInfo, incoming: ImportInfo) {
  if (
    incoming.kind === "defer"
    || incoming.bindings.kind === "namespace"
    || existing.bindings.kind === "namespace"
  ) {
    return [];
  }
  // Both bindings are guaranteed to be "named" here
  const parts: string[] = [];
  const defaultImport = existing.defaultImport ?? incoming.defaultImport;
  if (defaultImport != null) {
    parts.push(defaultImport);
  }
  const mergedImports = Array.from(
    new Set([
      ...existing.bindings.imports,
      ...incoming.bindings.imports,
    ]),
  );
  if (mergedImports.length > 0) {
    parts.push(`{ ${mergedImports.join(", ")} }`);
  }
  const importKindPrefix = incoming.kind === "value" ? "import" : "import type";
  return [
    {
      message: "Merge duplicate imports",
      changes: [
        { node: incoming.node, newText: "" },
        {
          node: existing.node,
          newText: `${importKindPrefix} ${parts.join(", ")} from ${existing.source};`,
        },
      ],
    },
  ];
}
