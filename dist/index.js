import { ESLintUtils } from '@typescript-eslint/utils';
import { unionConstituents, isTypeFlagSet, isTrueLiteralType, isFalseLiteralType } from 'ts-api-utils';
import { match, isMatching, P } from 'ts-pattern';
import ts from 'typescript';
import * as AST from '@eslint-react/ast';
import '@eslint-react/eff';
import { getConstrainedTypeAtLocation } from '@typescript-eslint/type-utils';
import { AST_NODE_TYPES } from '@typescript-eslint/types';

// package.json
var name = "eslint-plugin-function";
var version = "0.0.18";
function getDocsUrl() {
  return "TODO: add docs for local ESLint rules";
}
var createRule = ESLintUtils.RuleCreator(getDocsUrl);
var tsHelpers = {
  isAnyType: (type) => isTypeFlagSet(type, ts.TypeFlags.TypeParameter | ts.TypeFlags.Any),
  isBigIntType: (type) => isTypeFlagSet(type, ts.TypeFlags.BigIntLike),
  isBooleanType: (type) => isTypeFlagSet(type, ts.TypeFlags.BooleanLike),
  isEnumType: (type) => isTypeFlagSet(type, ts.TypeFlags.EnumLike),
  isFalsyBigIntType: (type) => type.isLiteral() && isMatching({ value: { base10Value: "0" } }, type),
  isFalsyNumberType: (type) => type.isNumberLiteral() && type.value === 0,
  isFalsyStringType: (type) => type.isStringLiteral() && type.value === "",
  isNeverType: (type) => isTypeFlagSet(type, ts.TypeFlags.Never),
  isNullishType: (type) => isTypeFlagSet(
    type,
    ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.VoidLike
  ),
  isNumberType: (type) => isTypeFlagSet(type, ts.TypeFlags.NumberLike),
  isObjectType: (type) => !isTypeFlagSet(
    type,
    ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.VoidLike | ts.TypeFlags.BooleanLike | ts.TypeFlags.StringLike | ts.TypeFlags.NumberLike | ts.TypeFlags.BigIntLike | ts.TypeFlags.TypeParameter | ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.Never
  ),
  isStringType: (type) => isTypeFlagSet(type, ts.TypeFlags.StringLike),
  isTruthyBigIntType: (type) => type.isLiteral() && isMatching({ value: { base10Value: P.not("0") } }, type),
  isTruthyNumberType: (type) => type.isNumberLiteral() && type.value !== 0,
  isTruthyStringType: (type) => type.isStringLiteral() && type.value !== "",
  isUnknownType: (type) => isTypeFlagSet(type, ts.TypeFlags.Unknown)
};

// src/utils/inspect-variant-types.ts
function inspectVariantTypes(types) {
  const variantTypes = /* @__PURE__ */ new Set();
  if (types.some(tsHelpers.isUnknownType)) {
    variantTypes.add("unknown");
    return variantTypes;
  }
  if (types.some(tsHelpers.isNullishType)) {
    variantTypes.add("nullish");
  }
  const booleans = types.filter(tsHelpers.isBooleanType);
  switch (true) {
    case (booleans.length === 1 && booleans[0] != null): {
      const first = booleans[0];
      if (isTrueLiteralType(first)) {
        variantTypes.add("truthy boolean");
      } else if (isFalseLiteralType(first)) {
        variantTypes.add("falsy boolean");
      }
      break;
    }
    case booleans.length === 2: {
      variantTypes.add("boolean");
      break;
    }
  }
  const strings = types.filter(tsHelpers.isStringType);
  if (strings.length > 0) {
    const evaluated = match(strings).when((types2) => types2.every(tsHelpers.isTruthyStringType), () => "truthy string").when((types2) => types2.every(tsHelpers.isFalsyStringType), () => "falsy string").otherwise(() => "string");
    variantTypes.add(evaluated);
  }
  const bigints = types.filter(tsHelpers.isBigIntType);
  if (bigints.length > 0) {
    const evaluated = match(bigints).when((types2) => types2.every(tsHelpers.isTruthyBigIntType), () => "truthy bigint").when((types2) => types2.every(tsHelpers.isFalsyBigIntType), () => "falsy bigint").otherwise(() => "bigint");
    variantTypes.add(evaluated);
  }
  const numbers = types.filter(tsHelpers.isNumberType);
  if (numbers.length > 0) {
    const evaluated = match(numbers).when((types2) => types2.every(tsHelpers.isTruthyNumberType), () => "truthy number").when((types2) => types2.every(tsHelpers.isFalsyNumberType), () => "falsy number").otherwise(() => "number");
    variantTypes.add(evaluated);
  }
  if (types.some(tsHelpers.isEnumType)) {
    variantTypes.add("enum");
  }
  if (types.some(tsHelpers.isObjectType)) {
    variantTypes.add("object");
  }
  if (types.some(tsHelpers.isAnyType)) {
    variantTypes.add("any");
  }
  if (types.some(tsHelpers.isNeverType)) {
    variantTypes.add("never");
  }
  return variantTypes;
}

// src/utils/regexp.ts
var RE_REGEXP_STR = /^\/(.+)\/([A-Za-z]*)$/u;
function toRegExp(string) {
  const [, pattern, flags = "u"] = RE_REGEXP_STR.exec(string) ?? [];
  if (pattern) return new RegExp(pattern, flags);
  return { test: (s) => s === string };
}

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
  const pattern = toRegExp(opts?.pattern ?? defaultPattern);
  const functionEntries = [];
  function handleReturnExpression(context2, returnExpression, onViolation) {
    if (returnExpression == null) {
      onViolation(returnExpression, { variants: "nullish" });
      return;
    }
    const returnType = getConstrainedTypeAtLocation(services, returnExpression);
    const parts = [...inspectVariantTypes(unionConstituents(returnType))];
    if (parts.every((part) => allowedVariants.some((allowed) => part === allowed))) return;
    onViolation(returnExpression, {
      variants: [...parts].map((part) => `'${part}'`).join(", ")
    });
  }
  return {
    [":function"](node) {
      const functionName = AST.getFunctionIdentifier(node)?.name;
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
        const functionName2 = AST.getFunctionIdentifier(functionNode)?.name;
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
