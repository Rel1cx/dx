[tsl-dx](../README.md) / noMultilineTemplateExpressionWithoutAutoDedent

# Variable: noMultilineTemplateExpressionWithoutAutoDedent

```ts
const noMultilineTemplateExpressionWithoutAutoDedent: (options?: noMultilineTemplateExpressionWithoutAutoDedentOptions | "off") => Rule<unknown>;
```

Rule to enforce the use of a dedent tag for multiline template expressions.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `noMultilineTemplateExpressionWithoutAutoDedentOptions` \| `"off"` |

## Returns

`Rule`\<`unknown`\>

## Example

```ts
// 🔴
const message = `
  Hello
  World
`;
```

```ts
// 🟢
import dedent from "dedent";
const message = dedent`
  Hello
  World
`;
```
