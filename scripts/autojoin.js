// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     On end of MOTD, autojoin all channels in autojoin.txt
//     ~join channel - cause bot to join channel
//     ~autojoin channel - add channel to autojoin.txt, thus autojoining on next run
//     ~unautojoin channel - remove channel from autojoin.txt
//     ~part [channel] - part channel (current channel if not specified)

listen(/376/i, function(match) {
	// 376 is the end of MOTD
	var channels = fs.readFileSync('data/autojoin.txt', 'ascii');
	if(channels) {
		channels = channels.split('\n');
		for(var i=0; i<channels.length; i++) {
			var channel = channels[i];
			channel = channel.replace('\r','');
			if(channel.indexOf('#') != 0) continue;
			irc.join(channel);
		}
	}
}, true);

listen(/~join (#.+)$/i, function(match, data, replyTo) {
	irc.join(match[1]);
});

listen(/~autojoin (#.+)$/i, function(match, data, replyTo) {
	var channels = fs.readFileSync('data/autojoin.txt', 'ascii');
	if(!channels) channels = "";
	channels = channels.split("\n");
	channels.push(match[1]);
	fs.writeFileSync('data/autojoin.txt', channels.join('\n'), 'ascii');
});

listen(/~unautojoin (#.+)$/i, function(match, data, replyTo) {
	var channels = fs.readFileSync('data/autojoin.txt', 'ascii');
	if(!channels) channels = "";
	channels = channels.split("\n");
	for(var i=0; i<channels.length; i++) {
		if(channels[i].toUpperCase() == match[1].toUpperCase()) {
			channels.splice(i,1);
			i--;
		}
	}
	fs.writeFileSync('data/autojoin.txt', channels.join('\n'), 'ascii');
});

listen(/~part$/i, function(match, data, replyTo) {
	irc.part(replyTo);
});

listen(/~part (#.+)$/i, function(match, data, replyTo) {
	irc.part(match[1]);
});
