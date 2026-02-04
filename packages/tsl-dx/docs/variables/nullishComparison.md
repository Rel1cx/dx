[tsl-module](../README.md) / nullishComparison

# Variable: nullishComparison()

```ts
const nullishComparison: (options?: "off") => Rule<unknown>;
```

Enforces the use of '==' and '!=' for nullish comparisons (i.e., comparisons to null or undefined)

Rationale:
In TypeScript, using '==' and '!=' for nullish comparisons is a common practice because it checks for both null and undefined values
This rule promotes consistency in codebases by ensuring that developers use the appropriate operators for nullish checks

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `"off"` |

## Returns

`Rule`\<`unknown`\>
