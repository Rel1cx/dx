import type { AST_NODE_TYPES as T } from "@typescript-eslint/types";

export type FunctionDefinitionType =
  | T.FunctionDeclaration
  | T.FunctionExpression
  | T.ArrowFunctionExpression;
