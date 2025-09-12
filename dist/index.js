import { ESLintUtils } from "@typescript-eslint/utils";
import * as AST from "@eslint-react/ast";
import * as ER from "@eslint-react/core";
import "@eslint-react/eff";
import { RegExp } from "@eslint-react/kit";
import { getConstrainedTypeAtLocation } from "@typescript-eslint/type-utils";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { unionConstituents } from "ts-api-utils";

//#region package.json
var name = "eslint-plugin-function";
var version = "0.0.26";

//#endregion
//#region src/utils/create-rule.ts
function getDocsUrl() {
	return "TODO: add docs for local ESLint rules";
}
const createRule = ESLintUtils.RuleCreator(getDocsUrl);

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
	const pattern = RegExp.toRegExp(opts?.pattern ?? defaultPattern);
	const functionEntries = [];
	function handleReturnExpression(context$1, returnExpression, onViolation) {
		if (returnExpression == null) {
			onViolation(returnExpression, { variants: "nullish" });
			return;
		}
		const returnType = getConstrainedTypeAtLocation(services, returnExpression);
		const parts = [...ER.getTypeVariants(unionConstituents(returnType))];
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