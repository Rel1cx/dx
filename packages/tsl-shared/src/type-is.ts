import { P, isMatching } from "ts-pattern";
import ts from "typescript";

function isFlagSet(allFlags: number, flag: number) {
  return (allFlags & flag) !== 0;
}

function isFlagSetOnObject(obj: { flags: number }, flag: number) {
  return isFlagSet(obj.flags, flag);
}

const isTypeFlagSet: (type: ts.Type, flag: ts.TypeFlags) => boolean = isFlagSetOnObject;

/**
 * Check if a type is a boolean literal type (true or false)
 * @param type The type to check
 * @returns Whether the type is a boolean literal type
 */
export function isBooleanLiteralType<TType extends ts.Type>(type: TType): type is TType & { intrinsicName: "false" | "true" } {
  return isTypeFlagSet(type, ts.TypeFlags.BooleanLiteral);
}

/**
 * Check if a type is the false literal type
 * @param type The type to check
 * @returns Whether the type is the false literal type
 */
export const isFalseLiteralType = (type: ts.Type) => isBooleanLiteralType(type) && type.intrinsicName === "false";

/**
 * Check if a type is the true literal type
 * @param type The type to check
 * @returns Whether the type is the true literal type
 */
export const isTrueLiteralType = (type: ts.Type) => isBooleanLiteralType(type) && type.intrinsicName === "true";

/**
 * Check if a type is any or a type parameter
 * @param type The type to check
 * @returns Whether the type is any or a type parameter
 */
export const isAnyType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.TypeParameter | ts.TypeFlags.Any);

/**
 * Check if a type is a bigint type
 * @param type The type to check
 * @returns Whether the type is a bigint type
 */
export const isBigIntType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.BigIntLike);

/**
 * Check if a type is a boolean type
 * @param type The type to check
 * @returns Whether the type is a boolean type
 */
export const isBooleanType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.BooleanLike);

/**
 * Check if a type is an enum type
 * @param type The type to check
 * @returns Whether the type is an enum type
 */
export const isEnumType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.EnumLike);

/**
 * Check if a type is a falsy bigint literal (0n)
 * @param type The type to check
 * @returns Whether the type is a falsy bigint literal
 */
export const isFalsyBigIntType = (type: ts.Type) => type.isLiteral() && isMatching({ value: { base10Value: "0" } }, type);

/**
 * Check if a type is a falsy number literal (0)
 * @param type The type to check
 * @returns Whether the type is a falsy number literal
 */
export const isFalsyNumberType = (type: ts.Type) => type.isNumberLiteral() && type.value === 0;

/**
 * Check if a type is a falsy string literal ("")
 * @param type The type to check
 * @returns Whether the type is a falsy string literal
 */
export const isFalsyStringType = (type: ts.Type) => type.isStringLiteral() && type.value === "";

/**
 * Check if a type is the never type
 * @param type The type to check
 * @returns Whether the type is the never type
 */
export const isNeverType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.Never);

/**
 * Check if a type is nullish (null, undefined, or void)
 * @param type The type to check
 * @returns Whether the type is nullish
 */
export const isNullishType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.VoidLike);

/**
 * Check if a type is a number type
 * @param type The type to check
 * @returns Whether the type is a number type
 */
export const isNumberType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.NumberLike);

/**
 * Check if a type is an object type (not a primitive or special type)
 * @param type The type to check
 * @returns Whether the type is an object type
 */
export const isObjectType = (type: ts.Type) =>
  !isTypeFlagSet(
    type,
    ts.TypeFlags.Null
      | ts.TypeFlags.Undefined
      | ts.TypeFlags.VoidLike
      | ts.TypeFlags.BooleanLike
      | ts.TypeFlags.StringLike
      | ts.TypeFlags.NumberLike
      | ts.TypeFlags.BigIntLike
      | ts.TypeFlags.TypeParameter
      | ts.TypeFlags.Any
      | ts.TypeFlags.Unknown
      | ts.TypeFlags.Never,
  );

/**
 * Check if a type is a string type
 * @param type The type to check
 * @returns Whether the type is a string type
 */
export const isStringType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.StringLike);

/**
 * Check if a type is a truthy bigint literal (not 0n)
 * @param type The type to check
 * @returns Whether the type is a truthy bigint literal
 */
export const isTruthyBigIntType = (type: ts.Type) => type.isLiteral() && isMatching({ value: { base10Value: P.not("0") } }, type);

/**
 * Check if a type is a truthy number literal (not 0)
 * @param type The type to check
 * @returns Whether the type is a truthy number literal
 */
export const isTruthyNumberType = (type: ts.Type) => type.isNumberLiteral() && type.value !== 0;

/**
 * Check if a type is a truthy string literal (not "")
 * @param type The type to check
 * @returns Whether the type is a truthy string literal
 */
export const isTruthyStringType = (type: ts.Type) => type.isStringLiteral() && type.value !== "";

/**
 * Check if a type is the unknown type
 * @param type The type to check
 * @returns Whether the type is the unknown type
 */
export const isUnknownType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.Unknown);
