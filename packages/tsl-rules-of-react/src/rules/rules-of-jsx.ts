import { type AST, defineRule } from "tsl";
import ts from "typescript";

export const messages = {
  /**
   * Enforces 'key' prop placement before spread props.
   */
  keyMustBeforeSpread: "The 'key' prop must be placed before any spread props when using the new JSX transform.",
  /**
   * @todo: Add the rest of messages
   */
};

/**
 * @todo: implement this
 */
export const rulesOfJsx = defineRule(() => {
  return {
    name: "rules-of-react/rules-of-jsx",
    createData(ctx) {
      const {
        jsx = "react-jsx",
        // jsxFactory = "React.createElement",
        // jsxFragmentFactory = "React.Fragment",
        // jsxImportSource = "react",
      } = ctx.program.getCompilerOptions();
      return {
        isNewJsxTransform: jsx === ts.JsxEmit.ReactJSX || jsx === ts.JsxEmit.ReactJSXDev,
      };
    },
    visitor: {
      JsxSpreadAttribute(ctx, node) {
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
          // If a 'key' attribute is found after a spread attribute, report the keyMustBeforeSpread error
          if (name.getText() === "key" && index > firstSpreadAttrIndex) {
            ctx.report({
              message: messages.keyMustBeforeSpread,
              node: attr,
            });
          }
        }
      },
    },
  };
});
