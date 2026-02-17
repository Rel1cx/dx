import { unit } from "@local/eff";
import type { AST } from "tsl";
import ts from "typescript";

/**
 * Find the parent node that satisfies the test function
 * @param node The AST node
 * @param test The test function
 * @returns The parent node that satisfies the test function or `_` if not found
 */
function findParentNode<A extends AST.AnyNode>(
  node: AST.AnyNode | unit,
  test: (n: AST.AnyNode) => n is A,
): A | unit;

/**
 * Find the parent node that satisfies the test function or `_` if not found
 * @param node The AST node
 * @param test The test function
 * @returns The parent node that satisfies the test function
 */
function findParentNode(node: AST.AnyNode | unit, test: (node: AST.AnyNode) => boolean): AST.AnyNode | unit;
function findParentNode<A extends AST.AnyNode>(
  node: AST.AnyNode | unit,
  // tsl-ignore core/noRedundantTypeConstituents
  test: ((node: AST.AnyNode) => boolean) | ((n: AST.AnyNode) => n is A),
): AST.AnyNode | A | unit {
  if (node == null) return unit;
  let parent = node.parent;
  while (parent.kind !== ts.SyntaxKind.SourceFile) {
    // @ts-expect-error - wait for tsl to fix the issue
    if (test(parent)) {
      // @ts-expect-error - wait for tsl to fix the issue
      return parent;
    }
    parent = parent.parent;
  }
  return unit;
}

export { findParentNode };
