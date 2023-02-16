const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
    components: './src/components/index.js',
    hooks: './src/hooks/index.js',
    utils: './src/utils/index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    clean: true,
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
  externals: {
    react: 'react',
    React: 'react',
    process: 'process',
    '@web3-react/injected-connector': '@web3-react/injected-connector',
    '@web3-react/walletconnect-connector':
      '@web3-react/walletconnect-connector',
    '@web3-react/core': '@web3-react/core',
    buffer: 'buffer',
    Buffer: 'buffer',
  },
  target: 'web',
  plugins: [],
};
