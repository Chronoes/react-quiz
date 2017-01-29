const webpack = require('webpack');
const devConfig = require('./webpack.config.dev');

module.exports = {
  ...devConfig,
  devtool: 'source-map',
  entry: {
    app: './src/scripts/main.jsx',
    vendor: devConfig.entry.vendor,
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
  ],
};
