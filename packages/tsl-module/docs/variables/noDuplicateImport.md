[tsl-module](../README.md) / noDuplicateImport

# Variable: noDuplicateImport()

```ts
const noDuplicateImport: (options?: "off") => Rule<unknown>;
```

Rule to disallow duplicate imports from the same module.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `"off"` |

## Returns

`Rule`\<`unknown`\>

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
