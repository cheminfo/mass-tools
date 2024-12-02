import { describe, expect, it } from 'vitest';

import { baseLossExhaustive } from '../baseLossExhaustive';

describe('test base loss', () => {
  it('Base loss of HAlaDampDtmpDcmpDcmpOH', () => {
    let nucleotides = baseLossExhaustive('HAlaDampDtmpDcmpDcmpOH');
    expect(nucleotides).toHaveLength(4);
    expect(nucleotides).toStrictEqual([
      'HAlaDrmpDtmpDcmpDcmpOH$-B1',
      'HAlaDampDrmpDcmpDcmpOH$-B2',
      'HAlaDampDtmpDrmpDcmpOH$-B3',
      'HAlaDampDtmpDcmpDrmpOH$-B4',
    ]);
  });

  it('Base loss of HODampDtmpDcmpDcmpH', () => {
    let nucleotides = baseLossExhaustive('HODampDtmpDcmpDcmpH');
    expect(nucleotides).toHaveLength(4);
    expect(nucleotides).toStrictEqual([
      'HODrmpDtmpDcmpDcmpH$-B1',
      'HODampDrmpDcmpDcmpH$-B2',
      'HODampDtmpDrmpDcmpH$-B3',
      'HODampDtmpDcmpDrmpH$-B4',
    ]);
  });

  it('Base loss of HODampH', () => {
    let nucleotides = baseLossExhaustive('HODampH');
    expect(nucleotides).toHaveLength(1);
    expect(nucleotides).toStrictEqual(['HODrmpH$-B1']);
  });
});
