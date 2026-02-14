[tsl-shared](../README.md) / isFalsyBigIntType

# Function: isFalsyBigIntType()

```ts
function isFalsyBigIntType(type: Type): type is LiteralType & { aliasSymbol?: Symbol; aliasTypeArguments?: readonly Type[]; flags: TypeFlags; freshType: FreshableType; pattern?: DestructuringPattern; regularType: FreshableType; symbol: Symbol; value: { base10Value: "0"; negative: boolean }; getApparentProperties: any; getBaseTypes: any; getCallSignatures: any; getConstraint: any; getConstructSignatures: any; getDefault: any; getFlags: any; getNonNullableType: any; getNumberIndexType: any; getProperties: any; getProperty: any; getStringIndexType: any; getSymbol: any; isClass: any; isClassOrInterface: any; isIndexType: any; isIntersection: any; isLiteral: any; isNumberLiteral: any; isStringLiteral: any; isTypeParameter: any; isUnion: any; isUnionOrIntersection: any };
```

Check if a type is a falsy bigint literal (0n)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `Type` | The type to check |

## Returns

`type is LiteralType & { aliasSymbol?: Symbol; aliasTypeArguments?: readonly Type[]; flags: TypeFlags; freshType: FreshableType; pattern?: DestructuringPattern; regularType: FreshableType; symbol: Symbol; value: { base10Value: "0"; negative: boolean }; getApparentProperties: any; getBaseTypes: any; getCallSignatures: any; getConstraint: any; getConstructSignatures: any; getDefault: any; getFlags: any; getNonNullableType: any; getNumberIndexType: any; getProperties: any; getProperty: any; getStringIndexType: any; getSymbol: any; isClass: any; isClassOrInterface: any; isIndexType: any; isIntersection: any; isLiteral: any; isNumberLiteral: any; isStringLiteral: any; isTypeParameter: any; isUnion: any; isUnionOrIntersection: any }`

Whether the type is a falsy bigint literal
