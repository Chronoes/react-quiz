module.exports = (
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV_OPTS === 'live-api' ?
  require('./production/apiService.prod') :
  require('./development/apiService.dev')
);
