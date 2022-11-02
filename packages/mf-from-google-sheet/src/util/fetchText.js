'use strict';

module.exports = async function fetchText(url) {
  const result = await fetch(url);
  if (result.status !== 200) {
    throw new Error(String(result.status));
  }
  return result.text();
};
