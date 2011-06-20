// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

/* This is the most useful of all the plugins! It keeps the bot
 * connected to the server by responding to IRC "PING" commands!
 * Do not remove or disable, or the bot will be kicked within
 * minutes of connecting!
 */

// This script handles the following functions:
//     Responds to the PING command with a PONG command.

listen(/^PING :(.+)$/i, function(match) {
	irc.pong(match[1]);
});