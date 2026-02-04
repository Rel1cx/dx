import { match } from "ts-pattern";
import { defineRule } from "tsl";
import { SyntaxKind } from "typescript";

export const messages = {
  default: (p: { op: string }) => `Use '${p.op}' for nullish comparison.`,
  replace: (p: { expr: string }) => `Replace with '${p.expr}'.`,
} as const;

/**
 * Enforces the use of '==' and '!=' for nullish comparisons (i.e., comparisons to null or undefined)
 *
 * Rationale:
 * In TypeScript, using '==' and '!=' for nullish comparisons is a common practice because it checks for both null and undefined values
 * This rule promotes consistency in codebases by ensuring that developers use the appropriate operators for nullish checks
 */
export const nullishComparison = defineRule(() => ({
  name: "dx/nullish-comparison",
  visitor: {
    BinaryExpression(context, node) {
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
            return n.escapedText === "undefined";
          default:
            return false;
        }
      });
      if (offendingChild == null) return;
      context.report({
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
