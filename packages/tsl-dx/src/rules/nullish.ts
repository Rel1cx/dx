import { match } from "ts-pattern";
import { defineRule } from "tsl";
import ts, { SyntaxKind } from "typescript";

import { printNode } from "../utils/print-node";

export const messages = {
  default: (p: { op: string }) => `Use '${p.op}' for nullish comparison.`,
  // suggestions
  replace: (p: { expr: string }) => `Replace with '${p.expr}'.`,
} as const;

export type nullishOptions = {
  runtimeLibrary?: string;
};

/**
 * Rule to enforce the use of loose equality for nullish checks.
 *
 * @example
 *
 * ```ts
 * // Incorrect
 * if (x === undefined) { }
 * ```
 *
 * ```ts
 * // Correct
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
        .with(SyntaxKind.EqualsEqualsEqualsToken, () => "==" as const)
        .with(SyntaxKind.ExclamationEqualsEqualsToken, () => "!=" as const)
        .otherwise(() => null);
      if (newOperatorText == null) return;
      const operatorToken = newOperatorText === "=="
        ? ts.factory.createToken(ts.SyntaxKind.EqualsEqualsToken)
        : ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsToken);
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
      const nullNode = ts.factory.createNull();
      ctx.report({
        message: messages.default({ op: newOperatorText }),
        node,
        suggestions: [
          {
            message: messages.replace({
              expr: printNode(
                offendingChild === node.left
                  // @ts-expect-error - type issue
                  ? ts.factory.createBinaryExpression(nullNode, operatorToken, node.right)
                  // @ts-expect-error - type issue
                  : ts.factory.createBinaryExpression(node.left, operatorToken, nullNode),
              ),
            }),
            changes: [
              {
                node: node.operatorToken,
                newText: printNode(operatorToken),
              },
              {
                node: offendingChild,
                newText: printNode(nullNode),
              },
            ],
          },
        ],
      });
    },
  },
}));
