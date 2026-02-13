import { type AST, defineRule } from "tsl";
import ts from "typescript";

export const messages = {};

/**
 * @todo: implement this
 */
export const rulesOfProps = defineRule(() => {
  return {
    name: "rules-of-react/rules-of-props",
    visitor: {},
  };
});
