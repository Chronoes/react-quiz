import bcrypt from 'bcrypt-as-promised';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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

export function verifyAuthorization(authHeader, secret) {
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    return verifyToken(token, secret);
  }
  return Promise.reject(new Error('No Authorization header.'));
}

export function genChecksum(payload) {
  return crypto.createHash('sha1').update(JSON.stringify(payload)).digest('hex');
}

export function verifyChecksum(payload, hash) {
  return genChecksum(payload) === hash;
}

export function isInvalidDatabaseId(value) {
  return isNaN(value) || value <= 0;
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
    if (object[key] !== undefined) {
      carry[key] = object[key];
    }
    return carry;
  }, {});
}
