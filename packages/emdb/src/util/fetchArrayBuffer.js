'use strict';

const request = require('request-promise-native');

module.exports = async function fetchArrayBuffer(url) {
    let response = await request({
        uri: url,
        encoding: null
    });
    return response;
};
