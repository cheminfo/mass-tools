import { readFileSync } from 'node:fs';
import path from 'node:path';

import { parseXY } from 'xy-parser';

import { isContinuous } from '../isContinuous';

describe('test isContinuous', () => {
  it('to small', () => {
    const data = { x: [], y: [] };
    for (let i = 0; i < 50; i++) {
      data.x.push(i / 20);
      data.y.push(i + 1);
    }
    expect(isContinuous({ data })).toBe(false);
  });

  it('to separated', () => {
    const data = { x: [], y: [] };
    for (let i = 0; i < 200; i++) {
      data.x.push(i / 5);
      data.y.push(i + 1);
    }
    expect(isContinuous({ data })).toBe(false);
  });

  it('bad points', () => {
    const data = { x: [], y: [] };
    for (let i = 0; i < 200; i++) {
      data.x.push(i / 20);
      data.y.push(i + 1);
    }
    data.x.push(200);
    expect(isContinuous({ data })).toBe(true);
  });

  it('just ok', () => {
    const data = { x: [], y: [] };
    for (let i = 0; i < 200; i++) {
      data.x.push(i / 20);
      data.y.push(i + 1);
    }
    expect(isContinuous({ data })).toBe(true);
  });

  it('ok because < = 0', () => {
    const data = { x: [], y: [] };
    for (let i = 0; i < 200; i++) {
      data.x.push(i / 20);
      data.y.push(i / 20);
    }
    data.x.push(200);
    data.y.push(0);
    expect(isContinuous({ data })).toBe(true);
  });

  it('big experimental data', () => {
    const text = readFileSync(
      path.join(__dirname, 'data/continuous.txt'),
      'utf8',
    );
    const data = parseXY(text);
    expect(isContinuous({ data })).toBe(true);
  });

  it('other big experimental data', () => {
    const text = readFileSync(
      path.join(__dirname, 'data/continuous2.txt'),
      'utf8',
    );
    const data = parseXY(text);
    expect(isContinuous({ data })).toBe(true);
  });

  it('low experimental data', () => {
    const text = readFileSync(path.join(__dirname, 'data/lowres.txt'), 'utf8');
    const data = parseXY(text);
    expect(isContinuous({ data })).toBe(true);
  });

  it('check joined spectrum', () => {
    const text = readFileSync(
      path.join(__dirname, 'data/joinedHPLC.txt'),
      'utf8',
    );
    const data = parseXY(text);
    expect(isContinuous({ data })).toBe(true);
  });
});
