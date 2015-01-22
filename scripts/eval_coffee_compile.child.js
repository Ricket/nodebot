// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This is the helper script for eval.js

var vm = require('vm'),
    _ = require('lodash'),
    coffee = require('coffee-script');

process.stdin.setEncoding('utf8');
process.stdin.resume();

var wholeCommand = "";
process.stdin.on('data', function (command) {
    wholeCommand += command;
});

process.stdin.on('end', function() {
    try {
        // var result = vm.runInNewContext(wholeCommand, {_: _});
        var result = coffee.compile(wholeCommand, {bare: true}).replace(/\n+$/, '');
        var stdout = "";
        if (_.isArray(result)) {
            stdout = "[" + result + "]";
        }
        else if (_.isFunction(result)) {
            stdout = result.toString();
        }
        else if (_.isObject(result) && !_.isNumber(result) && !_.isDate(result)) {
            stdout = JSON.stringify(result);
        }
        else {
            stdout = "" + result;
        }
        process.stdout.write(stdout.substr(0, 512));
        process.exit(0);
    } catch(err) {
        process.stdout.write(("" + err).substr(0, 512));
        process.exit(1);
    }
});
