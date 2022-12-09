import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import svgr from '@svgr/rollup';
import sass from 'sass';
import postcss from 'rollup-plugin-postcss';

import pkg from './package.json' assert { type: 'json' };

const INPUT_FILE_PATH = 'src/index.js';
const OUTPUT_NAME = 'airdao-components-and-tools';

const GLOBALS = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
  ethers: 'ethers',
  buffer: 'buffer',
  process: 'process',
};

const PLUGINS = [
  postcss({
    preprocessor: (content, id) =>
      new Promise((resolve, reject) => {
        const result = sass.renderSync({ file: id });
        resolve({ code: result.css.toString() });
      }),
    extensions: ['.sass', '.css'],
  }),
  svgr(),
  babel({
    babelHelpers: 'runtime',
    exclude: 'node_modules/**',
  }),
  resolve({
    browser: true,
    resolveOnly: [/^(?!react$)/, /^(?!react-dom$)/, /^(?!prop-types)/],
  }),
  commonjs(),
  filesize(),
];

const EXTERNAL = [
  'react',
  'react-dom',
  'prop-types',
  '@prismicio/react',
  '@prismicio/client',
  '@web3-react/injected-connector',
  '@web3-react/walletconnect-connector',
  'ethers',
  '@web3-react/core',
  'buffer',
  'process',
];

// https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
const CJS_AND_ES_EXTERNALS = EXTERNAL.concat(/@babel\/runtime/);

const OUTPUT_DATA = [
  {
    file: pkg.browser,
    format: 'umd',
  },
  {
    file: pkg.main,
    format: 'cjs',
  },
  {
    file: pkg.module,
    format: 'es',
  },
];

const config = OUTPUT_DATA.map(({ file, format }) => ({
  input: INPUT_FILE_PATH,
  output: {
    file,
    format,
    name: OUTPUT_NAME,
    globals: GLOBALS,
  },
  external: ['cjs', 'es'].includes(format) ? CJS_AND_ES_EXTERNALS : EXTERNAL,
  plugins: PLUGINS,
}));

export default config;
