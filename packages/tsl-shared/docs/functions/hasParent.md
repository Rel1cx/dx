[tsl-shared](../README.md) / hasParent

# Function: hasParent()

## Call Signature

```ts
function hasParent<T extends AnyNode>(node: AnyNode | null, test: Predicate<T>, stop?: NodePredicate): boolean;
```

Check whether `node` has an ancestor matching a predicate.

### Type Parameters

| Type Parameter                                        |
| ----------------------------------------------------- |
| <a id="type-parameter-t"></a> `T` _extends_ `AnyNode` |

### Parameters

| Parameter | Type                | Description                                                          |
| --------- | ------------------- | -------------------------------------------------------------------- |
| `node`    | `AnyNode` \| `null` | The starting node for the upward search.                             |
| `test`    | `Predicate`\<`T`\>  | The predicate a candidate ancestor must satisfy.                     |
| `stop?`   | `NodePredicate`     | An optional predicate that aborts the search when it returns `true`. |

### Returns

`boolean`

`true` when a matching ancestor exists.

## Call Signature

```ts
function hasParent(node: AnyNode | null, test: NodePredicate, stop?: NodePredicate): boolean;
```

Check whether `node` has an ancestor matching a predicate.

### Parameters

| Parameter | Type                | Description                                                          |
| --------- | ------------------- | -------------------------------------------------------------------- |
| `node`    | `AnyNode` \| `null` | The starting node for the upward search.                             |
| `test`    | `NodePredicate`     | The predicate a candidate ancestor must satisfy.                     |
| `stop?`   | `NodePredicate`     | An optional predicate that aborts the search when it returns `true`. |

### Returns

`boolean`

`true` when a matching ancestor exists.
