import { gnps } from '../gnps.js';

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
test('gnps', async () => {
  const results = await gnps({
    url: 'http://localhost/data/gnps.json',
    masses: [100, 200, 300],
    precision: 200,
    modifications: 'CH2,O-1',
  });
  expect(results).toHaveLength(5);
}, 30000);
