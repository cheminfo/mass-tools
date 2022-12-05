export function closestPointX(array, target) {
  let low = 0;
  let high = array.length - 1;
  let middle = 0;
  while (high - low > 1) {
    middle = low + ((high - low) >> 1);
    if (array[middle].x < target) {
      low = middle;
    } else if (array[middle].x > target) {
      high = middle;
    } else {
      return array[middle];
    }
  }

  if (low < array.length - 1) {
    if (Math.abs(target - array[low].x) < Math.abs(array[low + 1].x - target)) {
      return array[low];
    } else {
      return array[low + 1];
    }
  } else {
    return array[low];
  }
}
