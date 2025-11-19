[eslint-plugin-function-rule](../README.md) / defineRuleListener

# Function: defineRuleListener()

```ts
function defineRuleListener(ruleListener: RuleListener): RuleListener;
```

Returns a copy of the given rule listener,
but prepends an increasing number of spaces to each event key name for uniqueness.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ruleListener` | `RuleListener` | ESLint rule listener object (mapping event name to handler). |

## Returns

`RuleListener`

New rule listener object with modified keys for uniqueness.
