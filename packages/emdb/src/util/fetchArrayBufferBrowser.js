'use strict';

module.exports = async function fetchArrayBuffer(url) {
    const result = await fetch(url);
    return result.arrayBuffer();
};
