[tsl-module](../README.md) / noDuplicateExports

# Variable: noDuplicateExports()

```ts
const noDuplicateExports: (options?: "off") => Rule<unknown>;
```

Rule to disallow duplicate exports to the same module. Combine multiple export statements to the same module into a single statement.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `"off"` |

## Returns

`Rule`\<`unknown`\>

## Todo

Add autofix to merge duplicate exports automatically.

## Examples

```ts
// Incorrect
export { A } from 'module';
export { B } from 'module';
```

```ts
// Incorrect
export type { A } from 'module';
export type { B } from 'module';
```

```ts
// Correct
export { A, B } from 'module';
```

```ts
// Correct
export { A } from 'moduleA';
export type { B } from 'moduleA';
```
