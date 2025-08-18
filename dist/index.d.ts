import * as _typescript_eslint_utils_ts_eslint0 from "@typescript-eslint/utils/ts-eslint";

//#region src/index.d.ts
declare const _default: {
  readonly meta: {
    readonly name: string;
    readonly version: string;
  };
  readonly rules: {
    readonly "function-definition": _typescript_eslint_utils_ts_eslint0.RuleModule<"functionDefinition", [], unknown, _typescript_eslint_utils_ts_eslint0.RuleListener>;
    readonly "function-name": _typescript_eslint_utils_ts_eslint0.RuleModule<"functionName", [], unknown, _typescript_eslint_utils_ts_eslint0.RuleListener>;
    readonly "function-return-boolean": _typescript_eslint_utils_ts_eslint0.RuleModule<"functionReturnBoolean", readonly [{
      readonly pattern?: string;
    } | undefined], unknown, _typescript_eslint_utils_ts_eslint0.RuleListener>;
  };
};
//#endregion
export { _default as default };