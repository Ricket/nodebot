// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~tell someone something - Saves the message to tell the person when they get back
//     On user join, looks to see if the new person has any saved messages and if so, says them

var db = require('./lib/listdb').getDB('messages');

function addMessage(room, user, message) {
    db.add(room+"@"+user+": "+message);
}

function getMessages(room, user) {
    var i, messages, prefix, userMessages, messagesToRemove;
    userMessages = [], messagesToRemove = [];
    prefix = room + "@" + user + ": ";

    messages = db.getAll();
    for (i in messages) {
        if (messages[i].toLowerCase().indexOf(prefix.toLowerCase()) == 0) {
            messagesToRemove.push(messages[i]);
            userMessages.push(messages[i].substr(prefix.length));
        }
    }

    for (i in messagesToRemove) {
        db.remove(messagesToRemove[i], true);
    }

    return userMessages;
}

function isUser(str) {
    return str[0] !== "#";
}

listen(regexFactory.startsWith("tell"), function(match, data, replyTo, from) {
    var msgMatch = /^([^ ]+) (.+)$/.exec(match[1]);

    if (msgMatch && isUser(msgMatch[1])) {
        addMessage(replyTo, msgMatch[1], "message from " + from + ": " + msgMatch[2]);

        irc.privmsg(replyTo, "I'll tell them when they get back.");
    } else {
        irc.privmsg(replyTo, "Usage: tell {user} {some message}");
    }
});

// listen for join
listen(/:([^!]+)!.*JOIN :?(.*)$/i, function(match) {
    // search tell folder for any messages to give
    var i, userMessages = getMessages(match[2], match[1]);
    for (i in userMessages) {
        irc.privmsg(match[2], match[1] + ", " + userMessages[i]);
    }
});

