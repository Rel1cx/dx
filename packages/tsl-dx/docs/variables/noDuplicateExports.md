[tsl-dx](../README.md) / noDuplicateExports

# Variable: noDuplicateExports()

```ts
const noDuplicateExports: (options?: "off") => Rule<unknown>;
```

Rule to detect and merge duplicate `export from` statements from the same module.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `"off"` |

## Returns

`Rule`\<`unknown`\>

## Example

```ts
// Incorrect
export { A } from 'module';
export { B } from 'module';
```

```ts
// Correct
export { A, B } from 'module';
```
