'use strict';

module.exports = function Node(key = null, value = null) {
    this.key = key;
    this.value = value;
    this.left = null;
    this.right = null;
};

