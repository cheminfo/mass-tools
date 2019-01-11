'use strict';

const isContinuous = require('../isContinuous');

describe('test isContinuous', () => {
  it('to small', () => {
    let data = { x: [] };
    for (let i = 0; i < 50; i++) {
      data.x.push(i / 20);
    }
    expect(isContinuous({ data })).toBe(false);
  });

  it('to separated', () => {
    let data = { x: [] };
    for (let i = 0; i < 200; i++) {
      data.x.push(i / 5);
    }
    expect(isContinuous({ data })).toBe(false);
  });

  it('bad points', () => {
    let data = { x: [] };
    for (let i = 0; i < 200; i++) {
      data.x.push(i / 20);
    }
    data.x.push(200);
    expect(isContinuous({ data })).toBe(false);
  });

  it('just ok', () => {
    let data = { x: [] };
    for (let i = 0; i < 200; i++) {
      data.x.push(i / 20);
    }
    expect(isContinuous({ data })).toBe(true);
  });
});
