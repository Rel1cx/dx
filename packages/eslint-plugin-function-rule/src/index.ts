import type { Plugin } from "@eslint/core";
import type { Rule } from "eslint";

/**
 * Wraps an ESLint rule's create function as an ESLint Plugin with a single rule named "function-rule".
 * The rule is fixable and supports suggestions.
 * @param create The rule's listener create function.
 * @returns ESLint Plugin object with "function-rule".
 */
export function functionRule(create: Rule.RuleModule["create"]): Plugin {
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

let id = 1;

/**
 * Returns a copy of the given rule listener,
 * but prepends an increasing number of spaces to each event key name for uniqueness.
 * @param ruleListener ESLint rule listener object (mapping event name to handler).
 * @returns New rule listener object with modified keys for uniqueness.
 */
export function defineRuleListener(ruleListener: Rule.RuleListener): Rule.RuleListener {
  const listener: Rule.RuleListener = {};
  for (const key of Object.keys(ruleListener)) {
    // Prepend spaces to key for uniqueness
    listener[" ".repeat(id++) + key] = ruleListener[key];
  }
  return listener;
}
