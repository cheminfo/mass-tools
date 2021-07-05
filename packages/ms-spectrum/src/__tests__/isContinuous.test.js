'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');

const { parseXY } = require('xy-parser');

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
    expect(isContinuous({ data })).toBe(true);
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

  it('big experimental data', () => {
    let text = readFileSync(join(__dirname, 'data/continuous.txt'), 'utf8');
    let data = parseXY(text);
    expect(isContinuous({ data })).toBe(true);
  });

  it('other big experimental data', () => {
    let text = readFileSync(join(__dirname, 'data/continuous2.txt'), 'utf8');
    let data = parseXY(text);
    expect(isContinuous({ data })).toBe(true);
  });

  it('low experimental data', () => {
    let text = readFileSync(join(__dirname, 'data/lowres.txt'), 'utf8');
    let data = parseXY(text);
    expect(isContinuous({ data })).toBe(true);
  });

  it('check joined spectrum', () => {
    let text = readFileSync(join(__dirname, 'data/joinedHPLC.txt'), 'utf8');
    let data = parseXY(text);
    expect(isContinuous({ data })).toBe(true);
  });
});
