[tsl-module](../README.md) / noDuplicateImports

# Variable: noDuplicateImports()

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

## Todo

Add autofix to merge duplicate imports automatically.

## Examples

```ts
// Incorrect
import { A } from 'module';
import { B } from 'module';
```

```ts
// Incorrect
import type { A } from 'module';
import type { B } from 'module';
```

```ts
// Correct
import { A, B } from 'module';
```

```ts
// Correct
import { A } from 'moduleA';
import type { B } from 'moduleA';
```
