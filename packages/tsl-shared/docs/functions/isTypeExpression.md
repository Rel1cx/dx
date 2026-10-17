[tsl-shared](../README.md) / isTypeExpression

# Function: isTypeExpression()

```ts
function isTypeExpression(node: AnyNode): node is TypeExpression;
```

Check if a node is a TypeScript type expression (the nodes `unwrap` strips).

## Parameters

| Parameter | Type      | Description        |
| --------- | --------- | ------------------ |
| `node`    | `AnyNode` | The node to check. |

## Returns

`node is TypeExpression`

`true` if the node is a type expression.
