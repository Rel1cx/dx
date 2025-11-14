import { ESLintUtils } from "@typescript-eslint/utils";
import { isFalseLiteralType, isTrueLiteralType, isTypeFlagSet, unionConstituents } from "ts-api-utils";
import { P, isMatching, match } from "ts-pattern";
import ts from "typescript";
import * as AST from "@eslint-react/ast";
import { toRegExp } from "@eslint-react/shared";
import "@let/kit";
import { getConstrainedTypeAtLocation } from "@typescript-eslint/type-utils";
import { AST_NODE_TYPES } from "@typescript-eslint/types";

//#region package.json
var name = "eslint-plugin-function";
var version = "0.0.34";

//#endregion
//#region src/utils/create-rule.ts
function getDocsUrl() {
	return "TODO: add docs for local ESLint rules";
}
const createRule = ESLintUtils.RuleCreator(getDocsUrl);

//#endregion
//#region src/utils/type-is.ts
/** @internal */
const isAnyType = (type) => isTypeFlagSet(type, ts.TypeFlags.TypeParameter | ts.TypeFlags.Any);
/** @internal */
const isBigIntType = (type) => isTypeFlagSet(type, ts.TypeFlags.BigIntLike);
/** @internal */
const isBooleanType = (type) => isTypeFlagSet(type, ts.TypeFlags.BooleanLike);
/** @internal */
const isEnumType = (type) => isTypeFlagSet(type, ts.TypeFlags.EnumLike);
/** @internal */
const isFalsyBigIntType = (type) => type.isLiteral() && isMatching({ value: { base10Value: "0" } }, type);
/** @internal */
const isFalsyNumberType = (type) => type.isNumberLiteral() && type.value === 0;
/** @internal */
const isFalsyStringType = (type) => type.isStringLiteral() && type.value === "";
/** @internal */
const isNeverType = (type) => isTypeFlagSet(type, ts.TypeFlags.Never);
/** @internal */
const isNullishType = (type) => isTypeFlagSet(type, ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.VoidLike);
/** @internal */
const isNumberType = (type) => isTypeFlagSet(type, ts.TypeFlags.NumberLike);
/** @internal */
const isObjectType = (type) => !isTypeFlagSet(type, ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.VoidLike | ts.TypeFlags.BooleanLike | ts.TypeFlags.StringLike | ts.TypeFlags.NumberLike | ts.TypeFlags.BigIntLike | ts.TypeFlags.TypeParameter | ts.TypeFlags.Any | ts.TypeFlags.Unknown | ts.TypeFlags.Never);
/** @internal */
const isStringType = (type) => isTypeFlagSet(type, ts.TypeFlags.StringLike);
/** @internal */
const isTruthyBigIntType = (type) => type.isLiteral() && isMatching({ value: { base10Value: P.not("0") } }, type);
/** @internal */
const isTruthyNumberType = (type) => type.isNumberLiteral() && type.value !== 0;
/** @internal */
const isTruthyStringType = (type) => type.isStringLiteral() && type.value !== "";
/** @internal */
const isUnknownType = (type) => isTypeFlagSet(type, ts.TypeFlags.Unknown);

//#endregion
//#region src/utils/type-variant.ts
/**
* Ported from https://github.com/typescript-eslint/typescript-eslint/blob/eb736bbfc22554694400e6a4f97051d845d32e0b/packages/eslint-plugin/src/rules/strict-boolean-expressions.ts#L826 with some enhancements
* Get the variants of an array of types.
* @param types The types to get the variants of
* @returns The variants of the types
* @internal
*/
function getTypeVariants(types) {
	const variants = /* @__PURE__ */ new Set();
	if (types.some(isUnknownType)) {
		variants.add("unknown");
		return variants;
	}
	if (types.some(isNullishType)) variants.add("nullish");
	const booleans = types.filter(isBooleanType);
	const boolean0 = booleans[0];
	if (booleans.length === 1 && boolean0 != null) {
		if (isFalseLiteralType(boolean0)) variants.add("falsy boolean");
		else if (isTrueLiteralType(boolean0)) variants.add("truthy boolean");
	} else if (booleans.length === 2) variants.add("boolean");
	const strings = types.filter(isStringType);
	if (strings.length > 0) {
		const evaluated = match(strings).when((types$1) => types$1.every(isTruthyStringType), () => "truthy string").when((types$1) => types$1.every(isFalsyStringType), () => "falsy string").otherwise(() => "string");
		variants.add(evaluated);
	}
	const bigints = types.filter(isBigIntType);
	if (bigints.length > 0) {
		const evaluated = match(bigints).when((types$1) => types$1.every(isTruthyBigIntType), () => "truthy bigint").when((types$1) => types$1.every(isFalsyBigIntType), () => "falsy bigint").otherwise(() => "bigint");
		variants.add(evaluated);
	}
	const numbers = types.filter(isNumberType);
	if (numbers.length > 0) {
		const evaluated = match(numbers).when((types$1) => types$1.every(isTruthyNumberType), () => "truthy number").when((types$1) => types$1.every(isFalsyNumberType), () => "falsy number").otherwise(() => "number");
		variants.add(evaluated);
	}
	if (types.some(isEnumType)) variants.add("enum");
	if (types.some(isObjectType)) variants.add("object");
	if (types.some(isAnyType)) variants.add("any");
	if (types.some(isNeverType)) variants.add("never");
	return variants;
}

