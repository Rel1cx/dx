import { name, version } from "../package.json";

import type { CompatiblePlugin } from "@eslint-react/shared";
import functionDefinition from "./rules/function-definition";
import functionName from "./rules/function-name";
import functionReturnBoolean from "./rules/function-return-boolean";

const plugin: CompatiblePlugin = {
  meta: {
    name,
    version,
  },
  rules: {
    "function-definition": functionDefinition,
    "function-name": functionName,
    "function-return-boolean": functionReturnBoolean,
  },
};

export default plugin;
