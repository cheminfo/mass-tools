import crossFetch from "cross-fetch";

module.exports = async function fetchArrayBufferBrowser(url) {
  const result = await crossFetch(url);
  return result.arrayBuffer();
};
