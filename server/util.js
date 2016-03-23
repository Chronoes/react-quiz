import bcrypt from 'bcrypt-as-promised';
import jwt from 'jsonwebtoken';

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
