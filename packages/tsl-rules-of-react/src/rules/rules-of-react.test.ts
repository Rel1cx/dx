import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import ts from "typescript";
import { expect, test } from "vitest";

import { rulesOfReact } from "./rules-of-react";

const compilerOptions = {
  strict: true,
  jsx: ts.JsxEmit.ReactJSX,
} as const satisfies ts.CompilerOptions;

test("rules-of-react", () => {
  const ret = ruleTester({
    tsx: true,
    ruleFn: rulesOfReact,
    invalid: [
      // ===== Rules of JSX =====
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

      // ===== Rules of Keys =====
      // Rule001: Keys must be used when rendering lists (.map)
      // Arrow function concise body without key
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return <div>{items.map(item => <span>{item}</span>)}</div>;
          }
        `,
        compilerOptions,
        errors: [
          { message: "Keys must be used when rendering lists." },
        ],
      },
      // Arrow function block body without key
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return (
              <div>
                {items.map(item => {
                  return <span>{item}</span>;
                })}
              </div>
            );
          }
        `,
        compilerOptions,
        errors: [
          { message: "Keys must be used when rendering lists." },
        ],
      },
      // Function expression without key
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return (
              <div>
                {items.map(function(item) {
                  return <span>{item}</span>;
                })}
              </div>
            );
          }
        `,
        compilerOptions,
        errors: [
          { message: "Keys must be used when rendering lists." },
        ],
      },
      // flatMap without key
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return <div>{items.flatMap(item => <span>{item}</span>)}</div>;
          }
        `,
        compilerOptions,
        errors: [
          { message: "Keys must be used when rendering lists." },
        ],
      },
      // Self-closing element in map without key
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return <div>{items.map(item => <br />)}</div>;
          }
        `,
        compilerOptions,
        errors: [
          { message: "Keys must be used when rendering lists." },
        ],
      },
      // Conditional returns in map – both branches missing key
      {
        code: tsx`
          function Component({ items }: { items: { type: string }[] }) {
            return (
              <div>
                {items.map(item => {
                  if (item.type === "a") return <span />;
                  return <div />;
                })}
              </div>
            );
          }
        `,
        compilerOptions,
        errors: [
          { message: "Keys must be used when rendering lists." },
          { message: "Keys must be used when rendering lists." },
        ],
      },
      // Ternary in concise arrow – both branches missing key
      {
        code: tsx`
          function Component({ items }: { items: { ok: boolean }[] }) {
            return (
              <div>
                {items.map(item => item.ok ? <span /> : <div />)}
              </div>
            );
          }
        `,
        compilerOptions,
        errors: [
          { message: "Keys must be used when rendering lists." },
          { message: "Keys must be used when rendering lists." },
        ],
      },
      // Parenthesized JSX in map without key
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return <div>{items.map(item => (<span>{item}</span>))}</div>;
          }
        `,
        compilerOptions,
        errors: [
          { message: "Keys must be used when rendering lists." },
        ],
      },
      // Fragment returned from map without key
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return <div>{items.map(item => <><span /><span /></>)}</div>;
          }
        `,
        compilerOptions,
        errors: [
          {
            message: "The '<></>' syntax cant have keys, so it can't be used as a child in list rendering. Use '<React.Fragment key={...}>...</React.Fragment>' instead.",
          },
        ],
      },

      // Rule003: Don't use array index as key
      // Direct use of index as key
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return <div>{items.map((item, index) => <span key={index}>{item}</span>)}</div>;
          }
        `,
        compilerOptions,
        errors: [
          {
            message: "Don't use array index as key. Keys should be stable and unique identifiers that don't change between renders.",
          },
        ],
      },
      // Short variable name (i) as index key
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return <div>{items.map((item, i) => <span key={i}>{item}</span>)}</div>;
          }
        `,
        compilerOptions,
        errors: [
          {
            message: "Don't use array index as key. Keys should be stable and unique identifiers that don't change between renders.",
          },
        ],
      },
      // Template literal with index
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return <div>{items.map((item, index) => <span key={\`item-\${index}\`}>{item}</span>)}</div>;
          }
        `,
        compilerOptions,
        errors: [
          {
            message: "Don't use array index as key. Keys should be stable and unique identifiers that don't change between renders.",
          },
        ],
      },
      // String concatenation with index
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return <div>{items.map((item, index) => <span key={'item-' + index}>{item}</span>)}</div>;
          }
        `,
        compilerOptions,
        errors: [
          {
            message: "Don't use array index as key. Keys should be stable and unique identifiers that don't change between renders.",
          },
        ],
      },
      // index.toString() as key
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return <div>{items.map((item, index) => <span key={index.toString()}>{item}</span>)}</div>;
          }
        `,
        compilerOptions,
        errors: [
          {
            message: "Don't use array index as key. Keys should be stable and unique identifiers that don't change between renders.",
          },
        ],
      },
      // String(index) as key
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return <div>{items.map((item, index) => <span key={String(index)}>{item}</span>)}</div>;
          }
        `,
        compilerOptions,
        errors: [
          {
            message: "Don't use array index as key. Keys should be stable and unique identifiers that don't change between renders.",
          },
        ],
      },
      // Parenthesized index as key
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return <div>{items.map((item, index) => <span key={(index)}>{item}</span>)}</div>;
          }
        `,
        compilerOptions,
        errors: [
          {
            message: "Don't use array index as key. Keys should be stable and unique identifiers that don't change between renders.",
          },
        ],
      },
      // flatMap with index as key
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return <div>{items.flatMap((item, index) => <span key={index}>{item}</span>)}</div>;
          }
        `,
        compilerOptions,
        errors: [
          {
            message: "Don't use array index as key. Keys should be stable and unique identifiers that don't change between renders.",
          },
        ],
      },
      // Function expression with index as key
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return (
              <div>
                {items.map(function(item, index) {
                  return <span key={index}>{item}</span>;
                })}
              </div>
            );
          }
        `,
        compilerOptions,
        errors: [
          {
            message: "Don't use array index as key. Keys should be stable and unique identifiers that don't change between renders.",
          },
        ],
      },
      // Arrow function block body with index as key
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return (
              <div>
                {items.map((item, index) => {
                  return <span key={index}>{item}</span>;
                })}
              </div>
            );
          }
        `,
        compilerOptions,
        errors: [
          {
            message: "Don't use array index as key. Keys should be stable and unique identifiers that don't change between renders.",
          },
        ],
      },

      // ===== Rules of Props =====
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
            message: "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
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
            message: "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
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
            message: "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
          },
          {
            message: "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
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
            message: "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
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
            message: "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
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
            message: "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
          },
          {
            message: "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
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
            message: "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
          },
          {
            message: "Spread props must not implicitly pass 'key', 'ref', or 'children' unless they are typed as the corresponding React attributes (e.g., 'React.Attributes.key' for 'key', 'React.RefAttributes.ref' for 'ref', etc.).",
          },
        ],
      },
    ],
    valid: [
      // ===== Rules of JSX - valid cases =====
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

      // ===== Rules of Keys - valid cases =====
      // Rule000: Unique keys among siblings – valid cases
      // Unique keys
      {
        code: tsx`
          function Component() {
            return (
              <div>
                <span key="a" />
                <span key="b" />
              </div>
            );
          }
        `,
        compilerOptions,
      },
      // No keys at all (no duplicates)
      {
        code: tsx`
          function Component() {
            return (
              <div>
                <span />
                <span />
              </div>
            );
          }
        `,
        compilerOptions,
      },
      // Single child with key
      {
        code: tsx`
          function Component() {
            return (
              <div>
                <span key="a" />
              </div>
            );
          }
        `,
        compilerOptions,
      },
      // Dynamic keys (can't statically detect duplicates)
      {
        code: tsx`
          function Component({ a, b }: { a: string; b: string }) {
            return (
              <div>
                <span key={a} />
                <span key={b} />
              </div>
            );
          }
        `,
        compilerOptions,
      },
      // Same key in different parents – that's fine
      {
        code: tsx`
          function Component() {
            return (
              <div>
                <div><span key="a" /></div>
                <div><span key="a" /></div>
              </div>
            );
          }
        `,
        compilerOptions,
      },

      // Rule001: Keys in lists – valid cases
      // .map with key present
      {
        code: tsx`
          function Component({ items }: { items: { id: string; name: string }[] }) {
            return <div>{items.map(item => <span key={item.id}>{item.name}</span>)}</div>;
          }
        `,
        compilerOptions,
      },
      // .map with key in block body
      {
        code: tsx`
          function Component({ items }: { items: { id: string }[] }) {
            return (
              <div>
                {items.map(item => {
                  return <span key={item.id} />;
                })}
              </div>
            );
          }
        `,
        compilerOptions,
      },
      // .flatMap with key present
      {
        code: tsx`
          function Component({ items }: { items: { id: string }[] }) {
            return <div>{items.flatMap(item => <span key={item.id} />)}</div>;
          }
        `,
        compilerOptions,
      },
      // Non-list-rendering methods like .filter, .forEach
      {
        code: tsx`
          function Component({ items }: { items: string[] }) {
            return <div>{items.filter(item => item.length > 0) as any}</div>;
          }
        `,
        compilerOptions,
      },
      // Ternary in map where both branches have keys
      {
        code: tsx`
          function Component({ items }: { items: { ok: boolean; id: string }[] }) {
            return (
              <div>
                {items.map(item => item.ok ? <span key={item.id} /> : <div key={item.id} />)}
              </div>
            );
          }
        `,
        compilerOptions,
      },
      // Multiple return paths with keys
      {
        code: tsx`
          function Component({ items }: { items: { type: string; id: string }[] }) {
            return (
              <div>
                {items.map(item => {
                  if (item.type === "a") return <span key={item.id} />;
                  return <div key={item.id} />;
                })}
              </div>
            );
          }
        `,
        compilerOptions,
      },
      // .map called on non-array (not our concern, won't have JSX)
      {
        code: tsx`
          function Component() {
            const m = new Map<string, number>();
            const result = Array.from(m.entries()).map(([k, v]) => <span key={k}>{v}</span>);
            return <div>{result}</div>;
          }
        `,
        compilerOptions,
      },

      // Rule002: Stable keys – valid cases
      // String literal key
      {
        code: tsx`
          function Component() {
            return <div key="stable" />;
          }
        `,
        compilerOptions,
      },
      // Variable reference key
      {
        code: tsx`
          function Component({ id }: { id: string }) {
            return <div key={id} />;
          }
        `,
        compilerOptions,
      },
      // Property access key
      {
        code: tsx`
          function Component({ item }: { item: { id: string } }) {
            return <div key={item.id} />;
          }
        `,
        compilerOptions,
      },
      // Template literal with stable values
      {
        code: tsx`
          function Component({ id }: { id: string }) {
            return <div key={\`item-\${id}\`} />;
          }
        `,
        compilerOptions,
      },
      // toString()
      {
        code: tsx`
          function Component({ id }: { id: number }) {
            return <div key={id.toString()} />;
          }
        `,
        compilerOptions,
      },
      // String(x)
      {
        code: tsx`
          function Component({ id }: { id: number }) {
            return <div key={String(id)} />;
          }
        `,
        compilerOptions,
      },
      // Numeric literal key
      {
        code: tsx`
          function Component() {
            return <div key={42} />;
          }
        `,
        compilerOptions,
      },
      // Concatenation with stable values
      {
        code: tsx`
          function Component({ prefix, id }: { prefix: string; id: string }) {
            return <div key={prefix + "-" + id} />;
          }
        `,
        compilerOptions,
      },

      // Rule003: Array index as key – valid cases
      // Using item property even when index parameter is present
      {
        code: tsx`
          function Component({ items }: { items: { id: string }[] }) {
            return <div>{items.map((item, index) => <span key={item.id}>{index}</span>)}</div>;
          }
        `,
        compilerOptions,
      },
      // No index parameter declared – index not available
      {
        code: tsx`
          function Component({ items }: { items: { id: string }[] }) {
            return <div>{items.map(item => <span key={item.id} />)}</div>;
          }
        `,
        compilerOptions,
      },
      // Template literal with item property (not index)
      {
        code: tsx`
          function Component({ items }: { items: { id: string }[] }) {
            return <div>{items.map((item, index) => <span key={\`item-\${item.id}\`}>{index}</span>)}</div>;
          }
        `,
        compilerOptions,
      },
      // String(item.id) – conversion of a stable value
      {
        code: tsx`
          function Component({ items }: { items: { id: number }[] }) {
            return <div>{items.map((item, index) => <span key={String(item.id)}>{index}</span>)}</div>;
          }
        `,
        compilerOptions,
      },
      // Arbitrary function call that happens to receive index – not flagged
      {
        code: tsx`
          function getKey(item: { id: string }, index: number) { return item.id; }
          function Component({ items }: { items: { id: string }[] }) {
            return <div>{items.map((item, index) => <span key={getKey(item, index)} />)}</div>;
          }
        `,
        compilerOptions,
      },

      // ===== Rules of Props - valid cases =====
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
