'use strict';

function DB(data, options = {}) {
    let {
        filter
    } = options;
    if (filter) {
        data = data.map(datum => filter(datum));
    }
    this.data = data;
}

module.exports = DB;
