'use strict';

module.exports = async function fetchTextBrowser(url) {
    const result = await fetch(url);
    return result.text();
};
