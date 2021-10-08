'use strict';

const Distribution = require('../Distribution.js');

describe('test Distribution', () => {
  it('create array', () => {
    let array = new Distribution();
    array.push(1, 2);
    array.push(2, 3);
    expect(array).toHaveLength(2);
  });

  it('joinX array 0', () => {
    let array = new Distribution();
    array.joinX();
    expect(array.array).toStrictEqual([]);
  });

  it('joinX array 1', () => {
    let array = new Distribution();
    array.push(1, 1);
    array.joinX();
    expect(array.array).toStrictEqual([{ x: 1, y: 1 }]);
  });

  it('joinX array', () => {
    let array = new Distribution();
    array.push(0, 0);
    array.push(1, 1);
    array.joinX();
    expect(array.array).toStrictEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it('really joinX array', () => {
    let array = new Distribution();
    array.push(0, 0);
    array.push(1, 1);
    array.joinX(1);
    expect(array.array).toStrictEqual([{ x: 1, y: 1 }]);
  });

  it('really joinX array shifted', () => {
    let array = new Distribution();
    array.push(1, 0);
    array.push(2, 1);
    array.joinX(1);
    expect(array.array).toStrictEqual([{ x: 2, y: 1 }]);
  });

  it('really joinX array shifted weighted', () => {
    let array = new Distribution();
    array.push(1, 1);
    array.push(2, 3);
    array.joinX(1);
    expect(array.array).toStrictEqual([{ x: 1.75, y: 4 }]);
  });

  it('really joinX array shifted weighted 3', () => {
    let array = new Distribution();
    array.push(1, 1);
    array.push(2, 3);
    array.push(2.25, 1);
    array.joinX(1);
    expect(array.array).toStrictEqual([{ x: 1.85, y: 5 }]);
  });

  it('really joinX array shifted weighted 4', () => {
    let array = new Distribution();
    array.push(1, 1);
    array.push(2, 3);
    array.push(2.25, 1);
    array.push(5, 1);
    array.joinX(1);
    expect(array.array).toStrictEqual([
      { x: 1.85, y: 5 },
      { x: 5, y: 1 },
    ]);
  });
});
