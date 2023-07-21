import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
// @ts-ignore
import { terser } from 'rollup-plugin-minification';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const pkg = require('./package.json');
const format = 'esm';
const entry = 'src/browser.ts';

export default [
  {
    input: entry,
    output: {
      file: `dist/${pkg.name}.${format}.js`,
      format, sourcemap: true
    },
    plugins: [
      commonjs({ ignoreTryCatch: false, include: 'node_modules/**' }),
      typescript({ compilerOptions: { module: 'CommonJS'} }),
      json(),
      nodeResolve({ preferBuiltins: true }),
      terser()
    ]
  }
];