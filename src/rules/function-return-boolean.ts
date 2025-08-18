import * as AST from "@eslint-react/ast";
import * as ER from "@eslint-react/core";
import { type unit } from "@eslint-react/eff";
import { RegExp as RE } from "@eslint-react/kit";
import type { RuleContext, RuleFeature } from "@eslint-react/kit";
import { getConstrainedTypeAtLocation } from "@typescript-eslint/type-utils";
import { AST_NODE_TYPES as T, type TSESTree } from "@typescript-eslint/types";
import { ESLintUtils } from "@typescript-eslint/utils";
import type { RuleListener } from "@typescript-eslint/utils/ts-eslint";
import type { CamelCase } from "string-ts";
import { unionConstituents } from "ts-api-utils";

import { createRule } from "../utils";

export const RULE_NAME = "function-return-boolean";

export const RULE_FEATURES = [] as const satisfies RuleFeature[];

export type MessageID = CamelCase<typeof RULE_NAME>;

type Options = readonly [
  | unit
  | {
    readonly pattern?: string;
  },
];

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
] as const satisfies ER.TypeVariant[];

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
    schema: [{
      type: "object",
      additionalProperties: false,
      properties: {
        pattern: {
          type: "string",
          description: "The pattern to match function names against.",
        },
      },
    }],
  },
  name: RULE_NAME,
  create,
  defaultOptions,
});

export function create(context: RuleContext<MessageID, Options>, [opts]: Options): RuleListener {
  const services = ESLintUtils.getParserServices(context, false);
  const pattern = RE.toRegExp(opts?.pattern ?? defaultPattern);
  const functionEntries: { functionName: unit | string; functionNode: AST.TSESTreeFunction; isMatched: boolean }[] = [];

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
    const parts = [...ER.getTypeVariants(unionConstituents(returnType))];
    if (parts.every((part) => allowedVariants.some((allowed) => part === allowed))) return;
    onViolation(returnExpression, {
      variants: [...parts]
        .map((part) => `'${part}'`)
        .join(", "),
    });
  }

  return {
    [":function"](node: AST.TSESTreeFunction) {
      const functionName = AST.getFunctionId(node)?.name;
      const isMatched = functionName != null && pattern.test(functionName);
      functionEntries.push({ functionName, functionNode: node, isMatched });
    },
    [":function:exit"]() {
      functionEntries.pop();
    },
    ["ArrowFunctionExpression"](node: TSESTree.ArrowFunctionExpression) {
      const { functionName, isMatched = false } = functionEntries.at(-1) ?? {};
      if (functionName == null || !isMatched) return;
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
      const { functionName, functionNode, isMatched = false } = functionEntries.at(-1) ?? {};
      if (functionName == null || functionNode == null || !isMatched) return;
      handleReturnExpression(context, node.argument, (expr, data) => {
        const functionName = AST.getFunctionId(functionNode)?.name;
        if (functionName == null) return;
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
