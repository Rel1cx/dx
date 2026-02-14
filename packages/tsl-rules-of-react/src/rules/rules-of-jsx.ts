import { type AST, defineRule } from "tsl";

export const messages = [] as const;

/**
 * TS checks for most of the issues described at https://react.dev/learn/writing-markup-with-jsx#the-rules-of-jsx
 * by default, so there isn't much for us to implement.
 */
export const rulesOfJsx = defineRule(() => {
  return {
    name: "rules-of-react/rules-of-jsx",
    visitor: {},
  };
});
