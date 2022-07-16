//rollup默认导出一个对象，作为打包对象
import babel from "rollup-plugin-babel"
import resolve from "@rollup/plugin-node-resolve"
export default {
    input: "./src/index.js",
    output: {
        file: "./dist/vue.js",
        name: "Vue",
        format: "umd", // esm / commonjs / iife / umd
        sourcemap: true
    },
    plugins: [
        babel({
            exclude: "node_modules/**"
        }),
        resolve()
    ]
}