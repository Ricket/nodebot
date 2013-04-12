// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     On end of MOTD, autojoin all channels in autojoin.txt
//     ~join channel - cause bot to join channel
//     ~autojoin channel - add channel to autojoin.txt, thus autojoining on next run
//     ~unautojoin channel - remove channel from autojoin.txt
//     ~part [channel] - part channel (current channel if not specified)

var db = require('./lib/listdb').getDB('autojoin');

listen(/376/i, function() {
    // 376 is the end of MOTD
    setTimeout(function () {
        var channels = db.getAll(), i;
        for (i in channels) {
            irc.join(channels[i]);
        }
    }, 5000); // wait 5 seconds for a cloak to apply
}, true /* (one time only) */);

function isChannelName(str) {
    return str[0] === "#";
}

listen(regexFactory.startsWith("join"), function(match, data, replyTo) {
    if (isChannelName(match[1])) {
        irc.join(match[1]);
    }
});

listen(regexFactory.startsWith("autojoin"), function(match, data, replyTo) {
    if (isChannelName(match[1])) {
        db.add(match[1]);
        irc.privmsg(replyTo, "Added " + match[1] + " to autojoin list");
    }
});

listen(regexFactory.startsWith("unautojoin"), function(match, data, replyTo) {
    if (isChannelName(match[1])) {
        db.remove(match[1], true /* (ignore case) */);
        irc.privmsg(replyTo, "Removed " + match[1] + " from autojoin list");
    }
});

listen(regexFactory.startsWith("part"), function(match, data, replyTo) {
    if (isChannelName(match[1])) {
        irc.part(match[1]);
    } else if (match[1].length === 0 && isChannelName(replyTo)) {
        irc.part(replyTo);
    }
});

