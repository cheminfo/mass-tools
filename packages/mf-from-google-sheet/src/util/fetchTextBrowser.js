'use strict';

/* eslint-env browser */

module.exports = async function fetchTextBrowser(url) {
  const result = await fetch(url);
  return result.text();
};
