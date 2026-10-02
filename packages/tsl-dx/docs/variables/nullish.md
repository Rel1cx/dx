[tsl-dx](../README.md) / nullish

# Variable: nullish

```ts
const nullish: (options?: nullishOptions | "off") => Rule<unknown>;
```

Rule to enforce the use of loose equality for nullish checks.

## Parameters

| Parameter  | Type                        |
| ---------- | --------------------------- |
| `options?` | `nullishOptions` \| `"off"` |

## Returns

`Rule`\<`unknown`\>

## Example

```ts
// 🔴
if (x === undefined) {}
```

```ts
// 🟢
if (x == null) {}
```
