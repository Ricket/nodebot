// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~help - says "HELP! HELP!"; in the future, should output a list of commands and allow for per-command help

listen(/PRIVMSG [^ ]+ :~help$/i, function(match, data, replyTo) {
	irc.privmsg(replyTo, "HELP! HELP!");
});