import type { AST } from "tsl";
import ts from "typescript";

/**
 * Find the parent node that satisfies the test function
 * @param node The AST node
 * @param test The test function
 * @returns The parent node that satisfies the test function or `_` if not found
 */
function findParentNode<A extends AST.AnyNode>(
  node: AST.AnyNode | null,
  test: (n: AST.AnyNode) => n is A,
): A | null;

/**
 * Find the parent node that satisfies the test function or `_` if not found
 * @param node The AST node
 * @param test The test function
 * @returns The parent node that satisfies the test function
 */
function findParentNode(node: AST.AnyNode | null, test: (node: AST.AnyNode) => boolean): AST.AnyNode | null;
function findParentNode<A extends AST.AnyNode>(
  node: AST.AnyNode | null,
  // tsl-ignore core/noRedundantTypeConstituents
  test: ((node: AST.AnyNode) => boolean) | ((n: AST.AnyNode) => n is A),
): AST.AnyNode | A | null {
  if (node == null) return null;
  let parent = node.parent;
  while (parent.kind !== ts.SyntaxKind.SourceFile) {
    // @ts-expect-error - wait for tsl to fix the issue
    if (test(parent)) {
      // @ts-expect-error - wait for tsl to fix the issue
      return parent;
    }
    parent = parent.parent;
  }
  return null;
}

export { findParentNode };
