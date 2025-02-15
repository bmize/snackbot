const objectUtils = require('./object-utils');

function isBlank(str) {
  return !!(objectUtils.isNil(str) || /^\s*$/.test(str));
}

module.exports = {
  isBlank,
};
