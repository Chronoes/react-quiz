import express from 'express';
import bodyParser from 'body-parser';
import {readFile} from 'fs';
import path from 'path';
import historyApiFallback from 'connect-history-api-fallback';
// import {join} from 'path';
// import glob from 'glob';

import conf from './server/conf';

import api from './server/api-router';

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

readFile(conf.secretPath, 'utf8', (err, secret) => {
  if (err || secret.trim() === '') {
    throw new Error(`Make sure you have secret at ${conf.secretPath}`);
  }
  app.set('secret', secret);
});

// const staticPath = join(__dirname, '/static/');
//
// glob('**/*', {cwd: staticPath, nodir: true}, (err, files) => {
//   if (err) {
//     throw err;
//   }
//
//   app.all('/*', (req, res) => {
//     const sanitizedPath = req.path.replace(/\/{2,}/, '/');
//     const staticFiles = files.filter(file => sanitizedPath.includes(file));
//     res.sendFile(staticFiles.length ? join(staticPath, staticFiles[0]) : staticPath);
//   });
// });

export const staticFiles = express.static(path.join(__dirname, 'static'));

export default app;
