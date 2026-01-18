import terser from "@rollup/plugin-terser";

export default {
    input: "./packages/svgmap/src/index.js",
    output: {
        file: "packages/svgmap/dist/svgmapjs.esm.js",
        format: "esm"
    },
    plugins: [terser()]
};
