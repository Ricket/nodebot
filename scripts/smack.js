// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~smack user - smacks user with a random object
//     ~slap user - slaps user with a random object

require('./config.js');

var verbs = ["smack", "slap", "hit", "pummel"],
    smackThings = ["smelly fish", "tin pot", "frying pan", "mouse",
            "keyboard", "fly swatter", "old boot"],
    pronouns = ["me", "you", "himself", "herself", "itself", "yourself",
            "self", nodebot_prefs.nickname];

function randomThing() {
    return _.sample(smackThings);
}

function isPronoun(str) {
    return _.any(pronouns, function (pronoun) {
        return str.toUpperCase() === pronoun.toUpperCase();
    });
}

function smack(verb, recipient, replyTo) {
    irc.action(replyTo, verb + "s " + recipient + " with a " + randomThing() + ".");
}

_.each(verbs, function(verb) {
    listen(regexFactory.startsWith(verb), function(match, data, replyTo, from) {
        var target = match[1].trim();

        if (isPronoun(target)) {
            smack(verb, from, replyTo);
        } else {
            smack(verb, target, replyTo);
        }
    });
});

