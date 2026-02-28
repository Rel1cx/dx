import { type AST, defineRule } from "tsl";
import { SyntaxKind } from "typescript";

export const messages = {
  useDedentTag: () => "Use a dedent tag to auto-dedent this template expression's content.",
  // suggestions
  addDedentTag: (p: { name: string }) => `Add a/an '${p.name}' tag to this template expression to auto-dedent its content.`,
} as const;

export type noMultilineTemplateExpressionWithoutAutoDedentOptions = {
  dedentTagNames?: string[];
  dedentTagImportCallback?: (name: string) => string;
};

/**
 * Rule to enforce the use of a dedent tag for multiline template expressions.
 *
 * @example
 *
 * ```ts
 * // Incorrect
 * const message = `
 *   Hello
 *   World
 * `;
 * ```
 *
 * ```ts
 * // Correct
 * import dedent from "dedent";
 * const message = dedent`
 *   Hello
 *   World
 * `;
 * ```
 */
export const noMultilineTemplateExpressionWithoutAutoDedent = defineRule((options?: noMultilineTemplateExpressionWithoutAutoDedentOptions) => {
  const dedentTagNames = options
    ?.dedentTagNames
    ?? ["dedent"];
  const dedentTagImportCallback = options
    ?.dedentTagImportCallback
    ?? ((name: string) => `import ${name} from "dedent";\n`);
  function getLine(node: AST.AnyNode) {
    const sourceFile = node.getSourceFile();
    return [
      sourceFile.getLineAndCharacterOfPosition(node.getStart()).line,
      sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line,
    ] as const;
  }
  return {
    name: "dx/no-multiline-template-expression-without-auto-dedent",
    visitor: {
      NoSubstitutionTemplateLiteral(ctx, node) {
        const parent = node.parent;
        // Assuming this tag supports auto-dedentation to keep it simple
        if (parent.kind === SyntaxKind.TaggedTemplateExpression) return;
        const [startLine, endLine] = getLine(node);
        if (startLine !== endLine) {
          ctx.report({
            node,
            message: messages.useDedentTag(),
            suggestions: dedentTagNames
              .map(name => {
                return {
                  message: messages.addDedentTag({ name }),
                  changes: [
                    {
                      start: 0,
                      end: 0,
                      newText: dedentTagImportCallback(name),
                    },
                    {
                      node,
                      newText: `${name}${node.getFullText()}`,
                    },
                  ],
                };
              }),
          });
        }
      },
    },
  };
});
