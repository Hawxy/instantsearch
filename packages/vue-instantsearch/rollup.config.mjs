import path from 'path';
import { fileURLToPath } from 'url';

import json from '@rollup/plugin-json';
import {
  createCommonjsPlugin,
  createPackageJsonPlugin,
  createReplacePlugin,
  createResolvePlugin,
  createStripJsxPragmaPlugin,
  createSwcPlugin,
  createTerserPlugin,
} from '../../scripts/build/rollup.plugins.mjs';
import { extensionResolver } from '../../scripts/build/rollup-plugin-extension-resolver.mjs';
import vuePlugin from 'rollup-plugin-vue';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));

const createFile = (fileName, content) => ({
  name: 'inject-package-json',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName,
      source: content,
    });
  },
});

const isWatching = process.env.ROLLUP_WATCH;

const external = id =>
  [
    'algoliasearch-helper',
    'instantsearch.js',
    'instantsearch-ui-components',
    'vue',
    'mitt',
    '@swc/helpers',
  ].some(dep => id === dep || id.startsWith(`${dep}/`));

const basePlugins = [
  vuePlugin({ compileTemplate: true, css: false }),
  createCommonjsPlugin(),
  createSwcPlugin({
    include: /\.[jt]sx?$|\.vue$/,
  }),
  createResolvePlugin({
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.vue'],
  }),
  json(),
  createReplacePlugin({ mode: 'production' }),
  createStripJsxPragmaPlugin(),
];

const cjs = {
  input: 'src/instantsearch.js',
  external,
  output: {
    sourcemap: false,
    file: 'dist/cjs/index.js',
    format: 'cjs',
    exports: 'named',
  },
  plugins: [
    ...basePlugins,
    createReplacePlugin({
      mode: 'production',
      additional: {
        'instantsearch.js/es': 'instantsearch.js/cjs',
      },
    }),
    createTerserPlugin({ sourceMap: false }),
    createPackageJsonPlugin({ type: 'commonjs', sideEffects: true }),
  ],
};

const esm = {
  input: 'src/instantsearch.js',
  external,
  output: {
    sourcemap: false,
    dir: 'dist/es',
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: packageRoot,
  },
  plugins: [
    ...basePlugins,
    extensionResolver({
      modulesToResolve: ['instantsearch.js'],
    }),
    createTerserPlugin({ sourceMap: false }),
    createFile(
      'index.js',
      `import InstantSearch from './src/instantsearch.js';
export default InstantSearch;
export * from './src/instantsearch.js';`
    ),
    createPackageJsonPlugin({ type: 'module', sideEffects: true }),
  ],
};

const umd = {
  input: 'src/instantsearch.umd.js',
  external: ['vue'],
  output: {
    sourcemap: false,
    file: 'dist/umd/index.js',
    format: 'umd',
    name: 'VueInstantSearch',
    exports: 'named',
    globals: {
      vue: 'Vue',
    },
  },
  onwarn(warning, warn) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      throw new Error(warning.message);
    }
    warn(warning);
  },
  plugins: [
    ...basePlugins,
    createResolvePlugin(),
    createTerserPlugin({ sourceMap: false }),
  ],
};

export default isWatching ? [esm] : [cjs, esm, umd];
