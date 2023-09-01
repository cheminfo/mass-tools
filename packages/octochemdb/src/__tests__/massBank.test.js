import { massBank } from '../massBank.js';

import { server } from './testServer';

// Enable request interception.
beforeAll(() => {
  server.listen();
});
// Reset handlers so that each test could alter them
// without affecting other, unrelated tests.
afterEach(() => server.resetHandlers());

// Don't forget to clean up afterwards.
afterAll(() => {
  server.close();
});
test('massBank', async () => {
  const results = await massBank({
    url: 'http://localhost/data/massBank.json',
    masses: [100, 200, 300],
    precision: 200,
    modifications: 'CH2,O-1',
  });
  expect(results).toHaveLength(23);
}, 30000);
