// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~dice|roll [XdY] - rolls a Y-sided die X times, defaults to 1d6; says the result

listen(/~(?:dice|roll)[ ]*$/i, function(match, data, replyTo) {
	console.log('dice');
	roll(1, 6, replyTo);
});

listen(/~(?:dice|roll) (.+)$/i, function(match, data, replyTo) {
	var params;
	console.log('superdice');
	try {
		if (match[1].indexOf('d') > -1) {
			params = match[1].split('d');
			roll(parseInt(params[0]), parseInt(params[1]), replyTo);
			return;
		}
	} catch(err) {
		// fall through to the help message
	}
	irc.privmsg(replyTo, "Usage: ~dice [XdY] - where X is number of dice (up to 20) and Y is sides per die");
});

function roll(dice, faces, replyTo) {
	var i = 0, results = [];
	dice = Math.max(dice, 1);
	dice = Math.min(dice, 20);
	faces = Math.max(faces, 1);
	faces = Math.min(faces, 10000);

	for(; i < dice; i++) {
		results.push("" + (Math.floor(Math.random() * faces) + 1));
	}
	irc.privmsg(replyTo, results.join(","));
};
