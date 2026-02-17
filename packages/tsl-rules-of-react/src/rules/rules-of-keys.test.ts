import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import ts from "typescript";
import { expect, test } from "vitest";

import { rulesOfKeys } from "./rules-of-keys";

const compilerOptions = {
  strict: true,
  jsx: ts.JsxEmit.ReactJSX,
} as const satisfies ts.CompilerOptions;

test("rules-of-keys", () => {
  const ret = ruleTester({
    tsx: true,
    ruleFn: rulesOfKeys,
    invalid: [
      // ──────────────────────────────────────────────────────────────
      // Rule000: Keys must be unique among siblings
      // ──────────────────────────────────────────────────────────────
      // {
      //   code: tsx`
      //     function Component() {
      //       return (
      //         <div>
      //           <span key="a" />
      //           <span key="a" />
      //         </div>
      //       );
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[0] },
      //     { message: messages[0] },
      //   ],
      // },
      // // Three siblings with the same key
      // {
      //   code: tsx`
      //     function Component() {
      //       return (
      //         <div>
      //           <span key="x" />
      //           <div key="x" />
      //           <p key="x" />
      //         </div>
      //       );
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[0] },
      //     { message: messages[0] },
      //     { message: messages[0] },
      //   ],
      // },
      // // Duplicate keys inside a fragment
      // {
      //   code: tsx`
      //     function Component() {
      //       return (
      //         <>
      //           <span key="dup" />
      //           <span key="dup" />
      //         </>
      //       );
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[0] },
      //     { message: messages[0] },
      //   ],
      // },
      // // Duplicate numeric key values in JSX expressions
      // {
      //   code: tsx`
      //     function Component() {
      //       return (
      //         <div>
      //           <span key={1} />
      //           <span key={1} />
      //         </div>
      //       );
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[0] },
      //     { message: messages[0] },
      //   ],
      // },

      // ──────────────────────────────────────────────────────────────
      // Rule001: Keys must be used when rendering lists (.map)
      // ──────────────────────────────────────────────────────────────
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
            message:
              "The '<></>' syntax cant have keys, so it can't be used as a child in list rendering. Use '<React.Fragment key={...}>...</React.Fragment>' instead.",
          },
        ],
      },
      // ──────────────────────────────────────────────────────────────
      // Rule002: Keys must not change – unstable key generation
      // ──────────────────────────────────────────────────────────────
      // Math.random()
      // {
      //   code: tsx`
      //     function Component() {
      //       return <div key={Math.random()} />;
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[2] },
      //   ],
      // },
      // // crypto.randomUUID()
      // {
      //   code: tsx`
      //     function Component() {
      //       return <div key={crypto.randomUUID()} />;
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[2] },
      //   ],
      // },
      // // Date.now()
      // {
      //   code: tsx`
      //     function Component() {
      //       return <div key={Date.now()} />;
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[2] },
      //   ],
      // },
      // // new Date()
      // {
      //   code: tsx`
      //     function Component() {
      //       return <div key={new Date() as any} />;
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[2] },
      //   ],
      // },
      // // uuid()
      // {
      //   code: tsx`
      //     declare function uuid(): string;
      //     function Component() {
      //       return <div key={uuid()} />;
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[2] },
      //   ],
      // },
      // // nanoid()
      // {
      //   code: tsx`
      //     declare function nanoid(): string;
      //     function Component() {
      //       return <div key={nanoid()} />;
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[2] },
      //   ],
      // },
      // // uniqueId()
      // {
      //   code: tsx`
      //     declare function uniqueId(): string;
      //     function Component() {
      //       return <div key={uniqueId()} />;
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[2] },
      //   ],
      // },
      // // Symbol()
      // {
      //   code: tsx`
      //     function Component() {
      //       return <div key={Symbol() as any} />;
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[2] },
      //   ],
      // },
      // // ++counter
      // {
      //   code: tsx`
      //     let counter = 0;
      //     function Component() {
      //       return <div key={++counter} />;
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[2] },
      //   ],
      // },
      // // counter++
      // {
      //   code: tsx`
      //     let counter = 0;
      //     function Component() {
      //       return <div key={counter++} />;
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[2] },
      //   ],
      // },
      // // Template literal with unstable expression
      // {
      //   code: tsx`
      //     function Component() {
      //       return <div key={${"`id-${Math.random()}`"}} />;
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[2] },
      //   ],
      // },
      // // Binary expression with unstable part
      // {
      //   code: tsx`
      //     function Component() {
      //       return <div key={"prefix-" + Math.random()} />;
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[2] },
      //   ],
      // },

      // // ──────────────────────────────────────────────────────────────
      // // Combined: Rule001 + Rule002
      // // ──────────────────────────────────────────────────────────────
      // // .map with Math.random() as key (unstable) – only Rule002 fires because key IS present
      // {
      //   code: tsx`
      //     function Component({ items }: { items: string[] }) {
      //       return <div>{items.map(item => <span key={Math.random()}>{item}</span>)}</div>;
      //     }
      //   `,
      //   compilerOptions,
      //   errors: [
      //     { message: messages[2] },
      //   ],
      // },
    ],
    valid: [
      // ──────────────────────────────────────────────────────────────
      // Rule000: Unique keys among siblings – valid cases
      // ──────────────────────────────────────────────────────────────
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

      // ──────────────────────────────────────────────────────────────
      // Rule001: Keys in lists – valid cases
      // ──────────────────────────────────────────────────────────────
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

      // ──────────────────────────────────────────────────────────────
      // Rule002: Stable keys – valid cases
      // ──────────────────────────────────────────────────────────────
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
            return <div key={${"`item-${id}`"}} />;
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
    ],
  });
  expect(ret).toBe(false);
});
