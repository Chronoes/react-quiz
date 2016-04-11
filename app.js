import bodyParser from 'body-parser';
import historyApiFallback from 'connect-history-api-fallback';
import express from 'express';
import { readFile } from 'fs';
import path from 'path';
import api from './server/api-router';
import conf from './server/conf';
const app = express();

app.use(bodyParser.json());

app.use('/api', api);

app.use(historyApiFallback({
  verbose: false,
  rewrites: [
    {
      from: /\.(ttf|eot|svg|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?|\.hot-update\.js(on)?$/,
      to: context => `/${path.basename(context.parsedUrl.pathname)}`,
    },
  ],
}));

readFile(conf.get('secretPath'), 'utf8', (err, secret) => {
  if (err || secret.trim() === '') {
    throw new Error(`Make sure you have secret at ${conf.get('secretPath')}`);
  }
  app.set('secret', secret);
});

export const staticFiles = express.static(path.join(__dirname, 'static'));

export default app;
