import { massBank } from '../massBank.js';

test('massBank', async () => {
  const results = await massBank({
    masses: [100, 200, 300],
    precision: 200,
    modifications: 'CH2,O-1',
  });
  expect(results).toHaveLength(23);
});
