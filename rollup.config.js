import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json"
import path from "path";
import fs from "fs";

const production = !process.env.ROLLUP_WATCH;

export default fs
    .readdirSync(path.join(__dirname, "src", "webview"))
    .map((input) => {
        const name = input.split(".")[0];
        return {
            input: "src/webview/" + input,
            output: {
                sourcemap: true,
                format: "iife",
                format: 'cjs',
                name: "app",
                file: "out/compiled/" + name + ".js",

            },
            plugins: [

                svelte({
                    // enable run-time checks when not in production
                    dev: !production,
                    // we'll extract any component CSS out into
                    // a separate file - better for performance
                    css: (css) => {
                        css.write(name + ".css");
                    },
                    preprocess: sveltePreprocess(),
                    // issue and ans https://github.com/sveltejs/template/issues/193
                    emitCss: false,
                }),


                // If you have external dependencies installed from
                // npm, you'll most likely need these plugins. In
                // some cases you'll need additional configuration -
                // consult the documentation for details:
                // https://github.com/rollup/plugins/tree/master/packages/commonjs
                resolve({
                    browser: true,
                    dedupe: ["svelte"],
                }),
                commonjs(),
                json(),
                typescript({
                    tsconfig: "src/tsconfig.json",
                    sourceMap: !production,
                    inlineSources: !production,
                }),

                // In dev mode, call `npm run start` once
                // the bundle has been generated
                // !production && serve(),

                // Watch the `public` directory and refresh the
                // browser on changes when not in production
                // !production && livereload("public"),

                // If we're building for production (npm run build
                // instead of npm run dev), minify
                production && terser(),

            ],
            watch: {
                clearScreen: false,
            },
        };
    });