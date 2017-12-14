export default class DB {
    constructor(data, options = {}) {
        let {
            filter
        } = options;
        if (filter) {
            data = data.map(datum => filter(datum));
        }
        this.data = data;
    }
}
