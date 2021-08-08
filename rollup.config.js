import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const NAME = require("./package.json").main.replace(/\.js$/, "");
const IS_PROD = process.env.NODE_ENV === "production";

export default [
  {
    input: "src/index.ts",
    external: (id) => !/^[./]/.test(id),
    plugins: [esbuild({ minify: IS_PROD })],
    output: [
      {
        file: `${NAME}.js`,
        format: "cjs",
        sourcemap: true,
        exports: "default",
      },
      {
        file: `${NAME}.mjs`,
        format: "es",
        sourcemap: true,
        exports: "default",
      },
    ],
  },
  {
    input: "src/index.ts",
    external: (id) => !/^[./]/.test(id),
    plugins: [dts()],
    output: {
      file: `${NAME}.d.ts`,
      format: "es",
      exports: "default",
    },
  },
];
