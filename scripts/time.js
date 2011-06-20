// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~(date|time) - gives the current date/time

listen(/PRIVMSG [^ ]+ :~(date|time)$/i, function(match, data, replyTo) {
	var now = new Date();
	irc.privmsg(replyTo, "Current datetime is "+now);
});