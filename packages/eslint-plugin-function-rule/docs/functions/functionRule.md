[eslint-plugin-function-rule](../README.md) / functionRule

# Function: functionRule()

```ts
function functionRule(create: (context: RuleContext) => RuleListener): Plugin;
```

Wraps an ESLint rule's create function as an ESLint Plugin with a single rule named "function-rule".
The rule is fixable and supports suggestions.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `create` | (`context`: `RuleContext`) => `RuleListener` | The rule's listener create function. |

## Returns

`Plugin`

ESLint Plugin object with "function-rule".
