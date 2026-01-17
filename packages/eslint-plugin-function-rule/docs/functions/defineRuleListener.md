[eslint-plugin-function-rule](../README.md) / defineRuleListener

# Function: defineRuleListener()

```ts
function defineRuleListener<T>(visitor: T, ...visitors: T[]): T;
```

Defines a RuleListener by merging multiple visitor objects

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `RuleListener` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `visitor` | `T` | The base visitor object |
| ...`visitors` | `T`[] | Additional visitor objects to merge |

## Returns

`T`
