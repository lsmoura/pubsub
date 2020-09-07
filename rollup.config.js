import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import babel from '@rollup/plugin-babel';

module.exports = {
  input: 'src/index.js',
  output: {
    dir: 'lib',
    format: 'umd',
    sourcemap: true,
    indent: false,
    name: 'pubsub',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    resolve(),
    commonjs(),
    process.env.NODE_ENV === 'production' ? uglify() : null,
  ],
};
