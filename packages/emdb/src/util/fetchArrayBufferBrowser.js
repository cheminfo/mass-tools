'use strict';

module.exports = async function fetchArrayBufferBrowser(url) {
    const result = await fetch(url);
    return result.arrayBuffer();
};
