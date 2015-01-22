// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~eval expression - evaluates expression as javascript within an empty
//                        sandbox

var vm = require('vm'),
    spawn = require('child_process').spawn;

var TIMEOUT = 5000,
    spawnOptions = {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: process.cwd(),
    env: {},
    detached: false
};

function doEval(childFile, userScript, replyTo) {
    var child = spawn('node', [childFile], spawnOptions);

    var timer = setTimeout(function () { child.kill('SIGKILL'); }, TIMEOUT);

    child.stdout.setEncoding('utf8');
    var result = "";
    child.stdout.on('data', function (data) {
        result += data;
        result = result.substr(0, 512);
    });
    child.on('exit', function (code) {
        clearTimeout(timer);
        if (code === 0) {
            irc.privmsg(replyTo, "Result: " + result);
        } else if (result !== "") {
            irc.privmsg(replyTo, "" + result);
        }
    });
    child.stdin.end(userScript);

}

listen(regexFactory.startsWith(['eval', 'js']), function(match, data, replyTo) {
    doEval('scripts/eval.child.js', match[1], replyTo);
});

listen(regexFactory.startsWith(['cval', 'coffee']), function(match, data, replyTo) {
    doEval('scripts/eval_coffee.child.js', match[1], replyTo);
});

listen(regexFactory.startsWith(['cc', 'coffeecompile']), function(match, data, replyTo) {
    doEval('scripts/eval_coffee_compile.child.js', match[1], replyTo);
});

