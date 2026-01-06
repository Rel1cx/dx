/**
 * Compares two strings using natural order comparison.
 * @param a The first string to compare.
 * @param b The second string to compare.
 * @returns A negative number if `a` comes before `b`, a positive number if `a` comes after `b`, or `0` if they are equivalent.
 */
export function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}
