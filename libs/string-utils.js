import { isNil } from './object-utils.js';

export function isBlank(str) {
  return !!(isNil(str) || /^\s*$/.test(str));
}
