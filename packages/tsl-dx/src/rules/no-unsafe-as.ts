import { type AST, defineRule } from "tsl";
import ts, { SyntaxKind } from "typescript";

export const messages = {
  default: (p: { type: string }) => `Unexpected 'as ${p.type}'. Only 'as const' and 'as unknown' are allowed.`,
} as const;

/**
 * Rule to disallow type assertions via `as` except for `as const` and `as unknown`.
 *
 * @example
 *
 * ```ts
 * // 🔴
 * const x = value as string;
 * ```
 *
 * ```ts
 * // 🟢
 * const x = value as unknown;
 * const y = [1, 2, 3] as const;
 * ```
 */
export const noUnsafeAs = defineRule(() => {
  function isConstType(node: AST.TypeNode) {
    return ts.isTypeReferenceNode(node) && ts.isIdentifier(node.typeName) && node.typeName.text === "const";
  }
  return {
    name: "dx/no-unsafe-as",
    visitor: {
      AsExpression(ctx, node) {
        if (isConstType(node.type) || node.type.kind === SyntaxKind.UnknownKeyword) {
          return;
        }
        ctx.report({
          node,
          message: messages.default({ type: node.type.getText() }),
        });
      },
    },
  };
});
