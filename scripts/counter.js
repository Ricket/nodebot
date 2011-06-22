// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     Holds onto a number which starts at 0 when the bot loads the script
//     ~increment - increments the number
//     ~decrement - decrements the number

var count = 0;
listen(/PRIVMSG [^ ]+ :~increment$/i, function(match, data, replyTo) {
	count++;
	irc.privmsg(replyTo, "The count is now "+count);
});
listen(/PRIVMSG [^ ]+ :~decrement$/i, function(match, data, replyTo) {
	count--;
	irc.privmsg(replyTo, "The count is now "+count);
});
