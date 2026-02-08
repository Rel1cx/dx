import ts from "typescript";

export function getLine(node: ts.Node) {
  const sourceFile = node.getSourceFile();
  return [
    sourceFile.getLineAndCharacterOfPosition(node.getStart()).line,
    sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line,
  ] as const;
}
