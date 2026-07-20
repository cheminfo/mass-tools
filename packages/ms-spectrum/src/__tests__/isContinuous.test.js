import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';
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

  it('a step allowed at high mass but not at low mass', () => {
    // the same 0.33 Da step: a profile spectrum of a time of flight around
    // m/z 3000, points much too separated around m/z 100
    const highMass = { x: [], y: [] };
    const lowMass = { x: [], y: [] };
    for (let i = 0; i < 400; i++) {
      highMass.x.push(3000 + i * 0.33);
      highMass.y.push(i + 1);
      lowMass.x.push(100 + i * 0.33);
      lowMass.y.push(i + 1);
    }

    expect(isContinuous({ data: highMass })).toBe(true);
    expect(isContinuous({ data: lowMass })).toBe(false);
  });

  it('centroids one dalton apart are not continuous, whatever the mass', () => {
    const data = { x: [], y: [] };
    for (let i = 0; i < 150; i++) {
      data.x.push(3000 + i);
      data.y.push(100 + ((i * 37) % 90));
    }

    expect(isContinuous({ data })).toBe(false);
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
