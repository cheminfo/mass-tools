'use strict';

const request = require('request-promise');

module.exports = async function fetchText(url) {
    return request(url);
};
