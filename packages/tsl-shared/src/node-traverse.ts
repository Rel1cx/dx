import type { AST } from "tsl";
import ts from "typescript";

type NodePredicate = (node: AST.AnyNode) => boolean;

/**
 * Find the parent node that satisfies the test function
 * @param node The AST node
 * @param test The test function
 * @param stop The stop function
 * @returns The parent node that satisfies the test function or `_` if not found
 */
function findParent<A extends AST.AnyNode>(node: AST.AnyNode | null, test: (n: AST.AnyNode) => n is A, stop?: NodePredicate): A | null;
/**
 * Find the parent node that satisfies the test function or `_` if not found
 * @param node The AST node
 * @param test The test function
 * @param stop The stop function
 * @returns The parent node that satisfies the test function
 */
function findParent(node: AST.AnyNode | null, test: (node: AST.AnyNode) => boolean, stop?: NodePredicate): AST.AnyNode | null;
function findParent<A extends AST.AnyNode>(
  node: AST.AnyNode | null,
  test: ((node: AST.AnyNode) => boolean) | ((n: AST.AnyNode) => n is A),
  stop?: NodePredicate,
): AST.AnyNode | A | null {
  if (node == null) return null;
  // @ts-expect-error - wait for tsl to fix the issue
  let parent: AST.AnyNode = node.parent;
  while (parent.kind !== ts.SyntaxKind.SourceFile) {
    if ((stop?.(parent)) ?? false) return null;
    if (test(parent)) {
      return parent;
    }
    parent = parent.parent;
  }
  return null;
}

export { findParent };
