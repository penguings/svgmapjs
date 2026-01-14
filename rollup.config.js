import terser from "@rollup/plugin-terser";

export default {
    input: "./SVGMapLv0.1_Class_r18module.js",
    output: {
        file: "packages/svgmap/dist/svgmapjs.esm.js",
        format: "esm"
    },
    plugins: [terser()]
};
