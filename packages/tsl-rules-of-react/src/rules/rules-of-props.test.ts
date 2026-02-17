import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import ts from "typescript";
import { expect, test } from "vitest";

import { rulesOfProps } from "./rules-of-props";

const compilerOptions = {
  strict: true,
  jsx: ts.JsxEmit.ReactJSX,
} as const satisfies ts.CompilerOptions;

test("rules-of-props", () => {
  const ret = ruleTester({
    tsx: true,
    ruleFn: rulesOfProps,
    invalid: [
      // Rule001: implicit key via spread
      {
        code: tsx`
          function Component({ data }: { data: { key: string; name: string } }) {
            return <div {...data} />;
          }
        `,
        compilerOptions,
        errors: [
          {
            message:
              "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
          },
        ],
      },
      {
        code: tsx`
          interface Props { key: string; value: number }
          function Component({ props }: { props: Props }) {
            return <div {...props} />;
          }
        `,
        compilerOptions,
        errors: [
          {
            message:
              "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
          },
        ],
      },
      {
        code: tsx`
          function Component({ item }: { item: { key: number; id: string } }) {
            return <div {...item} {...item} />;
          }
        `,
        compilerOptions,
        errors: [
          {
            message:
              "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
          },
          {
            message:
              "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
          },
        ],
      },
      // Rule002: implicit ref via spread
      {
        code: tsx`
          function Component({ data }: { data: { ref: any; name: string } }) {
            return <div {...data} />;
          }
        `,
        compilerOptions,
        errors: [
          {
            message:
              "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
          },
        ],
      },
      {
        code: tsx`
          interface Props { ref: any; value: number }
          function Component({ props }: { props: Props }) {
            return <div {...props} />;
          }
        `,
        compilerOptions,
        errors: [
          {
            message:
              "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
          },
        ],
      },
      {
        code: tsx`
          function Component({ item }: { item: { ref: any; id: string } }) {
            return <div {...item} {...item} />;
          }
        `,
        compilerOptions,
        errors: [
          {
            message:
              "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
          },
          {
            message:
              "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
          },
        ],
      },
      // Both key and ref implicit via spread
      {
        code: tsx`
          function Component({ data }: { data: { key: string; ref: any; name: string } }) {
            return <div {...data} />;
          }
        `,
        compilerOptions,
        errors: [
          {
            message:
              "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
          },
          {
            message:
              "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
          },
        ],
      },
    ],
    valid: [
      // React.Attributes spread is allowed for key
      {
        code: tsx`
          import React from "react";
          function Component({ attrs }: { attrs: React.Attributes }) {
            return <div {...attrs} />;
          }
        `,
        compilerOptions,
      },
      // spread without key or ref property
      {
        code: tsx`
          function Component({ data }: { data: { id: string; name: string } }) {
            return <div {...data} />;
          }
        `,
        compilerOptions,
      },
      {
        code: tsx`
          interface Props { id: number; value: string }
          function Component({ props }: { props: Props }) {
            return <div {...props} />;
          }
        `,
        compilerOptions,
      },
      {
        code: tsx`
          const App = () => {
            return [<div key="1">1</div>];
          };
        `,
        compilerOptions,
      },
      {
        code: tsx`
          const App = () => {
            return [
              <div key="1">1</div>,
              <div key="2">2</div>,
              <div key="3">3</div>,
            ];
          };
        `,
        compilerOptions,
      },
      {
        code: tsx`
          const App = () => {
            return [1, 2, 3].map((item) => <div key={Math.random()}>{item}</div>);
          };
        `,
        compilerOptions,
      },
      // https://github.com/Rel1cx/eslint-react/issues/1472
      {
        code: tsx`
          import * as React from "react";

          function PaginationItem({ ...props }: React.ComponentProps<"li">) {
            return <li data-slot="pagination-item" {...props} />;
          }
        `,
        compilerOptions,
      },
      {
        code: tsx`
          import React from "react";

          function PaginationItem({ ...props }: React.ComponentProps<"li">) {
            return <li data-slot="pagination-item" {...props} />;
          }
        `,
        compilerOptions,
      },
      {
        code: tsx`
          import type { ComponentProps } from "react";

          function PaginationItem({ ...props }: ComponentProps<"li">) {
            return <li data-slot="pagination-item" {...props} />;
          }
        `,
        compilerOptions,
      },
      {
        code: tsx`
          import { type ComponentProps } from "react";

          function PaginationItem({ ...props }: ComponentProps<"li">) {
            return <li data-slot="pagination-item" {...props} />;
          }
        `,
        compilerOptions,
      },
      {
        code: tsx`
          import { ComponentProps } from "react";

          function PaginationItem({ ...props }: ComponentProps<"li">) {
            return <li data-slot="pagination-item" {...props} />;
          }
        `,
        compilerOptions,
      },
      // https://github.com/Rel1cx/eslint-react/issues/1476
      {
        code: tsx`
          import { ComponentProps } from "react";

          function PaginationItem({ ...props }: Omit<React.ComponentProps<"li">, "value">) {
            return <li data-slot="pagination-item" {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading props without key property
      {
        code: tsx`
          const App = () => {
            const props = { id: "test", className: "foo" };
            return <div {...props}>content</div>;
          };
        `,
        compilerOptions,
      },
      // Valid: spreading props with 'id' but not 'key'
      {
        code: tsx`
          const App = () => {
            const props = { id: "unique", name: "test" };
            return <div {...props} />;
          };
        `,
        compilerOptions,
      },
      // Valid: spreading from a typed object without key
      {
        code: tsx`
          type Props = { id: string; value: number };
          const App = () => {
            const props: Props = { id: "test", value: 42 };
            return <div {...props} />;
          };
        `,
        compilerOptions,
      },
      // Valid: spreading in a map callback where the item has no key
      {
        code: tsx`
          const items = [{ id: "1", text: "a" }];
          const App = () => {
            return items.map((item) => <div key={item.id} {...item}>{item.text}</div>);
          };
        `,
        compilerOptions,
      },
      // Valid: spreading empty object
      {
        code: tsx`
          const App = () => {
            const props = {};
            return <div {...props} />;
          };
        `,
        compilerOptions,
      },
      // Valid: spreading props with explicit key before spread
      {
        code: tsx`
          const App = () => {
            const props = { id: "test" };
            return [
              <div key="1" {...props}>1</div>,
              <div key="2" {...props}>2</div>,
            ];
          };
        `,
        compilerOptions,
      },
      // Valid: spreading from a function parameter without key
      {
        code: tsx`
          function App({ items }: { items: Array<{ id: string; content: string }> }) {
            return items.map((item) => <div key={item.id} {...item}>{item.content}</div>);
          }
        `,
        compilerOptions,
      },
      // Valid: spreading JSX intrinsic attributes for button
      {
        code: tsx`
          import type { ComponentProps } from "react";

          function MyButton({ ...props }: ComponentProps<"button">) {
            return <button type="button" {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading JSX intrinsic attributes for input
      {
        code: tsx`
          import type { ComponentProps } from "react";

          function MyInput({ ...props }: ComponentProps<"input">) {
            return <input {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading JSX intrinsic attributes for anchor
      {
        code: tsx`
          import type { ComponentProps } from "react";

          function MyLink({ ...props }: ComponentProps<"a">) {
            return <a {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading with Pick type (no key)
      {
        code: tsx`
          import type { ComponentProps } from "react";

          function MyDiv({ ...props }: Pick<ComponentProps<"div">, "className" | "id">) {
            return <div {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: custom component props without key
      {
        code: tsx`
          interface MyProps {
            title: string;
            description?: string;
          }
          function MyComponent({ ...props }: MyProps) {
            return <div {...props}>{props.title}</div>;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading from a variable with Record type (no key)
      {
        code: tsx`
          const App = () => {
            const props: Record<string, string> = { a: "1", b: "2" };
            return <div {...props} />;
          };
        `,
        compilerOptions,
      },
      // Valid: spreading intersection type without key
      {
        code: tsx`
          type BaseProps = { id: string };
          type ExtendedProps = BaseProps & { className?: string };
          const App = () => {
            const props: ExtendedProps = { id: "test", className: "foo" };
            return <div {...props} />;
          };
        `,
        compilerOptions,
      },
      // Valid: spreading object with symbol keys only
      {
        code: tsx`
          const App = () => {
            const symbolKey = Symbol("test");
            const props = { [symbolKey]: "value", regularProp: "test" };
            return <div {...props} />;
          };
        `,
        compilerOptions,
      },
      // Valid: spreading props from a destructured parameter without key
      {
        code: tsx`
          const App = () => {
            const items = [{ id: "1", text: "hello" }];
            return items.map(({ id, ...rest }) => <div key={id} {...rest}>{rest.text}</div>);
          };
        `,
        compilerOptions,
      },
      // Valid: nested spread without key
      {
        code: tsx`
          const App = () => {
            const inner = { className: "inner" };
            const outer = { ...inner, id: "outer" };
            return <div {...outer} />;
          };
        `,
        compilerOptions,
      },
      // Valid: spreading in conditional rendering without key in props
      {
        code: tsx`
          const App = ({ show, props }: { show: boolean; props: { className: string } }) => {
            return show ? <div {...props}>visible</div> : null;
          };
        `,
        compilerOptions,
      },
      // Valid: spreading HTMLAttributes from React
      {
        code: tsx`
          import type { HTMLAttributes } from "react";

          function MySpan({ ...props }: HTMLAttributes<HTMLSpanElement>) {
            return <span {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading SVGAttributes from React
      {
        code: tsx`
          import type { SVGAttributes } from "react";

          function MySvg({ ...props }: SVGAttributes<SVGSVGElement>) {
            return <svg {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: destructuring key out before spreading rest
      {
        code: tsx`
          const App = () => {
            const items = [{ key: "1", text: "hello" }];
            return items.map(({ key, ...rest }) => <div key={key} {...rest}>{rest.text}</div>);
          };
        `,
        compilerOptions,
      },
      // Valid: spreading from Partial<> without key in base
      {
        code: tsx`
          type BaseProps = { id: string; className: string };
          const App = () => {
            const props: Partial<BaseProps> = { id: "test" };
            return <div {...props} />;
          };
        `,
        compilerOptions,
      },
      // Valid: spreading props from React.forwardRef
      {
        code: tsx`
          import React from "react";

          const MyInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>((props, ref) => {
            return <input ref={ref} {...props} />;
          });
        `,
        compilerOptions,
      },
      // Valid: spreading React.HTMLAttributes (internally defined key)
      {
        code: tsx`
          import type { HTMLAttributes } from "react";

          function MyDiv({ ...props }: HTMLAttributes<HTMLDivElement>) {
            return <div {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading React.ButtonHTMLAttributes
      {
        code: tsx`
          import type { ButtonHTMLAttributes } from "react";

          function MyButton({ ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
            return <button {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading React.InputHTMLAttributes
      {
        code: tsx`
          import type { InputHTMLAttributes } from "react";

          function MyInput({ ...props }: InputHTMLAttributes<HTMLInputElement>) {
            return <input {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading React.AnchorHTMLAttributes
      {
        code: tsx`
          import type { AnchorHTMLAttributes } from "react";

          function MyAnchor({ ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
            return <a {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading from React.PropsWithChildren (key is React-internal)
      {
        code: tsx`
          import type { PropsWithChildren } from "react";

          function Wrapper({ ...props }: PropsWithChildren<{ className: string }>) {
            return <div {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading from React.PropsWithRef
      {
        code: tsx`
          import type { PropsWithRef } from "react";

          function MyInput({ ...props }: PropsWithRef<React.ComponentProps<"input">>) {
            return <input {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading after extracting key with explicit key attribute
      {
        code: tsx`
          const App = () => {
            const props = { key: "1", id: "test" };
            const { key, ...rest } = props;
            return <div key={key} {...rest} />;
          };
        `,
        compilerOptions,
      },
      // Valid: spreading with Omit<> that removes key
      {
        code: tsx`
          import type { ComponentProps } from "react";

          function MyDiv({ ...props }: Omit<ComponentProps<"div">, "key">) {
            return <div {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading from Pick<> that doesn't include key
      {
        code: tsx`
          type Props = { key: string; id: string; className: string };
          const App = () => {
            const props: Pick<Props, "id" | "className"> = { id: "test", className: "foo" };
            return <div {...props} />;
          };
        `,
        compilerOptions,
      },
      // Valid: multiple spreads, none containing key
      {
        code: tsx`
          const App = () => {
            const style = { color: "red" };
            const attrs = { id: "test" };
            return <div {...style} {...attrs} />;
          };
        `,
        compilerOptions,
      },
      // Valid: spreading from React.FormHTMLAttributes
      {
        code: tsx`
          import type { FormHTMLAttributes } from "react";

          function MyForm({ ...props }: FormHTMLAttributes<HTMLFormElement>) {
            return <form {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading from React.TableHTMLAttributes
      {
        code: tsx`
          import type { TableHTMLAttributes } from "react";

          function MyTable({ ...props }: TableHTMLAttributes<HTMLTableElement>) {
            return <table {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading from React.TextareaHTMLAttributes
      {
        code: tsx`
          import type { TextareaHTMLAttributes } from "react";

          function MyTextarea({ ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
            return <textarea {...props} />;
          }
        `,
        compilerOptions,
      },
      {
        code: tsx`
          import type { ComponentPropsWithoutRef, ComponentPropsWithRef } from "react-dom";

          export function PaginationItem1({ ...props }: ComponentPropsWithRef<"li">) {
            return <li data-slot="pagination-item" {...props} />;
          }

          export function PaginationItem2({ ...props }: ComponentPropsWithoutRef<"li">) {
            return <li data-slot="pagination-item" {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading from peact.PropsWithRef
      {
        code: tsx`
          import type { PropsWithRef } from "preact";

          function MyInput({ ...props }: PropsWithRef<React.ComponentProps<"input">>) {
            return <input {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading from peact.TextareaHTMLAttributes
      {
        code: tsx`
          import type { TextareaHTMLAttributes } from "preact";

          function MyTextarea({ ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
            return <textarea {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading from peact.PropsWithRef
      {
        code: tsx`
          import peact from "preact";

          function MyInput({ ...props }: peact.PropsWithRef<React.ComponentProps<"input">>) {
            return <input {...props} />;
          }
        `,
        compilerOptions,
      },
      // Valid: spreading from peact.TextareaHTMLAttributes
      {
        code: tsx`
          import peact from "preact";

          function MyTextarea({ ...props }: peact.TextareaHTMLAttributes<HTMLTextAreaElement>) {
            return <textarea {...props} />;
          }
        `,
        compilerOptions,
      },
    ],
  });
  expect(ret).toBe(false);
});
