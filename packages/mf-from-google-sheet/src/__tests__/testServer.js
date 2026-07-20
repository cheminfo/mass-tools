import path from 'node:path';

import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { fixtureHandler } from '../../../octochemdb/src/__tests__/fixtureHandler.js';

export const server = setupServer(
  fixtureHandler(
    'https://googledocs.cheminfo.org',
    path.join(__dirname, 'fixtures'),
  ),
);

/**
 * Isolate the test file from the network: every request is answered from the
 * recorded fixtures. Call it once at the top of a test file.
 * @returns {import('msw/node').SetupServerApi}
 */
export function useMockServer() {
  beforeAll(() => {
    // 'error' rather than 'bypass': a request we forgot to record must fail
    // loudly instead of silently reaching the real service
    server.listen({ onUnhandledRequest: 'error' });
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  return server;
}
