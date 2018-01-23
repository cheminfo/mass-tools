'use strict';

const request = require('request-promise-native');

module.exports = function fetchText(url) {
    return request(url).promise();
};
