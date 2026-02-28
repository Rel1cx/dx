[tsl-shared](../README.md) / findParentNode

# Function: findParentNode()

## Call Signature

```ts
function findParentNode<A>(node: AnyNode | null, test: (n: AnyNode) => n is A): A | null;
```

Find the parent node that satisfies the test function

### Type Parameters

| Type Parameter |
| ------ |
| `A` *extends* `AnyNode` |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `AnyNode` \| `null` | The AST node |
| `test` | (`n`: `AnyNode`) => `n is A` | The test function |

### Returns

`A` \| `null`

The parent node that satisfies the test function or `_` if not found

## Call Signature

```ts
function findParentNode(node: AnyNode | null, test: (node: AnyNode) => boolean): AnyNode | null;
```

Find the parent node that satisfies the test function or `_` if not found

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `AnyNode` \| `null` | The AST node |
| `test` | (`node`: `AnyNode`) => `boolean` | The test function |

### Returns

`AnyNode` \| `null`

The parent node that satisfies the test function
