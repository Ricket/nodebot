// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This is the helper script for eval.js

var vm = require('vm'),
    _ = require('lodash');

process.stdin.setEncoding('utf8');
process.stdin.resume();

var wholeCommand = "";
process.stdin.on('data', function (command) {
    wholeCommand += command;
});

process.stdin.on('end', function() {
    try {
        process.stdout.write("" + vm.runInNewContext(wholeCommand, { _: _ }));
        process.exit(0);
    } catch(err) {
        process.stdout.write("" + err);
        process.exit(1);
    }
});
