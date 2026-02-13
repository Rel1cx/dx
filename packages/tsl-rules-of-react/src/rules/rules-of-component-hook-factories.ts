import { type AST, defineRule } from "tsl";
import ts from "typescript";

export const messages = {};

/**
 * @todo: implement this
 */
export const rulesOfComponentHookFactories = defineRule(() => {
  return {
    name: "rules-of-react/rules-of-component-hook-factories",
    visitor: {},
  };
});
