// (c) 2011 Kshitij Parajuli
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     It replaces the words ending in -or like humor, labor, favor with it's British English counterparts.

listen(/PRIVMSG [^ ]+ :(.*)([a-zA-Z]+)or(\.| |\t|\n)(.*)?/i, function(match, data, replyTo) {
	irc.privmsg(replyTo,  match[1]+match[2]+"our*"+match[3]+match[4]);
});