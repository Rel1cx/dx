[Public APIs](../README.md) / Pretty

# Type Alias: Pretty\<T\>

```ts
type Pretty<T> = { [P in keyof T]: T[P] } & {};
```

Converts a type to a pretty-printed version that is easier to read in IDE tooltips.

## Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

## Since

1.0.0
