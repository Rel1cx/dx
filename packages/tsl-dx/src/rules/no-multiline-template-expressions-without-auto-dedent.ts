import { defineRule } from "tsl";
import { SyntaxKind } from "typescript";

import { getLine } from "../utils";

export const messages = {
  default: () => `Avoid using multiline template expressions without auto-dedent`,
} as const;

export const noMultilineTemplateExpressionsWithoutAutoDedent = defineRule(() => ({
  name: "dx/no-multiline-template-expressions-without-auto-dedent",
  visitor: {
    NoSubstitutionTemplateLiteral(ctx, node) {
      // Assuming this tag supports auto-dedentation to keep it simple
      if (node.parent.kind === SyntaxKind.TaggedTemplateExpression) return;
      const [startLine, endLine] = getLine(node);
      if (startLine !== endLine) {
        ctx.report({
          node,
          message: messages.default(),
        });
      }
    },
  },
}));
