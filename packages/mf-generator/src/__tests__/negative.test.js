'use strict';

const generateMFs = require('..');

describe.skip('generateMFs advanced', () => {
  it('negative', async () => {
    let mfsArray = [
      ['C', 'H'],
      ['C-1', 'H-1'],
    ];
    let result = await generateMFs(mfsArray, { ionizations: 'H+' });
    console.log(result);
    expect(result[0].mf).toBe('HCl');
    expect(result[0].comment).toBe('YY');
    expect(result).toHaveLength(4);
  });
});
