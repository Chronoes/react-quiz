export default (process.env.NODE_ENV === 'production' ? require('./production/approot.prod') : require('./development/approot.dev')).default;
