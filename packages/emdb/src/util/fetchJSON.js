export async function fetchJSON(url) {
  const result = await fetch(url);
  return result.json();
}
