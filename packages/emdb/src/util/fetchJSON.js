import crossFetch from 'cross-fetch';

export async function fetchJSON(url) {
  const result = await crossFetch(url);
  return result.json();
}
