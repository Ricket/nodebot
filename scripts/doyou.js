// (c) 2014 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     bot, do you __? - answers with yes or no

function doI() {
    return Math.random() < 0.5;
}

function listenBinary(questionPrefix, yesPrefix, noPrefix) {
    listen(regexFactory.matches(questionPrefix + " ([^?]+)\\?*"), function (match, data, replyTo) {
        if (doI()) {
            irc.privmsg(replyTo, yesPrefix + " " + match[1] + ".");
        } else {
            irc.privmsg(replyTo, noPrefix + " " + match[1] + ".");
        }
    });
}

listenBinary("do you", "Yes, I", "No, I don't");

