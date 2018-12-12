'use strict';

module.exports = function getLastEntry() {
  let currentNode = this.root;
  if (currentNode !== null) {
    while (currentNode.right !== null) {
      currentNode = currentNode.right;
    }
  }
  return currentNode;
};
