const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: "production",
  entry: {
    index: './src/index.js',
    components: './src/components/index.js',
    hooks: './src/hooks/index.js',
    utils: './src/utils/index.js'
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: '[name].js',
    libraryTarget: "commonjs2"
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      {
        test: /\.svg$/,
        loader: "file-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true
        }
      })
    ]
  },
  externals: {
    react: "react",
    process: "process",
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
};
