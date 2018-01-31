'use strict';

class Node {
    constructor(key = null, value = null) {
        this.key = key;
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

module.exports = Node;
