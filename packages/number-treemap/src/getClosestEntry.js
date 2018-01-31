'use strict';

module.exports = function getClosestEntry(key) {
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
;