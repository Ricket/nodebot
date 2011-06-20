// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     Looks for "hello", "hi", "howdy", "hola" and says hello; intended to join in on greeting someone when someone else greets them.
//     Same thing for "goodbye" and "bye"

listen(/PRIVMSG [^ ]+ :(hello|hi|howdy|hola)([!?., ].*)?$/i, function(match, data, replyTo) {
	irc.privmsg(replyTo, "Hello!");
});
listen(/PRIVMSG [^ ]+ :(goodbye|bye)/i, function(match, data, replyTo) {
	irc.privmsg(replyTo, "Goodbye!");
});
