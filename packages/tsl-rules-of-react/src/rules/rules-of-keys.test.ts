import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import ts from "typescript";
import { expect, test } from "vitest";

import { messages, rulesOfKeys } from "./rules-of-keys";

test("rules-of-keys", () => {
  const ret = ruleTester({
    tsx: true,
    ruleFn: rulesOfKeys,
    invalid: [
      {
        code: tsx`
          function Component({ data }: { data: { key: string; name: string } }) {
            return <div {...data} />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
        errors: [
          { message: messages[4] },
        ],
      },
      {
        code: tsx`
          interface Props { key: string; value: number }
          function Component({ props }: { props: Props }) {
            return <div {...props} />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
        errors: [
          { message: messages[4] },
        ],
      },
      {
        code: tsx`
          function Component({ item }: { item: { key: number; id: string } }) {
            return <div {...item} {...item} />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
        errors: [
          { message: messages[4] },
          { message: messages[4] },
        ],
      },
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
          { message: messages[3] },
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
          { message: messages[3] },
          { message: messages[3] },
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
          { message: messages[3] },
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
          { message: messages[3] },
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
      {
        code: tsx`
          import React from "react";
          function Component({ attrs }: { attrs: React.Attributes }) {
            return <div {...attrs} />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
      },
      {
        code: tsx`
          function Component({ data }: { data: { id: string; name: string } }) {
            return <div {...data} />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
      },
      {
        code: tsx`
          interface Props { id: number; value: string }
          function Component({ props }: { props: Props }) {
            return <div {...props} />;
          }
        `,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
      },
    ],
  });
  expect(ret).toBe(false);
});
