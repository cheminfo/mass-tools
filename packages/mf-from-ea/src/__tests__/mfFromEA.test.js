import { toMatchCloseTo } from 'jest-matcher-deep-close-to';
import { describe, expect, it } from 'vitest';

import { mfFromEA } from '..';

expect.extend({ toMatchCloseTo });

describe('test mf-from-ea', () => {
  it('basic case', () => {
    let result = mfFromEA(
      { C: 0.8, H: 0.2 },
      {
        ranges: [
          { mf: 'C', min: 0, max: 1 },
          { mf: 'H', min: 0, max: 2 },
        ],
        maxElementError: 1,
        maxTotalError: 10,
      },
    );

    expect(result.mfs).toHaveLength(5);

    expect(result.mfs[2]).toMatchCloseTo({
      mf: 'C',
      totalError: 0.4,
      ea: [
        { mf: 'C', value: 1, expected: 0.8, error: 0.2 },
        { mf: 'H', value: 0, expected: 0.2, error: 0.2 },
      ],
    });
  });

  it('real case with sum not 100%', () => {
    let result = mfFromEA(
      { C: 0.8, H: 0.1 },
      {
        ranges: [
          { mf: 'C', min: 0, max: 100 },
          { mf: 'H', min: 0, max: 200 },
          { mf: 'O', min: 0, max: 100 },
        ],
        maxElementError: 0.001,
        maxTotalError: 0.002,
      },
    );

    expect(result.mfs).toHaveLength(23);
  });

  it('check optimization', () => {
    let result = mfFromEA(
      { C: 0.923, H: 0.077 },
      {
        ranges: [
          { mf: 'C', min: 0, max: 1 },
          { mf: 'H', min: 0, max: 1 },
          { mf: 'O', min: 0, max: 1 },
        ],
        maxElementError: 0.01,
        maxTotalError: 0.01,
      },
    );

    expect(result.info.numberMFEvaluated).toBe(6);
  });

  it('basic case with mf', () => {
    let result = mfFromEA(
      { C: 0.8, H: 0.2 },
      {
        ranges: 'C0-1 H0-2',
        maxElementError: 1,
        maxTotalError: 10,
      },
    );

    expect(result.mfs).toHaveLength(5);
    expect(result.mfs[2]).toMatchCloseTo({
      mf: 'C',
      totalError: 0.4,
      ea: [
        { mf: 'C', value: 1, expected: 0.8, error: 0.2 },
        { mf: 'H', value: 0, expected: 0.2, error: 0.2 },
      ],
    });
  });

  it('filter mw', () => {
    let result = mfFromEA(
      { C: 0.8, H: 0.2 },
      {
        ranges: [
          { mf: 'C', min: 0, max: 1 },
          { mf: 'H', min: 0, max: 2 },
        ],
        maxElementError: 1,
        maxTotalError: 10,
        minMW: 11.5,
        maxMW: 12.5,
      },
    );

    expect(result.mfs).toHaveLength(1);
  });

  it('check maxIterations', () => {
    expect(() => {
      mfFromEA(
        { C: 0.8, H: 0.2 },
        {
          maxIterations: 2,
        },
      );
    }).toThrow('Iteration number is over the current maximum of: 2');
  });

  it('filter maxTotalError', () => {
    let result = mfFromEA(
      { C: 0.8, H: 0.2 },
      {
        ranges: [
          { mf: 'C', min: 0, max: 1 },
          { mf: 'H', min: 0, max: 2 },
        ],
        maxElementError: 1,
        maxTotalError: 1,
      },
    );

    expect(result.mfs).toHaveLength(3);
  });

  it('filter elementError', () => {
    let result = mfFromEA(
      { C: 0.8, H: 0.2 },
      {
        ranges: [
          { mf: 'C', min: 0, max: 1 },
          { mf: 'H', min: 0, max: 2 },
        ],
        maxElementError: 0.1,
        maxTotalError: 10,
      },
    );

    expect(result.mfs).toHaveLength(1);
  });

  it('big problem', () => {
    let result = mfFromEA(
      { C: 0.8, H: 0.2 },
      {
        ranges: [
          { mf: 'C', min: 0, max: 100 },
          { mf: 'H', min: 0, max: 100 },
          { mf: 'O', min: 0, max: 10 },
          { mf: 'N', min: 0, max: 10 },
        ],
        maxElementError: 0.01,
        maxTotalError: 0.01,
      },
    );

    expect(result.mfs).toHaveLength(108);
  });

  it('unsaturation', () => {
    let result = mfFromEA(
      { C: 0.8, H: 0.2 },
      {
        ranges: [
          { mf: 'C', min: 0, max: 1 },
          { mf: 'H', min: 3, max: 4 },
        ],
        maxElementError: 1,
        maxTotalError: 10,
        unsaturation: {
          min: 0,
          max: 1,
          onlyInteger: true,
        },
      },
    );

    expect(result.mfs).toHaveLength(1);
  });

  it('unsaturation no integer filter', () => {
    let result = mfFromEA(
      { C: 0.8, H: 0.2 },
      {
        ranges: [
          { mf: 'C', min: 0, max: 1 },
          { mf: 'H', min: 3, max: 4 },
        ],
        maxElementError: 1,
        maxTotalError: 10,
        unsaturation: {
          min: 0,
          max: 1,
        },
      },
    );

    expect(result.mfs).toHaveLength(2);
  });
});
