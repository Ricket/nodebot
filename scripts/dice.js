// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~dice|roll [XdY] - rolls a Y-sided die X times, defaults to 1d6; says the result

listen(/~(?:dice|roll)[ ]*$/i, function(match, data, replyTo) {
	console.log('dice');
	roll(1,6, replyTo);
});

listen(/~(?:dice|roll) (.+)$/i, function(match, data, replyTo) {
	console.log('superdice');
	try {
		if(match[1].indexOf('d') > -1) {
			var params = match[1].split('d');
			roll(parseInt(params[0]), parseInt(params[1]), replyTo);
		}
	} catch(err) {
		irc.privmsg(replyTo, "Usage: ~dice [XdY] - where X is number of dice and Y is sides per die");
	}
});

function roll(dice, faces, replyTo) {
	var results = [];
	for(var i=0; i<dice; i++) {
		results.push(""+(Math.floor(Math.random()*faces)+1));
	}
	irc.privmsg(replyTo, results.join(","));
};