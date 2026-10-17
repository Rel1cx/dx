# tsl-shared

## Type Aliases

| Type Alias                                       | Description                                                                        |
| ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| [JsxElementLike](type-aliases/JsxElementLike.md) | Union of JSX element-like node types (element, self-closing element, or fragment). |
| [TypeExpression](type-aliases/TypeExpression.md) | Union of TypeScript type expression node types — the nodes `unwrap` strips.        |
| [TypeVariant](type-aliases/TypeVariant.md)       | Represents the variant of a type for boolean expression analysis.                  |

## Functions

| Function                                                        | Description                                                                                                                                              |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [findEnclosingTryBlock](functions/findEnclosingTryBlock.md)     | Find the nearest `TryStatement` whose `try` block (not `catch`/`finally`) encloses the given node.                                                       |
| [findParent](functions/findParent.md)                           | Walk up the AST from `node` to find the nearest ancestor matching a predicate.                                                                           |
| [getFullyQualifiedNameEx](functions/getFullyQualifiedNameEx.md) | Get the fully qualified name of a symbol, handling cases that `ts.TypeChecker.getFullyQualifiedName` does not handle (ex: `export as namespace preact`). |
| [hasEnclosingTryBlock](functions/hasEnclosingTryBlock.md)       | Check whether the given node is enclosed by the `try` block (not `catch`/`finally`) of a `TryStatement`.                                                 |
| [hasParent](functions/hasParent.md)                             | Check whether `node` has an ancestor matching a predicate.                                                                                               |
| [isBooleanLiteralType](functions/isBooleanLiteralType.md)       | Check if the type is a boolean literal type.                                                                                                             |
| [isTypeExpression](functions/isTypeExpression.md)               | Check if a node is a TypeScript type expression (the nodes `unwrap` strips).                                                                             |
| [unwrap](functions/unwrap.md)                                   | Recursively unwrap TypeScript type expressions to get the underlying expression.                                                                         |
