import { Node } from './Node.js';

/** javascript TreeMap implementation */
export class TreeMap {
  get(key) {
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
  }

  getEntry(key) {
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
  }

  set(key, value) {
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
  }

  getLastEntry() {
    let currentNode = this.root;
    if (currentNode !== null) {
      while (currentNode.right !== null) {
        currentNode = currentNode.right;
      }
    }
    return currentNode;
  }

  getFirstEntry() {
    let currentNode = this.root;
    if (currentNode !== null) {
      while (currentNode.left !== null) {
        currentNode = currentNode.left;
      }
    }
    return currentNode;
  }

  getClosestEntry(key) {
    let currentNode = this.root;
    let bestMatch = currentNode;
    let bestDistance = Number.POSITIVE_INFINITY;
    while (currentNode != null) {
      let distance = Math.abs(currentNode.key - key);
      if (key < currentNode.key) {
        if (distance < bestDistance) {
          bestMatch = currentNode;
          bestDistance = distance;
        }
        currentNode = currentNode.left;
      } else if (key > currentNode.key) {
        if (distance < bestDistance) {
          bestMatch = currentNode;
          bestDistance = distance;
        }
        currentNode = currentNode.right;
      } else {
        return currentNode;
      }
    }
    return bestMatch;
  }
  root = null;
  size = 0;
}
