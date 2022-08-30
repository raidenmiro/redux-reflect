import { DEFAULT_EXTENSIONS } from '@babel/core';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import { swc } from 'rollup-plugin-swc3';
import pkg from './package.json';

const src = (file) => `src/${file}`;
const externalDeps = [
  ...Object.keys(pkg.devDependencies),
  ...Object.keys(pkg.peerDependencies),
  ...Object.keys(pkg.dependencies),
];

const bundle = (config) =>
  defineConfig({
    ...config,
    input: src('index.ts'),
    plugins: [...(config.plugins || [])],
    external: externalDeps,
  });

const babelPlugin = () =>
  babel({
    exclude: /node_modules.*/,
    babelHelpers: 'bundled',
    extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    presets: ['@babel/preset-typescript', '@babel/preset-react'],
  });

const dist = {
  cjs: (file) => `dist/cjs/${file}`,
  esm: (file) => `dist/esm/${file}`,
  base: (file) => `dist/${file}`,
};

const production = process.env.NODE_ENV === 'production';

// eslint-disable-next-line import/no-default-export
export default defineConfig([
  bundle({
    plugins: [resolve(), babelPlugin(), swc({ minify: production })],
    output: {
      file: dist.cjs('index.js'),
      format: 'cjs',
    },
  }),
  bundle({
    plugins: [resolve(), babelPlugin(), swc({ minify: production })],
    output: {
      file: dist.esm('index.js'),
      format: 'esm',
    },
  }),
  bundle({
    plugins: [resolve(), dts()],
    output: {
      file: dist.base('index.d.ts'),
    },
  }),
]);
