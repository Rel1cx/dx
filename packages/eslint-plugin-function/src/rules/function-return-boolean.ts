import * as AST from "@eslint-react/ast";
import { toRegExp } from "@eslint-react/shared";
import type { RuleContext, RuleFeature } from "@eslint-react/shared";
import { getConstrainedTypeAtLocation } from "@typescript-eslint/type-utils";
import { AST_NODE_TYPES as T, type TSESTree } from "@typescript-eslint/types";
import { ESLintUtils } from "@typescript-eslint/utils";
import type { RuleListener } from "@typescript-eslint/utils/ts-eslint";
import type { CamelCase } from "string-ts";
import { unionConstituents } from "ts-api-utils";
import { match } from "ts-pattern";

import { type TypeVariant, createRule, getTypeVariants } from "../utils";

export const RULE_NAME = "function-return-boolean";

export const RULE_FEATURES = [] as const satisfies RuleFeature[];

export type MessageID = CamelCase<typeof RULE_NAME>;

type Options = readonly [{ readonly pattern?: string }?];

const defaultPattern = "/^(is|has|should)/u";

export const defaultOptions = [
  {
    pattern: defaultPattern,
  },
] as const satisfies Options;

// Allowed return expression type variants
const allowedVariants = [
  "never",
  "boolean",
  "falsy boolean",
  "truthy boolean",
] as const satisfies TypeVariant[];

export default createRule<Options, MessageID>({
  meta: {
    type: "problem",
    docs: {
      description: `Enforce functions that match the pattern \`${defaultPattern}\` return a boolean.`,
      [Symbol.for("rule_features")]: RULE_FEATURES,
    },
    messages: {
      functionReturnBoolean: "The function '{{functionName}}' should return a boolean value (got {{variants}}).",
    },
    schema: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          pattern: {
            type: "string",
            description: "The pattern to match function names against.",
          },
        },
      },
    },
  },
  name: RULE_NAME,
  create,
  defaultOptions,
});

export function create(context: RuleContext<MessageID, Options>, [opts]: Options): RuleListener {
  const services = ESLintUtils.getParserServices(context, false);
  const pattern = toRegExp(opts?.pattern ?? defaultPattern);
  const functionEntries: {
    functionId: AST.FunctionID;
    functionNode: AST.TSESTreeFunction;
  }[] = [];

  function handleReturnExpression(
    context: RuleContext,
    returnExpression: TSESTree.Expression | null,
    onViolation: (expr: TSESTree.Expression | null, data: { variants: string }) => void,
  ) {
    if (returnExpression == null) {
      onViolation(returnExpression, { variants: "nullish" });
      return;
    }
    const returnType = getConstrainedTypeAtLocation(services, returnExpression);
    const parts = [...getTypeVariants(unionConstituents(returnType))];
    if (parts.every((part) => allowedVariants.some((allowed) => part === allowed))) return;
    onViolation(returnExpression, {
      variants: [...parts]
        .map((part) => `'${part}'`)
        .join(", "),
    });
  }

  return {
    [":function"](node: AST.TSESTreeFunction) {
      const functionId = AST.getFunctionId(node);
      functionEntries.push({ functionId, functionNode: node });
    },
    [":function:exit"]() {
      functionEntries.pop();
    },
    ["ArrowFunctionExpression"](node: TSESTree.ArrowFunctionExpression) {
      const { functionId, functionNode } = functionEntries.at(-1) ?? {};
      if (functionId == null || functionNode == null) return;
      const functionName = match(functionId)
        .with({ type: T.Identifier }, (id) => id.name)
        .with({ type: T.MemberExpression, property: { type: T.Identifier } }, (me) => me.property.name)
        .otherwise(() => null);
      if (functionName == null) return;
      if (!pattern.test(functionName)) return;
      if (node.body.type === T.BlockStatement) return;
      handleReturnExpression(context, node.body, (expr, data) => {
        context.report({
          messageId: "functionReturnBoolean",
          node: expr ?? node,
          data: {
            ...data,
            functionName,
          },
        });
      });
    },
    ["ReturnStatement"](node) {
      const { functionId, functionNode } = functionEntries.at(-1) ?? {};
      if (functionId == null || functionNode == null) return;
      handleReturnExpression(context, node.argument, (expr, data) => {
        const functionName = match(functionId)
          .with({ type: T.Identifier }, (id) => id.name)
          .with({ type: T.MemberExpression, property: { type: T.Identifier } }, (me) => me.property.name)
          .otherwise(() => null);
        if (functionName == null) return;
        if (!pattern.test(functionName)) return;
        context.report({
          messageId: "functionReturnBoolean",
          node: expr ?? node.argument ?? node,
          data: {
            ...data,
            functionName,
          },
        });
      });
    },
  };
}
