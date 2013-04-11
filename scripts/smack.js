// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~smack user - smacks user with a random object

var smackThings = ["smelly fish", "tin pot", "frying pan", "mouse",
            "keyboard", "fly swatter", "old boot"],
    pronouns = ["me", "you", "himself", "herself", "itself", "yourself",
            "self", nodebot_prefs.nickname];

function randomThing() {
    return smackThings[Math.floor(Math.random()*smackThings.length)];
}

function isPronoun(str) {
    return _.any(pronouns, function (pronoun) {
        return str.toUpperCase() === pronoun.toUpperCase();
    });
}

function smack(recipient, replyTo) {
    irc.action(replyTo, "smacks " + recipient + " with a " + randomThing() + ".");
}

listen(regexFactory.startsWith("smack"), function(match, data, replyTo, from) {
    var target = match[1].trim();

    if (isPronoun(target)) {
        smack(from, replyTo);
    } else {
        smack(target, replyTo);
    }
});

