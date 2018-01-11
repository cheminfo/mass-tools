'use strict';


/*
    Searching by monoisotopic mass. This mass will not take into account the mass
    of the mass of the electron

*/

module.exports = function searchEM(targetMass, options = {}) {
    let {
        databases=Object.keys(this.databases)
    } = options;

    let results={};
    for (let database of databases) {
        let result=[];
        results[database]=result;
        for (let entry of this.databases[database]) {
            console.log(entry);
        }
        console.log(database);
    }

 //   console.log(results);

    return results;
};

