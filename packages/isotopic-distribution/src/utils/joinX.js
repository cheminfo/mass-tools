/**
 * Join x values if there are similar
 */

export function joinX(self, threshold = Number.EPSILON) {
  // when we join we will use the center of mass
  if (self.array.length === 0) return [];
  self.sortX();
  let current = self.array[0];
  let result = [current];
  for (let i = 1; i < self.array.length; i++) {
    const item = self.array[i];
    if (item.x - current.x <= threshold) {
      // weighted sum
      current.x =
        (item.y / (current.y + item.y)) * (item.x - current.x) + current.x;
      current.y += item.y;
    } else {
      current = { ...item };
      result.push(current);
    }
  }
  self.array = result;
  self.ySorted = false;
  return self;
}
