'use strict';

const isContinuous = require('../isContinuous');

describe('test isContinuous', () => {
  it('to small', () => {
    let data = { x: [], y: [] };
    for (let i = 0; i < 50; i++) {
      data.x.push(i / 20);
      data.y.push(i + 1);
    }
    expect(isContinuous({ data })).toBe(false);
  });

  it('to separated', () => {
    let data = { x: [], y: [] };
    for (let i = 0; i < 200; i++) {
      data.x.push(i / 5);
      data.y.push(i + 1);
    }
    expect(isContinuous({ data })).toBe(false);
  });

  it('bad points', () => {
    let data = { x: [], y: [] };
    for (let i = 0; i < 200; i++) {
      data.x.push(i / 20);
      data.y.push(i + 1);
    }
    data.x.push(200);
    expect(isContinuous({ data })).toBe(false);
  });

  it('just ok', () => {
    let data = { x: [], y: [] };
    for (let i = 0; i < 200; i++) {
      data.x.push(i / 20);
      data.y.push(i + 1);
    }
    expect(isContinuous({ data })).toBe(true);
  });

  it('ok because < = 0', () => {
    let data = { x: [], y: [] };
    for (let i = 0; i < 200; i++) {
      data.x.push(i / 20);
      data.y.push(i / 20);
    }
    data.x.push(200);
    data.y.push(0);
    expect(isContinuous({ data })).toBe(true);
  });
});
