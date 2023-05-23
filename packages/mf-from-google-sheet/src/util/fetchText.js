import crossFetch from 'cross-fetch';

export async function fetchText(url) {
  const result = await crossFetch(url);
  if (result.status !== 200) {
    throw new Error(String(result.status));
  }
  return result.text();
}
