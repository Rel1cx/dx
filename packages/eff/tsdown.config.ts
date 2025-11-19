import { defineConfig } from "tsdown";

export default defineConfig({
  exports: true,
  clean: true,
  dts: true,
  fixedExtension: false,
  format: ["esm"],
  minify: false,
  outDir: "dist",
  platform: "neutral",
  target: "es2021",
});
