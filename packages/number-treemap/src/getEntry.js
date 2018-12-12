'use strict';

module.exports = function getEntry(key) {
  let currentNode = this.root;
  while (currentNode != null) {
    if (key < currentNode.key) {
      currentNode = currentNode.left;
    } else if (key > currentNode.key) {
      currentNode = currentNode.right;
    } else {
      return currentNode;
    }
  }
  return null;
};
