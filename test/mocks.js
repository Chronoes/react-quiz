export class Request {
  constructor(query = {}) {
    this.query = query;
    this.body = {};
  }

  setBody(body) {
    this.body = body;
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

  json(object) {
    this.sentBody = object;
    return this;
  }
}
