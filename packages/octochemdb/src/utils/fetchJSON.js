export async function fetchJSON(url, options = {}) {
  const { method = 'GET' } = options;
  const result = await fetch(url, {
    method
  });
  return result.json();
}
