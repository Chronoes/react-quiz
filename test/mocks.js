export class Request {
  constructor(query = {}, params = {}) {
    this.query = query;
    this.params = params;
    this.body = {};
    this.path = '/';
  }

  setBody(body) {
    this.body = body;
    return this;
  }

  setPath(path) {
    this.path = path;
    return this;
  }
}

export class Response {
  constructor() {
    this.sentBody = {};
    this.statusCode = 200;
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  _convertToJSON(object) {
    if (Array.isArray(object)) {
      return object.map(this._convertToJSON);
    }
    return typeof object.toJSON === 'function' ? object.toJSON() : object;
  }

  json(object) {
    this.sentBody = this._convertToJSON(object);
    return this;
  }
}
