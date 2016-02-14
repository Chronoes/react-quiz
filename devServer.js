require('babel-core/register');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const historyApiFallback = require('connect-history-api-fallback');

const config = require('./webpack.config.dev').default;

const app = express();
const compiler = webpack(config);

const address = process.env.address || 'localhost';
const port = process.env.port || 1337;

app.use(historyApiFallback({
  verbose: false,
  rewrites: [
    {
      from: /\.(ttf|eot|svg|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?|\.hot-update\.js(on)?$/,
      to: context => `/${path.basename(context.parsedUrl.pathname)}`,
    },
  ],
}));

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  hot: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
  },
}));

app.use(webpackHotMiddleware(compiler));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const index = path.join(__dirname, 'static', 'index.html');

app.all('/*', (_, res) => res.sendFile(index));

/* eslint no-console: 0 */
app.listen(port, err => {
  if (err) {
    return console.log(err);
  }

  console.log(`Listening at http://${address}:${port}`);
});
