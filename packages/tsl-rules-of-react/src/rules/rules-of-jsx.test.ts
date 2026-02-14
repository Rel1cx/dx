import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import { messages, rulesOfJsx } from "./rules-of-jsx";

test("rules-of-jsx", () => {
  const ret = ruleTester({
    invalid: [],
    ruleFn: rulesOfJsx,
    tsx: true,
    valid: [],
  });
  expect(ret).toBe(false);
});
