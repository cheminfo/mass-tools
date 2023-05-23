export async function postFetchJSON(url, data = {}) {
  const formData = new FormData();
  for (const name in data) {
    formData.append(name, data[name]);
  }

  const result = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  return result.json();
}
