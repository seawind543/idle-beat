const path = require('path');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const pkg = require('./package.json');

const publicName = pkg.name; // package name
const banner = [
  `${publicName} v${pkg.version}`,
  `(c) 2023 Mark Lin.`,
  pkg.license,
  pkg.homepage,
].join(' | ');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'index.js',
    clean: true, // Clean the output directory before emit.
    // Set mount to `this` for SSR https://webpack.js.org/configuration/output/#outputglobalobject
    globalObject: 'this',
    library: {
      name: {
        root: 'IdleBeat',
        commonjs: 'idle-beat',
        amd: 'idle-beat',
      },
      type: 'umd',
    },
  },
  module: {
    rules: [
      // Process ts with Babel
      {
        test: /\.ts$/,
        exclude: /(node_modules|coverage|lib)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        // For our normal typescript
        test: /\.ts$/,
        exclude: /(node_modules|coverage|lib)/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // This has effect on the react lib size
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new ESLintPlugin({
      eslintPath: require.resolve('eslint'),
      exclude: ['node_modules', 'coverage', 'lib'],
      emitWarning: true,
      cache: false,
    }),
    new webpack.BannerPlugin(banner),
  ],
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.js', '.ts'],
  },
};
