// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~calc|eval|math expression - evaluates expression as javascript within an empty sandbox; can be used like a calculator
//     When some apparent math is found (matching numbers, parentheses and math operators), tries to solve it and says the answer;
//         this way, if someone says a sentence with some math in it, the bot will solve the math for them. How helpful!

listen(/PRIVMSG (#[^ ]+) :~(calc|eval|math) (.*)$/i, function(match, data, replyTo) {
	try {
		var result = vm.runInNewContext(match[3]);
		irc.privmsg(replyTo, "Result: "+result);
	} catch(err) {
		irc.privmsg(replyTo, "Error: "+err);
	}
	
});

listen(/PRIVMSG [^ ]+ :.*?([()\d]+(?:[()+\-*\/][0-9]+[()]*)+)/i, function(match, data, replyTo) {
	try {
		var result = vm.runInNewContext(match[1]);
		var numeric = parseFloat(result);
		irc.privmsg(replyTo, match[1]+" = "+numeric);
	} catch(err) {
		console.log(err);
	}
});
