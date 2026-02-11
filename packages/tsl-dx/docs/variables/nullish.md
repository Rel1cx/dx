[tsl-module](../README.md) / nullish

# Variable: nullish()

```ts
const nullish: (options?: nullishOptions | "off") => Rule<unknown>;
```

Rule to enforce the use of `unit` instead of `undefined` and loose equality for nullish checks.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `nullishOptions` \| `"off"` |

## Returns

`Rule`\<`unknown`\>

## Example

```ts
// Incorrect
let x = undefined;
if (x === undefined) { }
```

```ts
// Correct
let x = unit;
if (x == null) { }
```
