import { match } from "ts-pattern";
import { defineRule } from "tsl";
import { getFullyQualifiedNameEx } from "tsl-shared";

export const rulesOfProps = defineRule(() => {
  return {
    name: "rules-of-react/rules-of-props",
    visitor: {
      JsxSpreadAttribute(ctx, node) {
        // Rule001: Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes.
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
              message:
                "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
            });
          }
        }
      },
    },
  };
});
