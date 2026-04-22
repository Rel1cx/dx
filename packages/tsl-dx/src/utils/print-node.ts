import ts from "typescript";

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const dummySourceFile = ts.createSourceFile("", "", ts.ScriptTarget.Latest);

export function printNode(node: ts.Node): string {
  return printer.printNode(ts.EmitHint.Unspecified, node, dummySourceFile);
}
