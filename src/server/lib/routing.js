import { parseIntBase10, isPositiveNumber } from './general';

export function validateIdParam(name) {
  return [name, (req, res, next) => {
    const id = parseIntBase10(req.params[name]);
    if (!isPositiveNumber(id)) {
      return res.status(400).json({ message: `Invalid ID parameter: ${req.params[name]}` });
    }
    req.params[name] = id;
    return next();
  }];
}
