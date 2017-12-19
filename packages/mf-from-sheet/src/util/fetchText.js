'use strict';

const request = require('request-promise');

module.exports = async function fetchText(url) {
    let response = await request(url);
    return response;
};
