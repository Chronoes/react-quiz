import {Transform} from 'stream';
import {Console} from 'console';
import {createWriteStream} from 'fs';
import moment from 'moment';

import conf from './conf';

class LogTransformer extends Transform {
  getLogSuffix() {
    return new Buffer(`[${moment.utc().format('YYYY/MM/DD HH:mm:ss')} UTC] `);
  }

  _transform(chunk, encoding, callback) {
    this.push(this.getLogSuffix());
    this.push(chunk);
    callback();
  }
}

class LogConsole extends Console {
  error(...args) {
    return `ERROR: ${super.error(...args)}`;
  }

  warn(...args) {
    return `WARNING: ${super.warn(...args)}`;
  }
}

const log = new LogTransformer();
const errorLog = new LogTransformer();

if (process.env.NODE_ENV !== 'testing') {
  log.pipe(createWriteStream(conf.get('logOutput'), {flags: 'a'}));
  errorLog.pipe(createWriteStream(conf.get('errorLogOutput'), {flags: 'a'}));
}

export default new LogConsole(log, errorLog);
