'use strict';

module.exports = function get(key) {
    let currentNode = this.root;
    while (currentNode != null) {
        if (key < currentNode.key) {
            currentNode = currentNode.left;
        } else if (key > currentNode.key) {
            currentNode = currentNode.right;
        } else {
            return currentNode.value;
        }
    }
    return null;
};
