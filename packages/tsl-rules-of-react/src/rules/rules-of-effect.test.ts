import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";

import { messages, rulesOfEffect } from "./rules-of-effect";

test("rules-of-effect", () => {
  const ret = ruleTester({
    invalid: [],
    ruleFn: rulesOfEffect,
    tsx: true,
    valid: [],
  });
  expect(ret).toBe(false);
});
