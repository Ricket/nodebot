// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     On end of MOTD, autojoin all channels in autojoin.txt
//     ~join channel - cause bot to join channel
//     ~autojoin channel - add channel to autojoin.txt, thus autojoining on next run
//     ~unautojoin channel - remove channel from autojoin.txt
//     ~part [channel] - part channel (current channel if not specified)

var db = require('./lib/listdb').getDB('autojoin');

listen(/376/i, function(match) {
	// 376 is the end of MOTD
	var channels = db.getAll();
	var i;
	for(i in channels) {
		irc.join(channels[i]);
	}
}, true /* (one time only) */);

listen(/~join (#.+)$/i, function(match, data, replyTo) {
	irc.join(match[1]);
});

listen(/~autojoin (#.+)$/i, function(match, data, replyTo) {
	db.add(match[1]);
});

listen(/~unautojoin (#.+)$/i, function(match, data, replyTo) {
	db.remove(match[1], true /* (ignore case) */);
});

listen(/~part$/i, function(match, data, replyTo) {
	if(replyTo.indexOf('#') == 0) {
		irc.part(replyTo);
	}
});

listen(/~part (#.+)$/i, function(match, data, replyTo) {
	irc.part(match[1]);
});
