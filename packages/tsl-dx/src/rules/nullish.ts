import { match } from "ts-pattern";
import { defineRule } from "tsl";
import { SyntaxKind } from "typescript";

export const messages = {
  useUnitForUndefined: "Use 'unit' instead of 'undefined'.",
  useLooseNullishComparison: (p: { op: string }) => `Use '${p.op}' for nullish comparison.`,
} as const;

export const suggestions = {
  replaceWithExpression: (p: { expr: string }) => `Replace with '${p.expr}'.`,
};

export interface nullishOptions {
  runtimeLibrary?: string;
}

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
            message: suggestions.replaceWithExpression({ expr: "unit" }),
            changes: [
              {
                node,
                newText: "unit",
              },
              {
                start: 0,
                end: 0,
                newText: `import { unit } from '${ctx.data.runtimeLibrary}';\n`,
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
            message: suggestions.replaceWithExpression({ expr: "unit" }),
            changes: [
              {
                node,
                newText: "unit",
              },
              {
                start: 0,
                end: 0,
                newText: `import type { unit } from '${ctx.data.runtimeLibrary}';\n`,
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
            message: suggestions.replaceWithExpression({
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
