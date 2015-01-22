// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     Looks for "hello", "hi", "howdy", "hola" and says hello; intended to
//     join in on greeting someone when someone else greets them.
//     Same thing for "goodbye" and "bye"

var waiting = false;
function privmsg_throttled(replyTo, msg) {
    if(!waiting) {
        irc.privmsg(replyTo, msg);
        waiting = true;
        setTimeout(function(){ waiting = false; }, 3000);
    }
}

var HELLOS = ['hello', 'hi', 'hey', 'howdy', 'hola', 'good morning', 'good afternoon', 'good evening'],
    BYES = ['goodbye', 'bye', 'cya', 'cya later', 'adios', 'ttyl'],
    SUFFIXES = [nodebot_prefs.nickname, 'guys', 'all', 'folks'],
    PUNCTUATION = ['!', '\\.', '\\.\\.\\.'];

listenWithResponse(permutations(HELLOS, SUFFIXES, PUNCTUATION), "Hello!");
listenWithResponse(permutations(BYES, SUFFIXES, PUNCTUATION), "Bye!");

function permutations(greetings, suffixes, punctuation) {
    return "(?:" + greetings.join("|") + ")(?: " + suffixes.join("| ") + ")?" +
        "(?:" + punctuation.join("|") + ")?";
}

function listenWithResponse(regexString, replyMessage) {
    listen(regexFactory.matches(regexString, "optional", true), function(match, data, replyTo) {
        privmsg_throttled(replyTo, replyMessage);
    });
}

