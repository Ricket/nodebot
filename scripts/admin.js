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

var db = require('./lib/listdb').getDB('admins');

function isAdmin(username) {
    return db.hasValue(username, true);
}

function addAdmin(username) {
    db.add(username);
}

function removeAdmin(username) {
    db.remove(username, true);
}

listen(/^:([^!]+).*~secret (.*)$/i, function(match) {
    if (isAdmin(match[1])) {
        irc.privmsg(match[1], "You are already an admin.");
    } else if (match[2] == nodebot_prefs.secret) {
        addAdmin(match[1]);
        irc.privmsg(match[1], "You are now an admin.");
    }
});

function listen_admin(regex, listener) {
    listen(/^:([^!]+)/i, function(match, data, replyTo) {
        if (isAdmin(match[1])) {
            match = regex.exec(data);
            if (match) {
                try {
                    listener(match, data, replyTo);
                } catch(err) {
                    console.log("caught error in admin script: "+err);
                }
            }
        }
    });
}

listen_admin(/^:([^!]+).*~makeadmin (.*)$/i, function(match) {
    if (isAdmin(match[2])) {
        irc.privmsg(match[1], match[2] + " is already an admin.");
    } else {
        addAdmin(match[2]);
        irc.privmsg(match[1], match[2] + " is now an admin.");
    }
});

listen_admin(/^:([^!]+).*~unadmin (.*)$/i, function(match) {
    if (isAdmin(match[2])) {
        removeAdmin(match[2]);
        irc.privmsg(match[1], match[2] + " is no longer an admin.");
    } else {
        irc.privmsg(match[1], match[2] + " isn't an admin");
    }
});

listen(/:([^!]+)!.*PRIVMSG (.*) :~admins/i, function(match, data, replyTo) {
    irc.privmsg(replyTo, "Admins: " + db.getAll().join(","));
});

listen_admin(/^:([^!]+).*~ignore (.+)$/i, function(match) {
    if (isAdmin(match[2])) {
        irc.privmsg(match[1], match[2] + " is an admin, can't be ignored");
    } else {
        irc.ignore(match[2]);
        irc.privmsg(match[1], match[2] + " is now ignored.");
    }
});

listen_admin(/^:([^!]+)!.*~unignore (.*)$/i, function(match) {
    irc.unignore(match[2]);
    irc.privmsg(match[1], match[2] + " unignored");
});

listen_admin(/~ignorelist$/i, function (match, data, replyTo) {
    irc.chatignorelist(replyTo);
});

var exec = require('child_process').exec;
listen_admin(/~git pull$/i, function(match, data, replyTo) {
    exec('git pull', function(error, stdout, stderr) {
        var feedback, stdouts;
        stdouts = stdout.replace(/\n$/, "").split("\n");
        feedback = ((error) ? "Error: " : "Result: ") + stdouts[stdouts.length - 1];

        irc.privmsg(replyTo, feedback);
    });
});

listen_admin(regexFactory.only('reload'), function(match, data, replyTo) {
    irc.loadScripts();
    irc.privmsg(replyTo, "Reloaded scripts");
});

listen_admin(regexFactory.startsWith('raw'), function(match) {
    irc.raw(match[1]);
});

