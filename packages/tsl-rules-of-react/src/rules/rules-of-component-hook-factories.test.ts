import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import { messages, rulesOfComponentHookFactories } from "./rules-of-component-hook-factories";

test("rules-of-component-hook-factories", () => {
  const ret = ruleTester({
    invalid: [],
    ruleFn: rulesOfComponentHookFactories,
    tsx: true,
    valid: [],
  });
  expect(ret).toBe(false);
});
