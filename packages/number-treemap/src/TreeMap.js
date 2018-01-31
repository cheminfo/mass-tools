'use strict';

const Node = require('./Node');


class TreeMap {
    constructor() {
        this.root = null;
        this.size = 0;
    }

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
        let node = new Node(key, value);
        if (key < parent.key) {
            parent.left = node;
        } else {
            parent.right = node;
        }
        this.size++;
    }
}


module.exports = TreeMap;
