'use strict';

const Node = require('./Node.js');

module.exports = function set(key, value) {
  if (this.root === null) {
    this.root = new Node(key, value);
    this.size = 1;
    return;
  }
  let currentNode = this.root;
  let parent;
  do {
    parent = currentNode;
    if (key < currentNode.key) {
      currentNode = currentNode.left;
    } else if (key > currentNode.key) {
      currentNode = currentNode.right;
    } else {
      currentNode.value = value;
      return;
    }
  } while (currentNode !== null);
  let node = new Node(key, value, parent);
  if (key < parent.key) {
    parent.left = node;
  } else {
    parent.right = node;
  }
  this.size++;
};
