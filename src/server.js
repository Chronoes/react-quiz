import app, { staticFiles } from './app';
import { createSchema } from './server/database';

process.title = 'quiz-server';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

app.all('/*', staticFiles);

/* eslint-disable no-console */
createSchema().then(() => {
  const server = app.listen(process.env.PORT || 1337,
    () => console.log(`Listening at http://localhost:${server.address().port}`));
})
.catch(console.error);
