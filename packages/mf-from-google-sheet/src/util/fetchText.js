// eslint-disable-next-line no-shadow
const fetch = require('cross-fetch');

module.exports = async function fetchText(url) {
  const result = await fetch(url);
  if (result.status !== 200) {
    throw new Error(String(result.status));
  }
  return result.text();
};
