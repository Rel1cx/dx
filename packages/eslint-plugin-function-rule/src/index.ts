import type { Rule } from "eslint";

/**
 * Wraps an ESLint rule's create function as an ESLint Plugin with a single rule named "function-rule".
 * The rule is fixable and supports suggestions.
 * @param create The rule's listener create function.
 * @returns ESLint Plugin object with "function-rule".
 */
export function functionRule(create: Rule.RuleModule["create"]) {
  return {
    rules: {
      "function-rule": {
        meta: {
          fixable: "code",
          hasSuggestions: true,
        },
        create,
      },
    },
  } as const;
}

/**
 * Defines a RuleListener by merging multiple visitor objects
 * @param visitor The base visitor object
 * @param visitors Additional visitor objects to merge
 * @returns
 */
export function defineRuleListener<T extends Rule.RuleListener>(visitor: T, ...visitors: T[]) {
  for (const v of visitors) {
    for (const key in v) {
      if (visitor[key] != null) {
        const o = visitor[key];
        // @ts-expect-error - no type check
        visitor[key] = (...args) => {
          // @ts-expect-error - no type check
          o(...args);
          // @ts-expect-error - no type check
          v[key](...args);
        };
      } else {
        visitor[key] = v[key];
      }
    }
  }
  return visitor;
}
