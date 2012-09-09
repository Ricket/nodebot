// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~eval expression - evaluates expression as javascript within an empty
//                        sandbox

var vm = require('vm'),
    exec = require('child_process').exec;

listen(/PRIVMSG [^ ]+ :~eval (.*)$/i, function(match, data, replyTo) {
    var child = exec('node scripts/eval.child.js',
        { encoding: 'ascii',
            timeout: 500 },
        function (error, stdout, stderr) {
            if (error != null) {
                irc.privmsg(replyTo, stdout);
            } else {
                irc.privmsg(replyTo, "Result: " + stdout);
            }
        }
    );
    child.stdin.end(match[1]);
});

/* this feature ended up being annoying
listen(/PRIVMSG [^ ]+ :(?!~(calc|eval|math)).*?([()\d]+(?:[()+\-*\/][0-9]+[()]*)+)/i, function(match, data, replyTo) {
    try {
        var result = vm.runInNewContext(match[2]);
        var numeric = parseFloat(result);
        irc.privmsg(replyTo, match[2]+" = "+numeric);
    } catch(err) {
        console.log(err);
    }
});
*/
