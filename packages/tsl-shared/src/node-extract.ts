import type { AST } from "tsl";
import { isTypeExpression } from "./node-check";
import type { TypeExpression } from "./node-types";

/**
 * Recursively unwrap TypeScript type expressions to get the underlying expression.
 * @param node The node to unwrap.
 * @returns The innermost non-type-expression node — a reference into the original tree, never a copy.
 */
export function unwrap(node: TypeExpression): Exclude<AST.Expression, TypeExpression>;
export function unwrap<T extends AST.AnyNode>(node: T): Exclude<T, TypeExpression>;
export function unwrap(node: AST.AnyNode): AST.AnyNode {
  if (isTypeExpression(node)) {
    return unwrap(node.expression);
  }
  return node;
}
