/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RuleContext, RuleFeature } from "@eslint-react/shared";
import type { AST_NODE_TYPES as T, TSESTree } from "@typescript-eslint/types";
import type { RuleListener } from "@typescript-eslint/utils/ts-eslint";

import type { CamelCase } from "string-ts";
import { createRule } from "../utils";

export const RULE_NAME = "function-name";

export const RULE_FEATURES = [] as const satisfies RuleFeature[];

export type MessageID = CamelCase<typeof RULE_NAME>;

export default createRule<[], MessageID>({
  meta: {
    type: "problem",
    docs: {
      description: "Enforce a consistent function naming style.",
      [Symbol.for("rule_features")]: RULE_FEATURES,
    },
    messages: {
      functionName: "",
    },
    schema: [],
  },
  name: RULE_NAME,
  create,
  defaultOptions: [],
});

export function create(context: RuleContext<MessageID, []>): RuleListener {
  return {};
}
