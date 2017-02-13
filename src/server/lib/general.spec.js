import jwt from 'jsonwebtoken';
import * as util from './general';

describe('#verifyToken()', () => {
  it('should return payload with correct token', () => {
    const secret = 'shhhhh';
    const token = jwt.sign({ id: 1, username: 'ayylmao' }, secret);

    return util.verifyToken(token, secret)
    .then((payload) => {
      expect(payload.id).toBe(1);
      expect(payload.username).toBe('ayylmao');
    });
  });

  it('should reject with error on incorrect token', (done) => {
    const token = jwt.sign({ id: 1, username: 'ayylmao' }, 'customSecret');

    return util.verifyToken(token, 'shhhhh')
    .then(() => done(new Error('Verification should not resolve')))
    .catch((err) => {
      expect(err).toBeInstanceOf(Error);
      done();
    });
  });
});

describe('#verifyAuthorization()', () => {
  it('should return with token if Authorization header exists', () => {
    const secret = 'shhhhh';
    const token = jwt.sign({ id: 1, username: 'ayylmao' }, secret);
    const authHeader = `Bearer ${token}`;

    return util.verifyAuthorization(authHeader)
    .then((receivedToken) => {
      expect(receivedToken).toBe(token);
    });
  });

  it('should reject with error on missing header', (done) => {
    util.verifyAuthorization('')
    .then(() => done(new Error('Verification should not resolve')))
    .catch((err) => {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('No Authorization header.');
      done();
    });
  });
});

describe('#genChecksum()', () => {
  it('should return a SHA-1 hash of given payload', () => {
    expect(util.genChecksum({ id: 30, name: 'not my name' })).toBe('96c25ed3edb27be12e2d4852194b7e6ca463e639');
    expect(util.genChecksum({
      value: 23023, index: 3, name: '',
    })).toBe('17b2809b18200c1ebf4b9f5cd49f53cdbee3067e');
  });
});

describe('#verifyChecksum()', () => {
  it('should verify given payload against given hash', () => {
    expect(util.verifyChecksum({ id: 30, name: 'not name' }, '02cae401802f199f6881ec800fac0e978be527d2')).toBeTruthy();
    expect(util.verifyChecksum({ id: 31, name: 'not name' }, '02cae401802f199f6881ec800fac0e978be527d2')).toBeFalsy();
  });
});

describe('#parseNumberDefault()', () => {
  it('should return a number within given range if value is a number', () => {
    expect(util.parseNumberDefault(13, 30)).toBe(13);
    expect(util.parseNumberDefault(18, 12)).toBe(12);
    expect(util.parseNumberDefault(-5, 121)).toBe(0);
    expect(util.parseNumberDefault(-11, 10, -1)).toBe(-1);
  });

  it('should return the end of the range if value is not a number', () => {
    expect(util.parseNumberDefault('eew', 30)).toBe(30);
    expect(util.parseNumberDefault(undefined, 10, 1)).toBe(10);
  });
});

describe('#partialPick()', () => {
  it('should return a function that creates a new object based on given prop names', () => {
    const keys = ['some', 'stuff'];
    const boundPartialPick = util.partialPick(keys);

    expect(boundPartialPick).toEqual(expect.any(Function));
    expect(boundPartialPick({})).toEqual({});
    expect(boundPartialPick(
      { some: '142', things: 13.9, to: [2, 3, 5, 7], be: {}, stuff: true }
    )).toEqual(
      { some: '142', stuff: true }
    );

    expect(util.partialPick([['change', 'take'], ['keys', 'cupcakes'], 'not'])(
      { change: 'these', keys: 'please', not: 'this', ignore: true }
    )).toEqual(
      { take: 'these', cupcakes: 'please', not: 'this' }
    );
  });
});

describe('#partialOmit()', () => {
  it('should return a function that creates a new object, omitting given prop names', () => {
    const keys = ['some', 'stuff'];
    const boundPartialOmit = util.partialOmit(keys);

    expect(boundPartialOmit).toEqual(expect.any(Function));
    expect(boundPartialOmit({})).toEqual({});
    expect(boundPartialOmit(
      { some: '142', things: 13.9, to: [2, 3, 5, 7], be: {}, stuff: true }
    )).toEqual(
      { things: 13.9, to: [2, 3, 5, 7], be: {} }
    );
  });
});