//#endregion
//#region src/rules/function-definition.ts
const RULE_NAME$2 = "function-definition";
const RULE_FEATURES$2 = [];
var function_definition_default = createRule({
	meta: {
		type: "problem",
		docs: {
			description: "Enforce a consistent function definition style.",
			[Symbol.for("rule_features")]: RULE_FEATURES$2
		},
		messages: { functionDefinition: "" },
		schema: []
	},
	name: RULE_NAME$2,
	create: create$2,
	defaultOptions: []
});
function create$2(context) {
	return {};
}

//#endregion
//#region src/rules/function-name.ts
const RULE_NAME$1 = "function-name";
const RULE_FEATURES$1 = [];
var function_name_default = createRule({
	meta: {
		type: "problem",
		docs: {
			description: "Enforce a consistent function naming style.",
			[Symbol.for("rule_features")]: RULE_FEATURES$1
		},
		messages: { functionName: "" },
		schema: []
	},
	name: RULE_NAME$1,
	create: create$1,
	defaultOptions: []
});
function create$1(context) {
	return {};
}

//#endregion
//#region src/rules/function-return-boolean.ts
const RULE_NAME = "function-return-boolean";
const RULE_FEATURES = [];
const defaultPattern = "/^(is|has|should)/u";
const defaultOptions = [{ pattern: defaultPattern }];
const allowedVariants = [
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
			[Symbol.for("rule_features")]: RULE_FEATURES
		},
		messages: { functionReturnBoolean: "The function '{{functionName}}' should return a boolean value (got {{variants}})." },
		schema: [{
			type: "object",
			additionalProperties: false,
			properties: { pattern: {
				type: "string",
				description: "The pattern to match function names against."
			} }
		}]
	},
	name: RULE_NAME,
	create,
	defaultOptions
});
function create(context, [opts]) {
	const services = ESLintUtils.getParserServices(context, false);
	const pattern = toRegExp(opts?.pattern ?? defaultPattern);
	const functionEntries = [];
	function handleReturnExpression(context$1, returnExpression, onViolation) {
		if (returnExpression == null) {
			onViolation(returnExpression, { variants: "nullish" });
			return;
		}
		const parts = [...getTypeVariants(unionConstituents(getConstrainedTypeAtLocation(services, returnExpression)))];
		if (parts.every((part) => allowedVariants.some((allowed) => part === allowed))) return;
		onViolation(returnExpression, { variants: [...parts].map((part) => `'${part}'`).join(", ") });
	}
	return {
		[":function"](node) {
			const functionName = AST.getFunctionId(node)?.name;
			const isMatched = functionName != null && pattern.test(functionName);
			functionEntries.push({
				functionName,
				functionNode: node,
				isMatched
			});
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
				const functionName$1 = AST.getFunctionId(functionNode)?.name;
				if (functionName$1 == null) return;
				context.report({
					messageId: "functionReturnBoolean",
					node: expr ?? node.argument ?? node,
					data: {
						...data,
						functionName: functionName$1
					}
				});
			});
		}
	};
}

//#endregion
//#region src/index.ts
const plugin = {
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
var src_default = plugin;

//#endregion
export { src_default as default };