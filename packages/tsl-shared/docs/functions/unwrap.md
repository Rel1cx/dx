[tsl-shared](../README.md) / unwrap

# Function: unwrap()

## Call Signature

```ts
function unwrap(node: TypeExpression):
  | ArrowFunction
  | AwaitExpression
  | BinaryExpression
  | CallExpression
  | CommaListExpression
  | ConditionalExpression
  | DeleteExpression
  | ElementAccessExpression
  | JsxClosingFragment
  | JsxExpression
  | JsxOpeningElement
  | JsxOpeningFragment
  | OmittedExpression
  | PartiallyEmittedExpression
  | PostfixUnaryExpression
  | PrefixUnaryExpression
  | PropertyAccessExpression
  | SpreadElement
  | SyntheticExpression
  | TaggedTemplateExpression
  | TypeOfExpression
  | VoidExpression
  | YieldExpression
  | PrimaryExpression;
```

Recursively unwrap TypeScript type expressions to get the underlying expression.

### Parameters

| Parameter | Type                                                  | Description         |
| --------- | ----------------------------------------------------- | ------------------- |
| `node`    | [`TypeExpression`](../type-aliases/TypeExpression.md) | The node to unwrap. |

### Returns

\| `ArrowFunction`
\| `AwaitExpression`
\| `BinaryExpression`
\| `CallExpression`
\| `CommaListExpression`
\| `ConditionalExpression`
\| `DeleteExpression`
\| `ElementAccessExpression`
\| `JsxClosingFragment`
\| `JsxExpression`
\| `JsxOpeningElement`
\| `JsxOpeningFragment`
\| `OmittedExpression`
\| `PartiallyEmittedExpression`
\| `PostfixUnaryExpression`
\| `PrefixUnaryExpression`
\| `PropertyAccessExpression`
\| `SpreadElement`
\| `SyntheticExpression`
\| `TaggedTemplateExpression`
\| `TypeOfExpression`
\| `VoidExpression`
\| `YieldExpression`
\| `PrimaryExpression`

The innermost non-type-expression node — a reference into the original tree, never a copy.

## Call Signature

```ts
function unwrap<T extends AnyNode>(node: T): Exclude<T, TypeExpression>;
```

Recursively unwrap TypeScript type expressions to get the underlying expression.

### Type Parameters

| Type Parameter                                        |
| ----------------------------------------------------- |
| <a id="type-parameter-t"></a> `T` _extends_ `AnyNode` |

### Parameters

| Parameter | Type | Description         |
| --------- | ---- | ------------------- |
| `node`    | `T`  | The node to unwrap. |

### Returns

[`Exclude`](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers)\<`T`, [`TypeExpression`](../type-aliases/TypeExpression.md)\>

The innermost non-type-expression node — a reference into the original tree, never a copy.
