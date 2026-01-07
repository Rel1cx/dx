import { unit } from "@let/eff";
import { P, match } from "ts-pattern";
import { type AST, defineRule } from "tsl";
import ts from "typescript";

export const messages = {
  noDuplicateImports: (p: { source: string }) => `Duplicate import from module ${p.source}.`,
} as const;

type ImportKind = 0 | 1 | 2; // 0: import, 1: import type, 2: import defer

interface ImportInfo {
  node: AST.ImportDeclaration;
  kind: ImportKind;
  defaultImport: string | unit;
  namedImports: string[];
  namespaceImport: string | unit;
  source: string;
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
export const noDuplicateImports = defineRule(() => {
  return {
    name: "module/no-duplicate-imports",
    createData(): { imports: [ImportInfo[], ImportInfo[], ImportInfo[]] } {
      return { imports: [[], [], []] };
    },
    visitor: {
      ImportDeclaration(ctx, node) {
        if (node.importClause == null) return; // skip side-effect imports
        const importKind = getImportKind(node);
        const importSource = node.moduleSpecifier.getText();
        const importInfo = {
          node,
          source: importSource,
          kind: importKind,
          ...decodeImportClause(node.importClause),
        } as const satisfies ImportInfo;
        const existingImports = ctx.data.imports[importKind];
        const duplicateImport = existingImports.find((imp) => imp.source === importInfo.source);
        if (duplicateImport != null) {
          ctx.report({
            node,
            message: messages.noDuplicateImports({ source: importInfo.source }),
            suggestions: importKind > 1
              ? [] // no auto fix for two import defer statements
              : [
                {
                  message: "Merge duplicate imports",
                  changes: [
                    {
                      node,
                      newText: "",
                    },
                    {
                      node: duplicateImport.node,
                      newText: buildMergedImport(duplicateImport, importInfo),
                    },
                  ],
                },
              ],
          });
          return;
        }
        existingImports.push(importInfo);
      },
    },
  };
});

function getImportKind(node: AST.ImportDeclaration): ImportKind {
  return match<ts.ImportPhaseModifierSyntaxKind | unit, ImportKind>(node.importClause?.phaseModifier)
    .with(P.nullish, () => 0)
    .with(ts.SyntaxKind.TypeKeyword, () => 1)
    .with(ts.SyntaxKind.DeferKeyword, () => 2)
    .otherwise(() => 0);
}

function decodeImportClause(node: AST.ImportClause) {
  const { name, namedBindings } = node;
  return {
    defaultImport: name?.getText(),
    namedImports: namedBindings != null
        && ts.isNamedImports(namedBindings)
      ? namedBindings.elements.map((el) => el.getText())
      : [],
    namespaceImport: namedBindings != null
        && ts.isNamespaceImport(namedBindings)
      ? namedBindings.name.getText()
      : unit,
  } as const;
}

function buildMergedImport(a: ImportInfo, b: ImportInfo): string {
  const parts: string[] = [];
  // Default import
  if (a.defaultImport != null) {
    parts.push(a.defaultImport);
  } else if (b.defaultImport != null) {
    parts.push(b.defaultImport);
  }
  // Namespace import
  if (a.namespaceImport != null) {
    parts.push(`* as ${a.namespaceImport}`);
  } else if (b.namespaceImport != null) {
    parts.push(`* as ${b.namespaceImport}`);
  }
  // Named imports
  const namedImports = Array.from(new Set([...a.namedImports, ...b.namedImports]));
  // Construct named imports part
  if (namedImports.length > 0) {
    parts.push(`{ ${namedImports.join(", ")} }`);
  }
  const importKindPrefix = match<ImportKind, string>(a.kind)
    .with(0, () => "import")
    .with(1, () => "import type")
    .with(2, () => "import defer")
    .exhaustive();
  return `${importKindPrefix} ${parts.join(", ")} from ${a.source};`;
}
