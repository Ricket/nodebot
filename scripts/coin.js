// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~coin|flip - randomly chooses heads or tails

listen(/~(coin|flip)$/i, function(match, data, replyTo) {
	// save message into the tell folder
	irc.action(replyTo, "flips a coin...");
	setTimeout(function() {
		irc.privmsg(replyTo, (Math.random() < 0.5) ? "Heads!" : "Tails!");
	}, 1000);
});
