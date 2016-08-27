require('babel-core/register');

/* eslint no-console: 0 */

process.title = 'quiz-server';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const application = require('./app');

const app = application.default;

const database = require('./server/database').default;

app.all('/*', application.staticFiles);

database.sync().then(() => {
  const server = app.listen(process.env.PORT || 1337,
    () => console.log(`Listening at http://localhost:${server.address().port}`));
})
.catch(console.error);
