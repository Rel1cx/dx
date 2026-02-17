import { type AST, defineRule } from "tsl";
import ts from "typescript";

export const messages = [] as const;

/**
 * TS checks for most of the issues described at https://react.dev/learn/writing-markup-with-jsx#the-rules-of-jsx
 * by default, so there isn't much for us to implement.
 */
export const rulesOfJsx = defineRule(() => {
  return {
    name: "rules-of-react/rules-of-jsx",
    createData(ctx) {
      const { jsx = ts.JsxEmit.ReactJSX } = ctx.program.getCompilerOptions();
      return {
        isNewJsxTransform: jsx === ts.JsxEmit.ReactJSX || jsx === ts.JsxEmit.ReactJSXDev,
      };
    },
    visitor: {
      JsxAttribute(ctx, node) {
        // Rule000: Don't pass children as a prop. Instead, put the children between the opening and closing tags.
        if (node.name.getText() === "children") {
          ctx.report({
            node,
            message: "Don't pass children as a prop. Instead, put the children between the opening and closing tags.",
          });
        }
      },
      // Rule001: When using the new JSX transform, 'key' must be placed before any spread props.
      JsxAttributes(ctx, node) {
        if (!ctx.data.isNewJsxTransform) return;
        let firstSpreadAttrIndex: null | number = null;
        for (const [index, attr] of node.properties.entries()) {
          if (attr.kind === ts.SyntaxKind.JsxSpreadAttribute) {
            firstSpreadAttrIndex ??= index;
            continue;
          }
          if (firstSpreadAttrIndex == null) {
            continue;
          }
          if (attr.name.getText() === "key" && index > firstSpreadAttrIndex) {
            ctx.report({
              node: attr,
              message: "The 'key' prop must be placed before any spread props when using the new JSX transform.",
            });
          }
        }
      },
    },
  };
});
