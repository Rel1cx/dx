[tsl-shared](../README.md) / TypeExpression

# Type Alias: TypeExpression

```ts
type TypeExpression =
  | AST.AsExpression
  | AST.ExpressionWithTypeArguments
  | AST.NonNullExpression
  | AST.SatisfiesExpression
  | AST.TypeAssertion;
```

Union of TypeScript type expression node types — the nodes `unwrap` strips.
