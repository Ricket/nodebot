// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// A list db is a file-backed list of strings; the strings should not have
// the newline character in them, but otherwise can be arbitrary length.
// The db file is stored in "data/DBNAME.txt".

var fs = require('fs');

var dbs = {};

function notEmpty(str) {
    return str && str.length > 0;
}

exports.getDB = function (dbName) {
    if (dbs.hasOwnProperty(dbName)) {
        // DB has already been set up
        return dbs[dbName];
    }

    var fileName = 'data/'+dbName+'.txt';
    var values = [];
    
    function readFile() {
        try {
            var fileContents = fs.readFileSync(fileName, 'ascii');
            if(fileContents && fileContents.length > 0) {
                values = fileContents.split('\n').filter(notEmpty);
            } else {
                values = [];
            }
        } catch(err) {
            console.warn('listdb: Caught error reading file "' + fileName +
                    '", error:', err);
            values = [];

            // in case file doesn't exist, touch it
            try {
                fs.closeSync(fs.openSync(fileName, 'a'));
            } catch (err) {
                console.error('listdb: error touching file ' + fileName, err);
            }
        }
    }
    
    function writeFile() {
        fs.writeFileSync(fileName, values.join('\n'), 'ascii');
    }

    readFile();

    fs.watch(fileName, function () {
        console.log('listdb: Detected change, reloading: ' + fileName);
        readFile();
    });

    console.log('listdb: Set up listdb ' + dbName + ' (' + values.length + ' entries)');

    dbs[dbName] = {
        getName: function () {
            return dbName;
        },
        getAll: function() {
            return values;
        },
        hasValue: function (value, ignoreCase) {
            ignoreCase = ignoreCase || false;

            var i;
            for(i = 0; i < values.length; i++) {
                if(ignoreCase) {
                    if(values[i].toUpperCase() == value.toUpperCase()) {
                        return true;
                    }
                } else {
                    if(values[i] == value) {
                        return true;
                    }
                }
            }
            
            return false;
        },
        add: function (value) {
            console.log('listdb: to ' + dbName + ' add ' + value);
            values.push(value);
            
            writeFile();
        },
        remove: function (value, ignoreCase) {
            ignoreCase = ignoreCase || false;
            
            var i;
            for(i = 0; i < values.length; i++) {
                if(ignoreCase) {
                    if(values[i].toUpperCase() == value.toUpperCase()) {
                        console.log('listdb: to ' + dbName + ' removei ' + values[i]);
                        values.splice(i,1);
                        i--;
                    }
                } else {
                    if(values[i] == value) {
                        console.log('listdb: to ' + dbName + ' remove ' + values[i]);
                        values.splice(i,1);
                        i--;
                    }
                }
            }
            
            writeFile();
        }
    };

    return dbs[dbName];
}

