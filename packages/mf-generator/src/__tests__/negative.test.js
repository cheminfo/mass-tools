import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
import { describe, expect, it } from 'vitest';

import { generateMFs } from '..';

expect.extend({ toBeDeepCloseTo });

describe('generateMFs advanced', () => {
  it('negative', async () => {
    let mfsArray = [
      ['C', 'H'],
      ['C-1', 'H-1'],
    ];
    let result = await generateMFs(mfsArray, { ionizations: 'H+' });
    expect(result).toBeDeepCloseTo([
      {
        charge: 0,
        em: 0,
        mw: 0,
        ionization: { mf: 'H+', em: 1.00782503223, charge: 1, atoms: { H: 1 } },
        unsaturation: 1,
        atoms: { H: 0 },
        parts: ['H', 'H-1'],
        mf: '',
        ms: { ionization: 'H+', em: 1.0072764523209299, charge: 1 },
      },
      {
        charge: 0,
        em: 10.99217496777,
        mw: 11.00279514267947,
        ionization: { mf: 'H+', em: 1.00782503223, charge: 1, atoms: { H: 1 } },
        unsaturation: 2.5,
        atoms: { C: 1, H: -1 },
        parts: ['C', 'H-1'],
        mf: 'CH-1',
        ms: { ionization: 'H+', em: 11.99945142009093, charge: 1 },
      },
    ]);
  });
});
