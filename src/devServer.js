import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from '../webpack.config.dev';
import app, { staticFiles } from './app';
import { createSchema } from './server/database';

process.title = 'quiz-dev-server';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const compiler = webpack(config);

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

app.all('/*', staticFiles);

/* eslint-disable no-console */
function initServer() {
  const server = app.listen(process.env.PORT || 1337, err => {
    if (err) {
      throw err;
    }

    return console.log(`Listening at http://localhost:${server.address().port}`);
  });
}

if (process.env.NODE_ENV_OPTS === 'live-api') {
  createSchema()
  .then(initServer)
  .catch(console.error);
} else {
  initServer();
}
