import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import ts from "typescript";
import { expect, test } from "vitest";

import { messages, rulesOfJsx } from "./rules-of-jsx";

test("rules-of-jsx", () => {
  const ret = ruleTester({
    tsx: true,
    ruleFn: rulesOfJsx,
    invalid: [
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} key="id" />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
        errors: [
          { message: messages.keyMustBeforeSpread },
        ],
      },
      {
        code: tsx`
          function Component({ props1, props2 }) {
            return <div {...props1} {...props2} key="id" />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
        errors: [
          { message: messages.keyMustBeforeSpread },
          { message: messages.keyMustBeforeSpread },
        ],
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div className="test" {...props} key="id" />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
        errors: [
          { message: messages.keyMustBeforeSpread },
        ],
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} key="id" className="test" />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
        errors: [
          { message: messages.keyMustBeforeSpread },
        ],
      },
    ],
    valid: [
      {
        code: tsx`
          function Component({ props }) {
            return <div key="id" {...props} />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
      },
      {
        code: tsx`
          function Component() {
            return <div key="id" />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div key="id" key="id2" {...props} />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div className="test" {...props} />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} key="id" />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.None,
        },
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} key="id" />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.Preserve,
        },
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} key="id" />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactNative,
        },
      },
    ],
  });
  expect(ret).toBe(false);
});
