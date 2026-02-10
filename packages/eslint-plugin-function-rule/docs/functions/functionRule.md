[eslint-plugin-function-rule](../README.md) / functionRule

# Function: functionRule()

```ts
function functionRule(create: (context: RuleContext) => RuleListener): {
  rules: {
     function-rule: {
        create: (context: RuleContext) => RuleListener;
        meta: {
           fixable: "code";
           hasSuggestions: true;
        };
     };
  };
};
```

Wraps an ESLint rule's create function as an ESLint Plugin with a single rule named "function-rule"
The rule is fixable and supports suggestions

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `create` | (`context`: `RuleContext`) => `RuleListener` | The rule's listener create function |

## Returns

```ts
{
  rules: {
     function-rule: {
        create: (context: RuleContext) => RuleListener;
        meta: {
           fixable: "code";
           hasSuggestions: true;
        };
     };
  };
}
```

ESLint Plugin object with "function-rule"

| Name | Type | Default value |
| ------ | ------ | ------ |
| `rules` | \{ `function-rule`: \{ `create`: (`context`: `RuleContext`) => `RuleListener`; `meta`: \{ `fixable`: `"code"`; `hasSuggestions`: `true`; \}; \}; \} | - |
| `rules.function-rule` | \{ `create`: (`context`: `RuleContext`) => `RuleListener`; `meta`: \{ `fixable`: `"code"`; `hasSuggestions`: `true`; \}; \} | - |
| `rules.function-rule.create()` | (`context`: `RuleContext`) => `RuleListener` | - |
| `rules.function-rule.meta` | \{ `fixable`: `"code"`; `hasSuggestions`: `true`; \} | - |
| `rules.function-rule.meta.fixable` | `"code"` | `"code"` |
| `rules.function-rule.meta.hasSuggestions` | `true` | `true` |
