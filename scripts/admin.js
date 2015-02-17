// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~secret password - authenticate to become an admin
//     ~makeadmin user - make user an admin
//     ~unadmin user - demote user from admin status
//     ~admins - list admins
//     ~ignore user - the bot will no longer respond to messages from [user]
//     ~unignore user - the bot will once more respond to messages from [user]
//     ~reload - reload scripts

require('./config.js');
var admins = require('./lib/admins');

listen(regexFactory.startsWith("secret"), function(match, data, replyTo, from) {
    if (admins.is(from)) {
        irc.privmsg(replyTo, "You are already an admin.");
    } else if (match[1] === nodebot_prefs.secret) {
        admins.add(from);
        irc.privmsg(replyTo, "You are now an admin.");
    }
});

listen(regexFactory.only("admins"), function(match, data, replyTo) {
    irc.privmsg(replyTo, "Admins: " + admins.list());
});

listen_admin(regexFactory.startsWith("makeadmin"), function(match, data, replyTo, from) {
    if (admins.is(match[1])) {
        irc.privmsg(replyTo, match[1] + " is already an admin.");
    } else {
        admins.add(match[1]);
        irc.privmsg(replyTo, match[1] + " is now an admin.");
    }
});

listen_admin(regexFactory.startsWith("unadmin"), function(match, data, replyTo, from) {
    if (admins.is(match[1])) {
        admins.remove(match[1]);
        irc.privmsg(replyTo, match[1] + " is no longer an admin.");
    } else {
        irc.privmsg(replyTo, match[1] + " isn't an admin.");
    }
});

listen_admin(regexFactory.startsWith("ignore"), function(match, data, replyTo, from) {
    if (admins.is(match[1])) {
        irc.privmsg(replyTo, match[1] + " is an admin, can't be ignored.");
    } else {
        irc.ignore(match[1]);
        irc.privmsg(replyTo, match[1] + " is now ignored.");
    }
});

listen_admin(regexFactory.startsWith("unignore"), function(match, data, replyTo, from) {
    irc.unignore(match[1]);
    irc.privmsg(replyTo, match[1] + " unignored.");
});

listen_admin(regexFactory.only("ignorelist"), function (match, data, replyTo) {
    irc.chatignorelist(replyTo);
});

var exec = require('child_process').exec;
listen_admin(regexFactory.only("git pull"), function(match, data, replyTo) {
    exec('git pull', function(error, stdout, stderr) {
        var feedback, stdouts;
        stdouts = stdout.replace(/\n$/, "").split("\n");
        feedback = ((error) ? "Error: " : "Result: ") + stdouts[stdouts.length - 1];

        irc.privmsg(replyTo, feedback);
    });
});

listen_admin(regexFactory.only('reload'), function(match, data, replyTo) {
    irc.loadScripts();
    irc.privmsg(replyTo, "Reloaded scripts.");
});

listen_admin(regexFactory.startsWith('raw'), function(match) {
    irc.raw(match[1]);
});

