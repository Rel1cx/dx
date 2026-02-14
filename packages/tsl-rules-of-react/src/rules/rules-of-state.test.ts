import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import { messages, rulesOfState } from "./rules-of-state";

test("rules-of-state", () => {
  const ret = ruleTester({
    invalid: [],
    ruleFn: rulesOfState,
    tsx: true,
    valid: [],
  });
  expect(ret).toBe(false);
});
