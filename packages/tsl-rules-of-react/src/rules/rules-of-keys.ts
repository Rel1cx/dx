import { match } from "ts-pattern";
import { type AST, type Context, defineRule } from "tsl";
import { findParentNode, getFullyQualifiedNameEx } from "tsl-shared";
import ts from "typescript";

const API_NAMES_REQUIRE_KEYS = new Set([
  "Array.map",
  "Array.flatMap",
]);

export const rulesOfKeys = defineRule(() => {
  return {
    name: "rules-of-react/rules-of-keys",
    createData(ctx) {
      const { jsxFragmentFactory = "React.Fragment" } = ctx.program.getCompilerOptions();
      return {
        jsxFragmentFactory,
      };
    },
    visitor: {
      JsxElement(ctx, node) {
        check(ctx, node);
      },
      JsxSelfClosingElement(ctx, node) {
        check(ctx, node);
      },
      JsxFragment(ctx, node) {
        check(ctx, node);
      },
    },
  };
});

function check(
  ctx: Context<{ jsxFragmentFactory: string }>,
  node: AST.JsxElement | AST.JsxSelfClosingElement | AST.JsxFragment,
) {
  // Rule000: Keys must be unique among siblings.
  // Rule002: Keys must not change, or that defeats their purpose! Don't generate them while rendering.
  const enclosing = findParentNode(node, n => {
    if (n.kind === ts.SyntaxKind.JsxElement || n.kind === ts.SyntaxKind.JsxFragment) return true;
    if (n.kind === ts.SyntaxKind.FunctionDeclaration) return true;
    if (n.kind === ts.SyntaxKind.ArrowFunction || n.kind === ts.SyntaxKind.FunctionExpression) {
      if (n.parent.kind !== ts.SyntaxKind.CallExpression) return false;
      const callee = match(n.parent.expression)
        .with({ kind: ts.SyntaxKind.PropertyAccessExpression }, n => n.name.getText())
        .otherwise(() => null);
      if (callee == null) return false;
      const typ = ctx.checker.getTypeAtLocation(n.parent.expression);
      const sym = typ.getSymbol();
      if (sym == null) return false;
      const fqn = getFullyQualifiedNameEx(ctx.checker, sym);
      return API_NAMES_REQUIRE_KEYS.has(fqn);
    }
    return false;
  });
  if (enclosing == null) return;
  if (enclosing.kind === ts.SyntaxKind.FunctionDeclaration) return;
  if (enclosing.kind === ts.SyntaxKind.JsxElement || enclosing.kind === ts.SyntaxKind.JsxFragment) return;
  if (node.kind === ts.SyntaxKind.JsxFragment) {
    const { jsxFragmentFactory } = ctx.data;
    ctx.report({
      node,
      message:
        `The '<></>' syntax cant have keys, so it can't be used as a child in list rendering. Use '<${jsxFragmentFactory} key={...}>...</${jsxFragmentFactory}>' instead.`,
    });
    return;
  }
  const attributes = node.kind === ts.SyntaxKind.JsxElement
    ? node.openingElement.attributes
    : node.attributes;
  const key = attributes.properties.find(n => n.name?.getText() === "key");
  if (key == null) {
    ctx.report({
      node,
      message: "Keys must be used when rendering lists.",
    });
  }
}
