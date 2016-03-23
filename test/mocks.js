export class Request {
  constructor(query = {}) {
    this.query = query;
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
