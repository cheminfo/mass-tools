export async function fetchJSON(url, data) {
  if (data) {
    try {
      const searchParams = new URLSearchParams(data);
      const result = await fetch(`${url}?${searchParams.toString()}`);
      return result.json();
    } catch {
      const searchParams = new URLSearchParams(data);
      const result = await fetch(`${url}?${searchParams.toString()}`);
      return result.json();
    }
  } else {
    const result = await fetch(url);
    return result.json();
  }
}
