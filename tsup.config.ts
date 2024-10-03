import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
  minify: 'terser',
  splitting: true,
  // loader: {
  //   '.json': 'file',
  // },
});