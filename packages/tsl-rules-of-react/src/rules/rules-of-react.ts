import { match } from "ts-pattern";
import { type AST, type Context, defineRule } from "tsl";
import { type JsxElementLike, findParentNode, getFullyQualifiedNameEx } from "tsl-shared";
import ts from "typescript";

const API_NAMES_REQUIRE_KEYS = new Map<string, number>([
  ["Array.map", 1],
  ["Array.flatMap", 1],
]);

export type Ctx = Context<{
  jsx: ts.JsxEmit;
  jsxFactory: string;
  jsxFragmentFactory: string;
}>;

function isNewJsxTransform({ jsx }: { jsx: ts.JsxEmit }) {
  return jsx === ts.JsxEmit.ReactJSX || jsx === ts.JsxEmit.ReactJSXDev;
}

export const rulesOfReact = defineRule(() => {
  return {
    name: "rules-of-react/rules-of-react",
    createData(ctx) {
      const {
        jsx = ts.JsxEmit.ReactJSX,
        jsxFactory = "React.createElement",
        jsxFragmentFactory = "React.Fragment",
      } = ctx.program.getCompilerOptions();
      return {
        jsx,
        jsxFactory,
        jsxFragmentFactory,
      };
    },
    visitor: {
      // Rules of JSX
      JsxAttribute(ctx, node) {
        // ERR000: Don't pass children as a prop. Instead, put the children between the opening and closing tags.
        if (node.name.getText() === "children") {
          ctx.report({
            node,
            message: "Don't pass children as a prop. Instead, put the children between the opening and closing tags.",
          });
        }
      },
      // ERR001: When using the new JSX transform, 'key' must be placed before any spread props.
      JsxAttributes(ctx, node) {
        if (!isNewJsxTransform(ctx.data)) return;
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
      // Rules of Keys
      JsxElement(ctx, node) {
        checkKeys(ctx, node);
      },
      JsxSelfClosingElement(ctx, node) {
        checkKeys(ctx, node);
      },
      JsxFragment(ctx, node) {
        checkKeys(ctx, node);
      },
      // Rules of Props
      JsxSpreadAttribute(ctx, node) {
        // ERR002: Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes.
        for (const type of ctx.utils.unionConstituents(ctx.utils.getConstrainedTypeAtLocation(node.expression))) {
          for (const name of ["key", "ref", "children"] as const) {
            const sym = type.getProperty(name);
            if (sym == null) continue;
            const fqn = getFullyQualifiedNameEx(ctx.checker, sym);
            const allowed = match(name)
              .with("key", () => fqn.endsWith("Attributes.key"))
              .with("ref", () => fqn.endsWith("Attributes.ref"))
              .with("children", () => fqn.toLowerCase().includes("react"))
              .otherwise(() => false);
            if (allowed) continue;
            ctx.report({
              node,
              message: "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
            });
          }
        }
      },
    },
  };
});

// ERR003: Keys must be unique among siblings.
// ERR004: Keys must not change, or that defeats their purpose! Don't generate them while rendering.
function checkKeys(ctx: Ctx, node: JsxElementLike) {
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
  if (enclosing.kind === ts.SyntaxKind.JsxElement || enclosing.kind === ts.SyntaxKind.JsxFragment) {
    return;
  }
  if (node.kind === ts.SyntaxKind.JsxFragment) {
    const { jsxFragmentFactory } = ctx.data;
    ctx.report({
      node,
      message: `The '<></>' syntax cant have keys, so it can't be used as a child in list rendering. Use '<${jsxFragmentFactory} key={...}>...</${jsxFragmentFactory}>' instead.`,
    });
    return;
  }
  const attributes = node.kind === ts.SyntaxKind.JsxElement ? node.openingElement.attributes : node.attributes;
  const key = attributes.properties.find(n => n.name?.getText() === "key");
  if (key == null) {
    ctx.report({
      node,
      message: "Keys must be used when rendering lists.",
    });
    return;
  }
  // ERR005: Don't use array index as key.
  if ((enclosing.kind === ts.SyntaxKind.ArrowFunction || enclosing.kind === ts.SyntaxKind.FunctionExpression) && key.kind === ts.SyntaxKind.JsxAttribute) {
    if (enclosing.parent.kind === ts.SyntaxKind.CallExpression) {
      const sym = ctx.checker.getTypeAtLocation(enclosing.parent.expression).getSymbol();
      if (sym != null) {
        const fqn = getFullyQualifiedNameEx(ctx.checker, sym);
        const indexParamPosition = API_NAMES_REQUIRE_KEYS.get(fqn);
        if (indexParamPosition != null) {
          const indexParam = enclosing.parameters[indexParamPosition];
          if (indexParam != null) {
            const keyInit = key.initializer;
            if (keyInit != null && keyInit.kind === ts.SyntaxKind.JsxExpression && keyInit.expression != null) {
              // ERR006: Keys must be unique among siblings.
              function referencesParam(ctx: Ctx, expr: AST.Expression, param: AST.ParameterDeclaration) {
                const paramSymbol = ctx.checker.getSymbolAtLocation(param.name);
                if (paramSymbol == null) return false;

                function check(node: AST.Expression): boolean {
                  if (node.kind === ts.SyntaxKind.Identifier) {
                    return ctx.checker.getSymbolAtLocation(node) === paramSymbol;
                  }
                  if (node.kind === ts.SyntaxKind.TemplateExpression) {
                    return node.templateSpans.some(span => check(span.expression));
                  }
                  if (node.kind === ts.SyntaxKind.BinaryExpression) {
                    return check(node.left) || check(node.right);
                  }
                  if (node.kind === ts.SyntaxKind.CallExpression) {
                    // index.toString() or other method calls directly on the index
                    if (node.expression.kind === ts.SyntaxKind.PropertyAccessExpression && check(node.expression.expression)) {
                      return true;
                    }
                    // String(index)
                    if (node.expression.kind === ts.SyntaxKind.Identifier && node.expression.text === "String") {
                      return node.arguments.some(arg => check(arg));
                    }
                  }
                  if (node.kind === ts.SyntaxKind.ParenthesizedExpression) {
                    return check(node.expression);
                  }
                  return false;
                }

                return check(expr);
              }
              if (referencesParam(ctx, keyInit.expression, indexParam)) {
                ctx.report({
                  node: key,
                  message: "Don't use array index as key. Keys should be stable and unique identifiers that don't change between renders.",
                });
              }
            }
          }
        }
      }
    }
  }
}
