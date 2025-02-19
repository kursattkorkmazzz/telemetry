import * as esbuild from "esbuild";

async function build() {
  await esbuild.build({
    entryPoints: ["./src/**/*.ts"],
    platform: "node",
    format: "esm",
    outdir: "./build",
    sourceRoot: "./src",

    loader: {
      [".ts"]: "ts",
    },
    banner: {
      js: "// Author: Kürşat KORKMAZ - ADY",
    },
    allowOverwrite: true,
  });
}

build();
