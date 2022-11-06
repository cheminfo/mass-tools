import { parseCharge } from '../parseCharge';

test('parseCharge', () => {
  expect(parseCharge('---')).toBe(-3);
  expect(parseCharge('+++')).toBe(3);
  expect(parseCharge('---++')).toBe(-1);
  expect(parseCharge('(-3)')).toBe(-3);
  expect(parseCharge('(+1)')).toBe(1);
  expect(parseCharge('(---)')).toBe(-3);
  expect(parseCharge('(++)')).toBe(2);
});
