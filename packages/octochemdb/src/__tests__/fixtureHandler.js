import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { http } from 'msw';

/**
 * Stable representation of the body of a request.
 *
 * The lists of ids are posted as multipart form data, whose boundary is random:
 * taking the raw body would give a different key on every run, so only the
 * fields are kept.
 * @param {Request} request
 * @returns {Promise<string>}
 */
export async function normalizeBody(request) {
  if (request.method === 'GET' || request.method === 'HEAD') return '';
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return request.clone().text();
  }
  const formData = await request.clone().formData();
  const fields = [];
  for (const [name, value] of formData.entries()) {
    fields.push(`${name}=${typeof value === 'string' ? value : '[file]'}`);
  }
  return fields.toSorted().join('&');
}

/**
 * Key under which the response of a request is recorded. The body is part of it
 * because the services take a list of ids as a POST body: without it two
 * different searches on the same route would share a single response.
 * @param {string} method
 * @param {string} url
 * @param {string} [body='']
 * @returns {string}
 */
export function fixtureKey(method, url, body = '') {
  return createHash('sha256')
    .update(`${method} ${url} ${body}`)
    .digest('hex')
    .slice(0, 16);
}

/**
 * Serve the recorded responses of a remote service.
 *
 * The tests must never reach the network: the services are not always
 * reachable from the CI, and their content changes over time, which used to
 * make the results depend on the day the tests were run.
 * @param {string} origin - e.g. `https://octochemdb.cheminfo.org`
 * @param {string} directory - where the responses were recorded
 * @returns {import('msw').RequestHandler}
 */
export function fixtureHandler(origin, directory) {
  return http.all(`${origin}/*`, async ({ request }) => {
    const key = fixtureKey(
      request.method,
      request.url,
      await normalizeBody(request),
    );
    let recorded;
    try {
      recorded = JSON.parse(
        readFileSync(path.join(directory, `${key}.json`), 'utf8'),
      );
    } catch (error) {
      throw new Error(
        `no recorded response for ${request.method} ${request.url}
Record it by running the test with the recorder, or add the fixture by hand.`,
        { cause: error },
      );
    }
    return new Response(recorded.body, {
      status: recorded.status,
      headers: { 'Content-Type': 'application/json' },
    });
  });
}
