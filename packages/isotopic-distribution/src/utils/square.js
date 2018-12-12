'use strict';

module.exports = function square(options = {}) {
  return this.multiply(this, options);
};
