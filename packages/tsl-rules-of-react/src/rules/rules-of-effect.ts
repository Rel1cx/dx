import { type AST, defineRule } from "tsl";
import ts from "typescript";

export const messages = {};

/**
 * @todo implement this
 */
export const rulesOfEffect = defineRule(() => {
  return {
    name: "rules-of-react/rules-of-effect",
    visitor: {},
  };
});
