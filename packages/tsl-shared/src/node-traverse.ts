import type { AST } from "tsl";
import ts from "typescript";

type Predicate<T extends AST.AnyNode> = (node: AST.AnyNode) => node is T;
type NodePredicate = (node: AST.AnyNode) => boolean;

/**
 * Walk up the AST from `node` to find the nearest ancestor matching a predicate.
 * @param node The starting node for the upward search.
 * @param test The predicate a candidate ancestor must satisfy.
 * @param stop An optional predicate that aborts the search when it returns `true`.
 * @returns The first matching ancestor, or `null` when none is found.
 */
export function findParent<T extends AST.AnyNode>(node: AST.AnyNode | null, test: Predicate<T>, stop?: NodePredicate): T | null;
export function findParent(node: AST.AnyNode | null, test: NodePredicate, stop?: NodePredicate): AST.AnyNode | null;
export function findParent(node: AST.AnyNode | null, test: NodePredicate, stop?: NodePredicate): AST.AnyNode | null {
  if (node == null) return null;
  // @ts-expect-error - wait for tsl to fix the issue
  let current: AST.AnyNode | null = node.parent;
  while (current != null) {
    if (stop?.(current) ?? false) return null;
    if (test(current)) return current;
    if (current.kind === ts.SyntaxKind.SourceFile) return null;
    current = current.parent;
  }
  return null;
}

/**
 * Check whether `node` has an ancestor matching a predicate.
 * @param node The starting node for the upward search.
 * @param test The predicate a candidate ancestor must satisfy.
 * @param stop An optional predicate that aborts the search when it returns `true`.
 * @returns `true` when a matching ancestor exists.
 */
export function hasParent<T extends AST.AnyNode>(node: AST.AnyNode | null, test: Predicate<T>, stop?: NodePredicate): boolean;
export function hasParent(node: AST.AnyNode | null, test: NodePredicate, stop?: NodePredicate): boolean;
export function hasParent(node: AST.AnyNode | null, test: NodePredicate, stop?: NodePredicate): boolean {
  return findParent(node, test, stop) != null;
}

/**
 * Find the nearest `TryStatement` whose `try` block (not `catch`/`finally`) encloses the given node.
 * @param node The node to check.
 * @returns The enclosing `TryStatement`, or `null` when none is found.
 */
export function findEnclosingTryBlock(node: AST.AnyNode): AST.TryStatement | null {
  const parent = node.parent;
  if (parent == null || parent.kind === ts.SyntaxKind.SourceFile) return null;
  if (parent.kind === ts.SyntaxKind.TryStatement && node === parent.tryBlock) return parent;
  // @ts-expect-error - wait for tsl to fix the issue
  return findEnclosingTryBlock(parent);
}

/**
 * Check whether the given node is enclosed by the `try` block (not `catch`/`finally`) of a `TryStatement`.
 * @param node The node to check.
 * @returns `true` when an enclosing `try` block exists.
 */
export function hasEnclosingTryBlock(node: AST.AnyNode): boolean {
  return findEnclosingTryBlock(node) != null;
}
