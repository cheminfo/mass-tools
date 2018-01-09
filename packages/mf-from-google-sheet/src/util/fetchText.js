'use strict';

const request = require('request-promise-native');

module.exports = async function fetchText(url) {
    return request(url).promise();
};
