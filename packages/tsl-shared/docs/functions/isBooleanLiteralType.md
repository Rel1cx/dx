[tsl-shared](../README.md) / isBooleanLiteralType

# Function: isBooleanLiteralType()

```ts
function isBooleanLiteralType<TType>(type: TType): type is TType & { intrinsicName: "false" | "true" };
```

Check if a type is a boolean literal type (true or false)

## Type Parameters

| Type Parameter |
| ------ |
| `TType` *extends* `Type` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `TType` | The type to check |

## Returns

type is TType & \{ intrinsicName: "false" \| "true" \}

Whether the type is a boolean literal type
