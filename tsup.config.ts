import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    sourceIndex: "sources/index.ts",
    testIndex: "tests/index.ts",
    tests: "tests/tests.ts",
  },
  format: ["esm", "cjs"],
  outDir: "outputs",
  dts: true,
  clean: true,
  sourcemap: true,
});