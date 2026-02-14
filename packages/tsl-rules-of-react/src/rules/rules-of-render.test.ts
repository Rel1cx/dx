import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import { messages, rulesOfRender } from "./rules-of-render";

test("rules-of-render", () => {
  const ret = ruleTester({
    invalid: [],
    ruleFn: rulesOfRender,
    tsx: true,
    valid: [],
  });
  expect(ret).toBe(false);
});
