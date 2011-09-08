// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~calc|eval|math expression - evaluates expression as javascript within an empty sandbox; can be used like a calculator
//     When some apparent math is found (matching numbers, parentheses and math operators), tries to solve it and says the answer;
//         this way, if someone says a sentence with some math in it, the bot will solve the math for them. How helpful!

var vm = require('vm');
var exec = require('child_process').exec;

listen(/PRIVMSG [^ ]+ :~(calc|eval|math) (.*)$/i, function(match, data, replyTo) {
	var child = exec('node scripts/calc.js.child',
		{ encoding: 'ascii',
			timeout: 5000 },
		function (error, stdout, stderr) {
			if(error != null) {
				irc.privmsg(replyTo, stdout);
			} else {
				irc.privmsg(replyTo, "Result: "+stdout);
			}
		}
	);
	child.stdin.end(match[2]);
});

listen(/PRIVMSG [^ ]+ :(?!~(calc|eval|math)).*?([()\d]+(?:[()+\-*\/][0-9]+[()]*)+)/i, function(match, data, replyTo) {
	try {
		var result = vm.runInNewContext(match[2]);
		var numeric = parseFloat(result);
		irc.privmsg(replyTo, match[2]+" = "+numeric);
	} catch(err) {
		console.log(err);
	}
});
