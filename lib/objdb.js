// (c) 2015 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// An object db is a file-backed JSON object.
// The db file is stored in "data/DBNAME.objdb.json".

var fs = require('fs');

exports.getDB = function (dbName) {
    var fileName = 'data/'+dbName+'.objdb.json';
    var obj;
    
    try {
        var fileContents = fs.readFileSync(fileName, 'ascii');
        if(fileContents) {
            obj = JSON.parse(fileContents);
        } else {
            obj = {};
        }
    } catch(err) {obj = {};}
    
    function writeFile() {
        fs.writeFileSync(fileName, JSON.stringify(obj), 'ascii');
    }
    
    return {
        get: function (key) {
            if (key) {
                return obj[key];
            } else {
                return obj;
            }
        },
        write: writeFile,
        set: function (key, value) {
            obj[key] = value;
            writeFile();
        },
        remove: function (key) {
            delete obj[key];
            writeFile();
        }
    }
}
