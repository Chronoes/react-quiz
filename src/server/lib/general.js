import bcrypt from 'bcrypt-as-promised';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Set, Map, Seq, List } from 'immutable';

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
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
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

/**
 * Parses a number and assgins default if not a number.
 * If start is provided, the number will be validated within start <= value <= end
 */
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

/**
 * Partial function for picking keys from a provided object, creating a new object from selected keys.
 * Keys can be renamed if the keys array contains a 2-element array per key => ['originalKey', 'renamedKey']
 */
export function partialPick(keys) {
  return (object) => keys.reduce((newObject, key) => {
    if (Array.isArray(key)) {
      const [originalKey, renamedKey] = key;
      if (object[originalKey] !== undefined) {
        newObject[renamedKey] = object[originalKey];
      }
    } else if (object[key] !== undefined) {
      newObject[key] = object[key];
    }
    return newObject;
  }, {});
}

/**
 * Partial function to omit keys from object. Internally uses partialPick() but renaming makes no sense here.
 */
export function partialOmit(keys) {
  const keySet = new Set(keys);
  return (object) => partialPick(new Set(Object.keys(object)).subtract(keySet).toArray())(object);
}

/**
 * Remap an object with compound keys (contain an underscore '_')
 * such as { mainKey_secondaryKey: value } to { mainKey: { secondaryKey: value } }.
 * Simple keys are not changed.
 */
export function remapToCompoundObject(object) {
  return new Map(object)
  .reduce((newObject, value, key) => {
    const [mainKey, secondaryKey] = key.split('_', 2);
    if (secondaryKey) {
      return newObject.update(mainKey, new Map(), (compound) => compound.set(secondaryKey, value));
    }
    return newObject.set(key, value);
  }, new Map());
}


/**
 * Group all list elements (objects) by given groupingKey into a new Map,
 * where nested objects with same key are internally grouped into Lists.
 */
export function groupAssociations(list, groupingKey) {
  return new Seq(list)
  .map((value) => new Seq(value))
  .groupBy((value) => value.get(groupingKey))
  .map((group) => group.rest().reduce((newMap, next) =>
      newMap.map((value, key) => List.isList(value) ? value.push(new Map(next.get(key))) : value
    ),
    group.first().map((value) =>
      Map.isMap(value) || typeof value === 'object' ? List.of(new Map(value)) : value)
  ));
}
