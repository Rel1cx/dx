import { ESLintUtils } from '@typescript-eslint/utils';
import * as AST from '@eslint-react/ast';
import * as ER from '@eslint-react/core';
import '@eslint-react/eff';
import { RegExp } from '@eslint-react/kit';
import { getConstrainedTypeAtLocation } from '@typescript-eslint/type-utils';
import { AST_NODE_TYPES } from '@typescript-eslint/types';
import { unionConstituents } from 'ts-api-utils';

// package.json
var name = "eslint-plugin-function";
var version = "0.0.22";
function getDocsUrl() {
  return "TODO: add docs for local ESLint rules";
}
var createRule = ESLintUtils.RuleCreator(getDocsUrl);

// src/rules/function-definition.ts
var RULE_NAME = "function-definition";
var RULE_FEATURES = [];
var function_definition_default = createRule({
  meta: {
    type: "problem",
    docs: {
      description: "Enforce a consistent function definition style.",
      [Symbol.for("rule_features")]: RULE_FEATURES
    },
    messages: {
      functionDefinition: ""
    },
    schema: []
  },
  name: RULE_NAME,
  create,
  defaultOptions: []
});
function create(context) {
  return {};
}

// src/rules/function-name.ts
var RULE_NAME2 = "function-name";
var RULE_FEATURES2 = [];
var function_name_default = createRule({
  meta: {
    type: "problem",
    docs: {
      description: "Enforce a consistent function naming style.",
      [Symbol.for("rule_features")]: RULE_FEATURES2
    },
    messages: {
      functionName: ""
    },
    schema: []
  },
  name: RULE_NAME2,
  create: create2,
  defaultOptions: []
});
function create2(context) {
  return {};
}
var RULE_NAME3 = "function-return-boolean";
var RULE_FEATURES3 = [];
var defaultPattern = "/^(is|has|should)/u";
var defaultOptions = [
  {
    pattern: defaultPattern
  }
];
var allowedVariants = [
  "never",
  "boolean",
  "falsy boolean",
  "truthy boolean"
];
var function_return_boolean_default = createRule({
  meta: {
    type: "problem",
    docs: {
      description: `Enforce functions that match the pattern \`${defaultPattern}\` return a boolean.`,
      [Symbol.for("rule_features")]: RULE_FEATURES3
    },
    messages: {
      functionReturnBoolean: "The function '{{functionName}}' should return a boolean value (got {{variants}})."
    },
    schema: [{
      type: "object",
      additionalProperties: false,
      properties: {
        pattern: {
          type: "string",
          description: "The pattern to match function names against."
        }
      }
    }]
  },
  name: RULE_NAME3,
  create: create3,
  defaultOptions
});
function create3(context, [opts]) {
  const services = ESLintUtils.getParserServices(context, false);
  const pattern = RegExp.toRegExp(opts?.pattern ?? defaultPattern);
  const functionEntries = [];
  function handleReturnExpression(context2, returnExpression, onViolation) {
    if (returnExpression == null) {
      onViolation(returnExpression, { variants: "nullish" });
      return;
    }
    const returnType = getConstrainedTypeAtLocation(services, returnExpression);
    const parts = [...ER.getTypeVariants(unionConstituents(returnType))];
    if (parts.every((part) => allowedVariants.some((allowed) => part === allowed))) return;
    onViolation(returnExpression, {
      variants: [...parts].map((part) => `'${part}'`).join(", ")
    });
  }
  return {
    [":function"](node) {
      const functionName = AST.getFunctionId(node)?.name;
      const isMatched = functionName != null && pattern.test(functionName);
      functionEntries.push({ functionName, functionNode: node, isMatched });
    },
    [":function:exit"]() {
      functionEntries.pop();
    },
    ["ArrowFunctionExpression"](node) {
      const { functionName, isMatched = false } = functionEntries.at(-1) ?? {};
      if (functionName == null || !isMatched) return;
      if (node.body.type === AST_NODE_TYPES.BlockStatement) return;
      handleReturnExpression(context, node.body, (expr, data) => {
        context.report({
          messageId: "functionReturnBoolean",
          node: expr ?? node,
          data: {
            ...data,
            functionName
          }
        });
      });
    },
    ["ReturnStatement"](node) {
      const { functionName, functionNode, isMatched = false } = functionEntries.at(-1) ?? {};
      if (functionName == null || functionNode == null || !isMatched) return;
      handleReturnExpression(context, node.argument, (expr, data) => {
        const functionName2 = AST.getFunctionId(functionNode)?.name;
        if (functionName2 == null) return;
        context.report({
          messageId: "functionReturnBoolean",
          node: expr ?? node.argument ?? node,
          data: {
            ...data,
            functionName: functionName2
          }
        });
      });
    }
  };
}

// src/index.ts
var index_default = {
  meta: {
    name,
    version
  },
  rules: {
    "function-definition": function_definition_default,
    "function-name": function_name_default,
    "function-return-boolean": function_return_boolean_default
  }
};

export { index_default as default };
