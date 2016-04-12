require('babel-core/register');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

// Patch for extensible destructuring
require('extensible-polyfill').patch('safe');

const config = require('./webpack.config.dev').default;

process.title = 'quiz-dev-server';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const application = require('./app');
const app = application.default;

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

app.all('/*', application.staticFiles);

/* eslint no-console: 0 */
function initServer() {
  const server = app.listen(process.env.PORT || 1337, err => {
    if (err) {
      throw err;
    }

    return console.log(`Listening at http://localhost:${server.address().port}`);
  });
}

if (process.env.NODE_ENV_OPTS === 'live-api') {
  const database = require('./server/database').default;

  database.sync()
  .then(initServer)
  .catch(console.error);
} else {
  initServer();
}
