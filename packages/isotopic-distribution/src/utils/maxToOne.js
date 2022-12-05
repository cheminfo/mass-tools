/**
 * Sum of Y to 1
 */

export function maxToOne() {
  if (this.array.length === 0) return this;
  let currentMax = this.array[0].y;
  for (let item of this.array) {
    if (item.y > currentMax) currentMax = item.y;
  }
  for (let item of this.array) {
    item.y /= currentMax;
  }
  return this;
}
