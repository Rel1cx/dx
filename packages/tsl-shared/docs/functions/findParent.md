[tsl-shared](../README.md) / findParent

# Function: findParent()

## Call Signature

```ts
function findParent<A>(
   node: AnyNode | null, 
   test: (n: AnyNode) => n is A, 
   stop?: NodePredicate): A | null;
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
| `stop?` | `NodePredicate` | The stop function |

### Returns

`A` \| `null`

The parent node that satisfies the test function or `_` if not found

## Call Signature

```ts
function findParent(
   node: AnyNode | null, 
   test: (node: AnyNode) => boolean, 
   stop?: NodePredicate): AnyNode | null;
```

Find the parent node that satisfies the test function or `_` if not found

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `node` | `AnyNode` \| `null` | The AST node |
| `test` | (`node`: `AnyNode`) => `boolean` | The test function |
| `stop?` | `NodePredicate` | The stop function |

### Returns

`AnyNode` \| `null`

The parent node that satisfies the test function
