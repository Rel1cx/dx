import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import { messages, rulesOfKeys } from "./rules-of-keys";

test("rules-of-keys", () => {
  const ret = ruleTester({
    invalid: [],
    ruleFn: rulesOfKeys,
    tsx: true,
    valid: [],
  });
  expect(ret).toBe(false);
});
