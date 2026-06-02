[tsl-dx](../README.md) / noDuplicateImports

# Variable: noDuplicateImports

```ts
const noDuplicateImports: (options?: "off") => Rule<unknown>;
```

Rule to detect and merge duplicate `import from` statements from the same module.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `"off"` |

## Returns

`Rule`\<`unknown`\>

## Example

```ts
// 🔴
import { A } from 'module';
import { B } from 'module';
```

```ts
// 🟢
import { A, B } from 'module';
```
