// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// A list db is a file-backed list of strings; the strings should not have
// the newline character in them, but otherwise can be arbitrary length.
// The db file is stored in "data/DBNAME.list".

var fs = require('fs');

exports.getDB = function (dbName) {
	var fileName = 'data/'+dbName+'.txt';
	var values;
	
	try {
		values = fs.readFileSync(fileName, 'ascii');
		if(values && values.length > 0) {
			values = values.split('\n');
		} else {
			values = [];
		}
	} catch(err) {values = [];}
	
	function writeFile() {
		fs.writeFileSync(fileName, values.join('\n'), 'ascii');
	}
	
	return {
		getName: function () {
			return dbName;
		},
		getAll: function() {
			return values;
		},
		hasValue: function (value, ignoreCase) {
			ignoreCase = ignoreCase || false;
			
			var i;
			for(i=0; i<values.length; i++) {
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
			values.push(value);
			
			writeFile();
		},
		remove: function (value, ignoreCase) {
			ignoreCase = ignoreCase || false;
			
			var i;
			for(i=0; i<values.length; i++) {
				if(ignoreCase) {
					if(values[i].toUpperCase() == value.toUpperCase()) {
						values.splice(i,1);
						i--;
					}
				} else {
					if(values[i] == value) {
						values.splice(i,1);
						i--;
					}
				}
			}
			
			writeFile();
		}
	}
}
