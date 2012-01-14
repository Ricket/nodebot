// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This is the helper script for calc.js

var vm = require('vm');
var stdin = process.openStdin();
stdin.setEncoding('ascii');

var wholeCommand = "";
stdin.on('data', function (command) {
    wholeCommand += command;
});

stdin.on('end', function() {
    try {
        process.stdout.write("" + vm.runInNewContext(wholeCommand));
        process.exit(0);
    } catch(err) {
        process.stdout.write("" + err);
        process.exit(1);
    }
});
