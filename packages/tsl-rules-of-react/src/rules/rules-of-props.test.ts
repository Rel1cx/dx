import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import { messages, rulesOfProps } from "./rules-of-props";

test("rules-of-props", () => {
  const ret = ruleTester({
    invalid: [],
    ruleFn: rulesOfProps,
    tsx: true,
    valid: [],
  });
  expect(ret).toBe(false);
});
