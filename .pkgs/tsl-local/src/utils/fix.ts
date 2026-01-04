/**
 * Replaces the text of a node with new text.
 * @param node The node to replace.
 * @param newText The new text to insert.
 * @returns An object containing the start and end positions of the node and the new text.
 */
export function replaceNodeText(node: { getStart: () => number; getEnd: () => number }, newText: string) {
  return {
    start: node.getStart(),
    end: node.getEnd(),
    newText,
  } as const;
}
