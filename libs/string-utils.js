const { isNil } = require('./object-utils');

function isBlank(str) {
  return !!(isNil(str) || /^\s*$/.test(str));
}

module.exports = {
  isBlank,
};
