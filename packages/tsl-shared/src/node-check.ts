import type { AST } from "tsl";
import ts from "typescript";

import type { TypeExpression } from "./node-types";

/**
 * Check if a node is a TypeScript type expression (the nodes `unwrap` strips).
 * @param node The node to check.
 * @returns `true` if the node is a type expression.
 */
export function isTypeExpression(node: AST.AnyNode): node is TypeExpression {
  return node.kind === ts.SyntaxKind.AsExpression
    || node.kind === ts.SyntaxKind.ExpressionWithTypeArguments
    || node.kind === ts.SyntaxKind.NonNullExpression
    || node.kind === ts.SyntaxKind.SatisfiesExpression
    || node.kind === ts.SyntaxKind.TypeAssertionExpression;
}
