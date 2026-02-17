import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import ts from "typescript";
import { expect, test } from "vitest";

import { messages, rulesOfJsx } from "./rules-of-jsx";

const compilerOptions = {
  strict: true,
  jsx: ts.JsxEmit.ReactJSX,
} as const satisfies ts.CompilerOptions;

test("rules-of-jsx", () => {
  const ret = ruleTester({
    tsx: true,
    ruleFn: rulesOfJsx,
    invalid: [
      // Rule000: Don't pass children as a prop
      {
        code: tsx`
          function Component() {
            return <div children="child" />;
          }
        `,
        compilerOptions,
        errors: [
          { message: "Don't pass children as a prop. Instead, put the children between the opening and closing tags." },
        ],
      },
      // Rule001: key after spread
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} key="id" />;
          }
        `,
        compilerOptions,
        errors: [
          { message: "The 'key' prop must be placed before any spread props when using the new JSX transform." },
        ],
      },
      {
        code: tsx`
          function Component({ props1, props2 }) {
            return <div {...props1} {...props2} key="id" />;
          }
        `,
        compilerOptions,
        errors: [
          { message: "The 'key' prop must be placed before any spread props when using the new JSX transform." },
        ],
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div className="test" {...props} key="id" />;
          }
        `,
        compilerOptions,
        errors: [
          { message: "The 'key' prop must be placed before any spread props when using the new JSX transform." },
        ],
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} key="id" className="test" />;
          }
        `,
        compilerOptions,
        errors: [
          { message: "The 'key' prop must be placed before any spread props when using the new JSX transform." },
        ],
      },
      // key after spread (with ref too, but only key triggers Rule000)
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} key="id" ref={null} />;
          }
        `,
        compilerOptions,
        errors: [
          { message: "The 'key' prop must be placed before any spread props when using the new JSX transform." },
        ],
      },
    ],
    valid: [
      // key before spread
      {
        code: tsx`
          function Component({ props }) {
            return <div key="id" {...props} />;
          }
        `,
        compilerOptions,
      },
      // ref before spread
      {
        code: tsx`
          function Component({ props }) {
            return <div ref={null} {...props} />;
          }
        `,
        compilerOptions,
      },
      // key and ref before spread
      {
        code: tsx`
          function Component({ props }) {
            return <div key="id" ref={null} {...props} />;
          }
        `,
        compilerOptions,
      },
      // no spread
      {
        code: tsx`
          function Component() {
            return <div key="id" />;
          }
        `,
        compilerOptions,
      },
      {
        code: tsx`
          function Component() {
            return <div ref={null} />;
          }
        `,
        compilerOptions,
      },
      // spread without key or ref
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} />;
          }
        `,
        compilerOptions,
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div key="id" key="id2" {...props} />;
          }
        `,
        compilerOptions,
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div className="test" {...props} />;
          }
        `,
        compilerOptions,
      },
      // ref after spread (no rule for this — only key-after-spread is checked)
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} ref={null} />;
          }
        `,
        compilerOptions,
      },
      {
        code: tsx`
          function Component({ props1, props2 }) {
            return <div {...props1} {...props2} ref={null} />;
          }
        `,
        compilerOptions,
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div className="test" {...props} ref={null} />;
          }
        `,
        compilerOptions,
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} ref={null} className="test" />;
          }
        `,
        compilerOptions,
      },
      // non-new JSX transforms: key after spread is OK
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} key="id" />;
          }
        `,
        compilerOptions: {
          strict: true,
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
          strict: true,
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
          strict: true,
          jsx: ts.JsxEmit.ReactNative,
        },
      },
      // non-new JSX transforms: ref after spread is OK
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} ref={null} />;
          }
        `,
        compilerOptions: {
          strict: true,
          jsx: ts.JsxEmit.None,
        },
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} ref={null} />;
          }
        `,
        compilerOptions: {
          strict: true,
          jsx: ts.JsxEmit.Preserve,
        },
      },
      {
        code: tsx`
          function Component({ props }) {
            return <div {...props} ref={null} />;
          }
        `,
        compilerOptions: {
          strict: true,
          jsx: ts.JsxEmit.ReactNative,
        },
      },
    ],
  });
  expect(ret).toBe(false);
});
