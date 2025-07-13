import { describe, expect, it } from 'vitest';

import { getPeaksAnnotation } from '../getPeaksAnnotation';

describe('test getPeaksAnnotation', () => {
  const peaks = [
    { x: 12, y: 1 },
    { x: 24, y: 2 },
    { x: 36, y: 3 },
    { x: 42, y: 4, charge: 1 },
  ];

  it('default options', async () => {
    let result = await getPeaksAnnotation(peaks);

    expect(result).toMatchSnapshot();
  });

  it('shift -12', async () => {
    let result = await getPeaksAnnotation(peaks, {
      shift: -11.99999,
      showMF: true,
      charge: 2,
    });

    expect(result).toMatchSnapshot();
  });

  it('cap numberMFs to 2', async () => {
    let result = await getPeaksAnnotation(peaks, {
      numberMFs: 2,
    });

    expect(result).toMatchSnapshot();
  });
});
