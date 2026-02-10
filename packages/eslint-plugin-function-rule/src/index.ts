import type { Rule } from "eslint";

/**
 * Wraps an ESLint rule's create function as an ESLint Plugin with a single rule named "function-rule"
 * The rule is fixable and supports suggestions
 * @param create The rule's listener create function
 * @returns ESLint Plugin object with "function-rule"
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
 * Defines a rule listener by merging multiple visitor objects
 *
 * @param base Base visitor object (target of merge)
 * @param rest Additional visitor objects to merge (one or more)
 * @returns Merged RuleListener object
 *
 * @example
 * ```typescript
 * const listener1 = { Identifier: () => console.log(1) };
 * const listener2 = { Identifier: () => console.log(2) };
 * const merged = defineRuleListener(listener1, listener2);
 * // When encountering Identifier nodes, outputs 1 then 2
 * ```
 */
export function defineRuleListener(base: Rule.RuleListener, ...rest: Rule.RuleListener[]): Rule.RuleListener {
  for (const r of rest) {
    for (const key in r) {
      const existing = base[key];
      base[key] = existing != null
        // @ts-expect-error - no check
        ? (...args) => {
          // @ts-expect-error - no check
          existing(...args);
          // @ts-expect-error - no check
          r[key]?.(...args);
        }
        : r[key];
    }
  }
  return base;
}
