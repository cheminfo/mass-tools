export function multiply(a, b, options = {}) {
  const { minY = 1e-8, maxLines = 5000, deltaX = 1e-2 } = options;
  const result = new a.constructor();

  a.sortY();
  b.sortY();

  for (let entryA of a.array) {
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
      if (result.length > maxLines * 2) {
        result.joinX(deltaX);
        result.topY(maxLines);
      }
    }
  }
  result.joinX(deltaX);
  result.topY(maxLines);
  a.move(result);
  return a;
}

function calculateComposition(entryA, entryB) {
  if (!entryA.composition || !entryB.composition) return;
  let toReturn = {};
  const keys = [
    ...new Set(
      Object.keys(entryA.composition).concat(Object.keys(entryB.composition)),
    ),
  ];
  for (let key of keys) {
    toReturn[key] =
      (entryA.composition[key] || 0) + (entryB.composition[key] || 0);
  }
  return toReturn;
}
