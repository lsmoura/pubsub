import resolve from '@rollup/plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import babel from '@rollup/plugin-babel';

module.exports = {
  input: 'src/index.ts',
  output: [
    { file: 'lib/index.js', format: 'es', sourcemap: true },
    { file: 'lib/index.cjs.js', format: 'cjs', sourcemap: true },
  ],
  plugins: [
    resolve({
      jsnext: true,
      extensions: ['.js', '.ts'],
    }),
    process.env.NODE_ENV === 'production' ? uglify() : null,
    babel({
      exclude: 'node_modules/**',
      extensions: ['.js', '.ts'],
    }),
  ],
};
