// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~tell someone something - Saves the message to tell the person when they get back
//     On user join, looks to see if the new person has any saved messages and if so, says them

listen(/PRIVMSG ([^ ]+) :~tell ([^ ]+) (.+)$/i, function(match) {
	// save message into the tell folder
	// irc.privmsg(match[1], "I'll tell them when they get back.");
});

// listen for join
listen(/:([^!]+)!.*JOIN :(.*)$/i, function(match) {
	// search tell folder for any messages to give
	// irc.privmsg(match[2], match[1]+": Ricket says hi");
});