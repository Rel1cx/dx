[tsl-shared](../README.md) / hasEnclosingTryBlock

# Function: hasEnclosingTryBlock()

```ts
function hasEnclosingTryBlock(node: AnyNode): boolean;
```

Check whether the given node is enclosed by the `try` block (not `catch`/`finally`) of a `TryStatement`.

## Parameters

| Parameter | Type      | Description        |
| --------- | --------- | ------------------ |
| `node`    | `AnyNode` | The node to check. |

## Returns

`boolean`

`true` when an enclosing `try` block exists.
