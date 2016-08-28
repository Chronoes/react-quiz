import webpack from 'webpack';
import devConfig from './webpack.config.dev';

export default {
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
