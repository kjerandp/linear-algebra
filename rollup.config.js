import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'parsers',
      sourcemap: true,
    },
    plugins: [
      babel({
        exclude: ['node_modules/**'],
      }),
      resolve(),
      commonjs(),
      uglify({
        mangle: false,
      }),
    ],
  },
  // CommonJS
  {
    input: 'src/index.js',
    output: { file: pkg.main, format: 'cjs', name: 'parsers', sourcemap: true },
    plugins: [
      babel({
        exclude: ['node_modules/**'],
      }),
      resolve(),
      commonjs(),
    ],
  },
  // ES module (main)
  {
    input: 'src/index.js',
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  },
];
