const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: path.resolve(__dirname, 'index.ts'),
  output: {
    path: path.join(__dirname, '../docs'),
    filename: 'bundle.js?[fullhash]',
    clean: true, // Clean the output directory before emit.
  },
  optimization: {
    moduleIds: 'named',
    minimize: false,
    emitOnErrors: false,
  },
  module: {
    rules: [
      // Process J/TS with Babel
      {
        test: /\.[jt]s(x?)$/,
        exclude: /(node_modules|coverage|lib)/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      // CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new ESLintPlugin({
      eslintPath: require.resolve('eslint'),
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: '../docs/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts'],
  },
  // https://webpack.js.org/configuration/dev-server/#root
  devServer: {
    static: {
      directory: path.resolve(__dirname, '../docs'),
    },
    allowedHosts: 'auto',
    hot: true,
    host: '0.0.0.0',
    port: 8000,
  },
};
