import bcrypt from 'bcrypt-as-promised';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Set, Map } from 'immutable';

export function genSaltyHash(password) {
  return bcrypt.hash(password, 10);
}

export function compareSaltyHash(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload, secret) {
  return jwt.sign(payload, secret, {
    expiresIn: 3600 * 24 * 7,
  });
}

export function verifyToken(token, secret) {
  return new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err, decoded) =>
      err ? reject(err) : resolve(decoded)));
}

export function verifyAuthorization(authHeader) {
  if (authHeader) {
    return Promise.resolve(authHeader.replace('Bearer ', ''));
  }
  return Promise.reject(new Error('No Authorization header.'));
}

export function genChecksum(payload) {
  return crypto.createHash('sha1').update(JSON.stringify(payload)).digest('hex');
}

export function verifyChecksum(payload, hash) {
  return genChecksum(payload) === hash;
}

export function isPositiveNumber(value) {
  return !isNaN(value) && value > 0;
}

export function parseIntBase10(nr) {
  return parseInt(nr, 10);
}

export function parseNumberDefault(value, end, start = 0) {
  const parsed = parseIntBase10(value);
  if (!isNaN(parsed)) {
    if (parsed > end) {
      return end;
    } else if (parsed < start) {
      return start;
    }
    return parsed;
  }
  return end;
}

export function partialPick(keys) {
  return (object) => keys.reduce((carry, key) => {
    if (Array.isArray(key)) {
      if (object[key[0]] !== undefined) {
        carry[key[1]] = object[key[0]];
      }
    } else if (object[key] !== undefined) {
      carry[key] = object[key];
    }
    return carry;
  }, {});
}

export function partialOmit(keys) {
  const keySet = new Set(keys);
  return (object) => partialPick(new Set(Object.keys(object)).subtract(keySet).toArray())(object);
}
