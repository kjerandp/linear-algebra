import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

const input = {
  index: 'src/index.js',
  functions: 'src/functions.js',
  vector: 'src/vector.js',
  matrix: 'src/matrix.js',
};

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'linearAlgebra',
      sourcemap: true,
      esModule: false,
    },
    plugins: [
      babel({
        exclude: ['node_modules/**'],
      }),
      uglify({
        mangle: false,
      }),
    ],
  },
  // CommonJS
  {
    input,
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      esModule: false,
    },
    plugins: [
      babel({
        exclude: ['node_modules/**'],
      }),
    ],
  },
  // ES module
  {
    input,
    output: {
      dir: 'dist/esm',
      format: 'esm',
    },
  },
];
