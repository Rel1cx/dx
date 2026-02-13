import { type AST, defineRule } from "tsl";
import { getFullyQualifiedNameEx } from "tsl-shared";
import ts from "typescript";

export const messages = [
  /**
   * Rule000
   * @todo Not implemented yet.
   */
  "Keys must be unique among siblings.",
  /**
   * Rule001
   * @todo Not implemented yet.
   */
  "Keys must be used when rendering lists. Each child in a list should have a unique 'key' prop.",
  /**
   * Rule002
   * @todo Not implemented yet.
   */
  "Keys must not change, or that defeats their purpose! Don't generate them while rendering.",
  /**
   * Rule003
   */
  "Keys must be placed before any spread props when using the new JSX transform.",
  /**
   * Rule004
   */
  "Keys must not be implicitly passed via spread props whose values contain a 'key' property not typed as 'React.Attributes.key'.",
] as const;

export const rulesOfKeys = defineRule(() => {
  return {
    name: "rules-of-react/rules-of-keys",
    createData(ctx) {
      const { jsx = "react-jsx" } = ctx.program.getCompilerOptions();
      return {
        isNewJsxTransform: jsx === ts.JsxEmit.ReactJSX || jsx === ts.JsxEmit.ReactJSXDev,
      };
    },
    visitor: {
      JsxSpreadAttribute(ctx, node) {
        const types = ctx.utils.unionConstituents(ctx.utils.getConstrainedTypeAtLocation(node.expression));
        for (const type of types) {
          const key = type.getProperty("key");
          if (key == null) continue;
          const fqn = getFullyQualifiedNameEx(ctx.checker, key);
          if (fqn.toLowerCase().trim().endsWith("react.attributes.key")) continue;
          ctx.report({
            node,
            message: messages[4],
          });
        }
        if (!ctx.data.isNewJsxTransform) return;
        const element = node.parent.parent;
        if (element.kind !== ts.SyntaxKind.JsxOpeningElement && element.kind !== ts.SyntaxKind.JsxSelfClosingElement) {
          return;
        }
        const children: ts.Node[] = [];
        ts.forEachChild(element.attributes, (n) => void children.push(n));
        let firstSpreadAttrIndex: null | number = null;
        for (const [index, attr] of children.entries()) {
          if (attr.kind === ts.SyntaxKind.JsxSpreadAttribute) {
            firstSpreadAttrIndex ??= index;
            continue;
          }
          if (firstSpreadAttrIndex == null) {
            continue;
          }
          const name = attr.getChildAt(0);
          if (name.getText() === "key" && index > firstSpreadAttrIndex) {
            ctx.report({
              message: messages[3],
              node: attr,
            });
          }
        }
      },
    },
  };
});
