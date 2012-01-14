// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     Listens for "This nickname is registered" from NickServ (in config.js) and replies with an IDENTIFY message.

listen(new RegExp('^:' + nodebot_prefs.nickserv_nickname + '!' + nodebot_prefs.nickserv_hostname + ' NOTICE [^ ]+ :This nickname is registered', 'i'), function(match, data, replyTo) {
	irc.privmsg('NickServ', 'IDENTIFY ' + nodebot_prefs.nickserv_password);
});
