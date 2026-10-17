import type { AST } from "tsl";

/** Union of JSX element-like node types (element, self-closing element, or fragment). */
export type JsxElementLike = AST.JsxElement | AST.JsxSelfClosingElement | AST.JsxFragment;

/** Union of TypeScript type expression node types — the nodes `unwrap` strips. */
export type TypeExpression =
  | AST.AsExpression
  | AST.ExpressionWithTypeArguments
  | AST.NonNullExpression
  | AST.SatisfiesExpression
  | AST.TypeAssertion;
