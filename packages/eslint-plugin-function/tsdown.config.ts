import type { UserConfig } from "tsdown";

export default {
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  external: ["eslint", "typescript"],
  inlineOnly: ["@jsr/let__eff"],
  fixedExtension: false,
  format: ["esm"],
  minify: false,
  outDir: "dist",
  platform: "node",
  sourcemap: false,
  target: "node20",
  treeshake: true,
} satisfies UserConfig;
