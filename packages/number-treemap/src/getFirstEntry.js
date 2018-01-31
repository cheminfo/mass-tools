'use strict';

module.exports = function getFirstEntry() {
    let currentNode = this.root;
    if (currentNode !== null) {
        while (currentNode.left !== null) {
            currentNode = currentNode.left;
        }
    }
    return currentNode;
};
