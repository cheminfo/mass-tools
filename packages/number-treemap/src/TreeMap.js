'use strict';

const Node = require('./Node');


class TreeMap {
    constructor() {
        this.root = null;
        this.size = 0;
    }


}

TreeMap.prototype.get = require('./get.js');
TreeMap.prototype.set = require('./set.js');
TreeMap.prototype.getClosestEntry = require('./getClosestEntry.js');

module.exports = TreeMap;
