import * as esbuild from "esbuild";

async function build() {
  await esbuild.build({
    entryPoints: ["TelemetryAS.ts"],
    platform: "node",
    format: "esm",
    outdir: "./dist",
    //    sourceRoot: "./src",
    bundle: true,
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
