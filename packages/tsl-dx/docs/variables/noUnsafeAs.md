[tsl-dx](../README.md) / noUnsafeAs

# Variable: noUnsafeAs

```ts
const noUnsafeAs: (options?: "off") => Rule<unknown>;
```

Rule to disallow type assertions via `as` except for `as const` and `as unknown`.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `"off"` |

## Returns

`Rule`\<`unknown`\>

## Example

```ts
// 🔴
const x = value as string;
```

```ts
// 🟢
const x = value as unknown;
const y = [1, 2, 3] as const;
```
