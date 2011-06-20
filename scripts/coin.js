// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~coin|flip - randomly chooses heads or tails

listen(/~(coin|flip)$/i, function(match, data, replyTo) {
	// save message into the tell folder
	irc.action(replyTo, "flips a coin...");
	setTimeout(function() {
		if(Math.floor(Math.random()*2) == 1) {
			irc.privmsg(replyTo, "Heads!");
		} else {
			irc.privmsg(replyTo, "Tails!");
		}
	}, 1000);
});