import { defineConfig } from "tsup";
import { polyfillNode } from "esbuild-plugin-polyfill-node";
export default defineConfig({
  entry: ["./src/core/index.ts", "./src/react/index.ts"],
  experimentalDts: true,
  format: ["esm"],
  target: "esnext",
  cjsInterop: true,
  loader: {
    ".ts": "ts",
    ".tsx": "tsx",
  },
  shims: true,
  async onSuccess() {
    console.log("✅ Build başarılı.");
  },
});
