import { searchGNPS } from '../searchGNPS.js';

jest.setTimeout(30000);

test('searchGNPS', async () => {
  const results = await searchGNPS([100, 200, 300], {
    precision: 200,
    modifications: 'CH2,O-1',
  });
  expect(results).toHaveLength(5);
});
