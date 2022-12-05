import crossFetch from 'cross-fetch';

export async function fetchArrayBuffer(url) {
  const result = await crossFetch(url);
  return result.arrayBuffer();
}
