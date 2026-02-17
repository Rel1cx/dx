[tsl-shared](../README.md) / findParentNode

# Function: findParentNode()

## Call Signature

```ts
function findParentNode<A>(node: AnyNode | undefined, test: (n: AnyNode) => n is A): A | undefined;
```

Find the parent node that satisfies the test function

### Type Parameters

| Type Parameter |
| ------ |
| `A` *extends* `AnyNode` |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `AnyNode` \| `undefined` | The AST node |
| `test` | (`n`: `AnyNode`) => `n is A` | The test function |

### Returns

`A` \| `undefined`

The parent node that satisfies the test function or `_` if not found

## Call Signature

```ts
function findParentNode(node: AnyNode | undefined, test: (node: AnyNode) => boolean): AnyNode | undefined;
```

Find the parent node that satisfies the test function or `_` if not found

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `AnyNode` \| `undefined` | The AST node |
| `test` | (`node`: `AnyNode`) => `boolean` | The test function |

### Returns

`AnyNode` \| `undefined`

The parent node that satisfies the test function
