import { gnps } from '../gnps.js';

test('gnps', async () => {
  const results = await gnps({
    masses: [100, 200, 300],
    precision: 200,
    modifications: 'CH2,O-1',
  });
  expect(results).toHaveLength(5);
});
