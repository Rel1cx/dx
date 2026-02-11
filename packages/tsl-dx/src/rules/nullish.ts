import { match } from "ts-pattern";
import { defineRule } from "tsl";
import { SyntaxKind } from "typescript";

export const messages = {
  useUnitForUndefined: "Use 'unit' instead of 'undefined'.",
  useLooseNullishComparison: (p: { op: string }) => `Use '${p.op}' for nullish comparison.`,
  // suggestions
  replaceWithExpression: (p: { expr: string }) => `Replace with '${p.expr}'.`,
} as const;

export type nullishOptions = {
  runtimeLibrary?: string;
};

/**
 * Rule to enforce the use of `unit` instead of `undefined` and loose equality for nullish checks.
 *
 * @example
 *
 * ```ts
 * // Incorrect
 * let x = undefined;
 * if (x === undefined) { }
 * ```
 *
 * ```ts
 * // Correct
 * let x = unit;
 * if (x == null) { }
 * ```
 */
export const nullish = defineRule((options?: nullishOptions) => ({
  name: "dx/nullish",
  createData(ctx) {
    return {
      runtimeLibrary: options?.runtimeLibrary ?? "@local/eff",
    };
  },
  visitor: {
    Identifier(ctx, node) {
      if (node.getSourceFile().isDeclarationFile) return;
      if (node.parent.kind === SyntaxKind.BinaryExpression || node.text !== "undefined") return;
      ctx.report({
        node,
        message: messages.useUnitForUndefined,
        suggestions: [
          {
            message: messages.replaceWithExpression({ expr: "unit" }),
            changes: [
              {
                start: 0,
                end: 0,
                newText: `import { unit } from '${ctx.data.runtimeLibrary}';\n`,
              },
              {
                node,
                newText: "unit",
              },
            ],
          },
        ],
      });
    },
    UndefinedKeyword(ctx, node) {
      if (node.getSourceFile().isDeclarationFile) return;
      ctx.report({
        node,
        message: messages.useUnitForUndefined,
        suggestions: [
          {
            message: messages.replaceWithExpression({ expr: "unit" }),
            changes: [
              {
                start: 0,
                end: 0,
                newText: `import type { unit } from '${ctx.data.runtimeLibrary}';\n`,
              },
              {
                node,
                newText: "unit",
              },
            ],
          },
        ],
      });
    },
    BinaryExpression(ctx, node) {
      if (node.getSourceFile().isDeclarationFile) return;
      const newOperatorText = match(node.operatorToken.kind)
        .with(SyntaxKind.EqualsEqualsEqualsToken, () => "==")
        .with(SyntaxKind.ExclamationEqualsEqualsToken, () => "!=")
        .otherwise(() => null);
      if (newOperatorText == null) return;
      const offendingChild = [node.left, node.right].find((n) => {
        switch (n.kind) {
          case SyntaxKind.NullKeyword:
            return true;
          case SyntaxKind.Identifier:
            return n.text === "unit" || n.text === "undefined";
          default:
            return false;
        }
      });
      if (offendingChild == null) return;
      ctx.report({
        message: messages.useLooseNullishComparison({ op: newOperatorText }),
        node,
        suggestions: [
          {
            message: messages.replaceWithExpression({
              expr: offendingChild === node.left
                ? `null ${newOperatorText} ${node.right.getText()}`
                : `${node.left.getText()} ${newOperatorText} null`,
            }),
            changes: [
              {
                node: node.operatorToken,
                newText: newOperatorText,
              },
              {
                node: offendingChild,
                newText: "null",
              },
            ],
          },
        ],
      });
    },
  },
}));
