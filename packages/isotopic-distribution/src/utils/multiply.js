'use strict';

module.exports = function multiply(b, options = {}) {
  const { minY = 1e-8, maxLines = 5000, deltaX = 1e-2 } = options;
  const result = new this.constructor();

  this.sortY();
  b.sortY();

  for (let entryA of this.array) {
    for (let entryB of b.array) {
      let y = entryA.y * entryB.y;
      if (y > minY) {
        const composition = calculateComposition(entryA, entryB);
        if (composition) {
          result.push({ x: entryA.x + entryB.x, y, composition });
        } else {
          result.push({ x: entryA.x + entryB.x, y });
        }
      }
      if (result.length > maxLines) {
        result.joinX(deltaX);
        result.topY(maxLines / 2);
      }
    }
  }
  result.joinX(deltaX);
  result.topY(maxLines / 2);
  this.move(result);
  return this;
};

function calculateComposition(entryA, entryB) {
  if (!entryA.composition || !entryB.composition) return;
  console.log(entryA, entryB);
}
