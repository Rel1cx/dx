import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import { messages, rulesOfRefs } from "./rules-of-refs";

test("rules-of-refs", () => {
  const ret = ruleTester({
    invalid: [],
    ruleFn: rulesOfRefs,
    tsx: true,
    valid: [],
  });
  expect(ret).toBe(false);
});
