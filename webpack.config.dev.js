const { join } = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: '#cheap-module-eval-source-map',
  cache: true,
  entry: {
    app: [
      'webpack-hot-middleware/client?path=/__webpack_hmr',
      'babel-polyfill',
      './src/scripts/main.jsx',
    ],
    vendor: [
      'axios',
      'history',
      'immutable',
      'moment',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
      'redux-thunk',
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  output: {
    path: join(__dirname, 'static'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        NODE_ENV_OPTS: JSON.stringify(process.env.NODE_ENV_OPTS || ''),
      },
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: join(__dirname, 'src', 'scripts'),
        exclude: 'node_modules',
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=10000&minetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file',
      },
    ],
  },
};

// exports.default = exports;
