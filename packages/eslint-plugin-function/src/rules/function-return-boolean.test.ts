import tsx from "dedent";
import { ruleTester } from "../../tests/rule-tester";
import functionReturnType from "./function-return-boolean";

ruleTester.run("function-return-boolean", functionReturnType, {
  invalid: [
    {
      code: tsx`
        function isValid(value: string) {
          return {} as any;
        }
      `,
      errors: [
        {
          messageId: "functionReturnBoolean",
          data: {
            functionName: "isValid",
            variants: "'any'",
          },
        },
      ],
    },
    {
      code: tsx`
        function isValid(value: string) {
          return {} as unknown;
        }
      `,
      errors: [
        {
          messageId: "functionReturnBoolean",
          data: {
            functionName: "isValid",
            variants: "'unknown'",
          },
        },
      ],
    },
    {
      code: tsx`
        function isValid(value: string) {
          return {} as void;
        }
      `,
      errors: [
        {
          messageId: "functionReturnBoolean",
          data: {
            functionName: "isValid",
            variants: "'nullish'",
          },
        },
      ],
    },
    {
      code: tsx`
        function isValid(value: string) {
          return undefined;
        }
      `,
      errors: [
        {
          messageId: "functionReturnBoolean",
          data: {
            functionName: "isValid",
            variants: "'nullish'",
          },
        },
      ],
    },
    {
      code: tsx`
        function isValid(value: string) {
          return 1;
        }
      `,
      errors: [
        {
          messageId: "functionReturnBoolean",
          data: {
            functionName: "isValid",
            variants: "'truthy number'",
          },
        },
      ],
    },
    {
      code: tsx`
        function isValid(value: string) {
          return "hello";
        }
      `,
      errors: [
        {
          messageId: "functionReturnBoolean",
          data: {
            functionName: "isValid",
            variants: "'truthy string'",
          },
        },
      ],
    },
    {
      code: tsx`
        declare const falseOrNull: false | null;
        function isValid(value: string) {
          return falseOrNull;
        }
      `,
      errors: [
        {
          messageId: "functionReturnBoolean",
          data: {
            functionName: "isValid",
            variants: "'nullish', 'falsy boolean'",
          },
        },
      ],
    },
    {
      code: tsx`
        declare const falseOrNull: false | null;
        function isValid(value: string) {
          return falseOrNull ?? 1;
        }
      `,
      errors: [
        {
          messageId: "functionReturnBoolean",
          data: {
            functionName: "isValid",
            variants: "'falsy boolean', 'truthy number'",
          },
        },
      ],
    },
    {
      code: tsx`
        function isValid(value: string) {
          return value.length > 0 ? 1 : undefined;
        }
      `,
      errors: [
        {
          messageId: "functionReturnBoolean",
          data: {
            functionName: "isValid",
            variants: "'nullish', 'truthy number'",
          },
        },
      ],
    },
  ],
  valid: [
    tsx`
      function isValid(value: string) {
        return never as never;
      }
    `,
    tsx`
      function isValid(value: string) {
        return value.length > 0;
      }
    `,
  ],
});
