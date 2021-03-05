import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";
import resolve from "@rollup/plugin-node-resolve";
import sourcemaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";

export default {
  input: pkg.main,
  output: {
    sourcemap: true,
    file: "dist/bundle.js",
    format: "iife",
  },
  plugins: [
    sourcemaps(),
    commonjs(),
    resolve(),
    typescript({ tsconfigDefaults: { sourceMap: true } }),
  ],
};
