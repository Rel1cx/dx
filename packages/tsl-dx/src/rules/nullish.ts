import { match } from "ts-pattern";
import { defineRule } from "tsl";
import { SyntaxKind } from "typescript";

export const messages = {
  default: (p: { op: string }) => `Use '${p.op}' for nullish comparison.`,
  // suggestions
  replace: (p: { expr: string }) => `Replace with '${p.expr}'.`,
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
    BinaryExpression(ctx, node) {
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
        message: messages.default({ op: newOperatorText }),
        node,
        suggestions: [
          {
            message: messages.replace({
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
