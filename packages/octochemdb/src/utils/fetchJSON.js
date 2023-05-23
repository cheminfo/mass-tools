import crossFetch from 'cross-fetch';

export async function fetchJSON(url, data) {
  if (data) {
    const searchParams = new URLSearchParams(data);
    const result = await crossFetch(`${url}?${searchParams.toString()}`);
    return result.json();
  } else {
    const result = await crossFetch(url);
    return result.json();
  }
}
