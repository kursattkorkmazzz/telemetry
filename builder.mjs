import * as esbuild from "esbuild";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

const sharedConfig = {
  bundle: true,
  minify: true,
  sourcemap: true,
  plugins: [
    polyfillNode({
      polyfills: {
        events: true,
        os: true,
      },
    }),
  ],
};

Promise.all([
  // Build for Node
  esbuild.build({
    ...sharedConfig,
    entryPoints: ["./src/node/index.ts"],
    platform: "node",
    format: "esm",
    outfile: "./dist/node/index.js",
    external: ["events", "os"],
  }),
  // Build for React
  esbuild.build({
    ...sharedConfig,
    entryPoints: [
      "./src/react/index.ts",
      "./src/react/collectors/index.ts",
      "./src/react/publishers/index.ts",
      "./src/react/schedulers/index.ts",
    ],
    platform: "browser",
    jsx: "automatic",
    format: "esm",
    outdir: "./dist/react",
    external: ["react", "react-dom"],
  }),
])
  .then(() => {
    console.info("✅ Build başarılı...");
  })
  .catch((e) => {
    console.error("Build başarısız...");
    console.error(e);
    process.exit(-1);
  });

/*
async function build() {
  await esbuild.build({
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/index.js",
    bundle: true,
    platform: "node",
    format: "esm",
    jsx: "preserve",
    // sourceRoot: "./src",
    sourcemap: true,
    loader: {
      [".ts"]: "ts",
      [".tsx"]: "tsx",
    },
  });
}

build();
*/
