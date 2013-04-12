// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~coin|flip - randomly chooses heads or tails

listen(regexFactory.only(["coin", "flip"]), function(match, data, replyTo) {
    irc.action(replyTo, "flips a coin...");
    setTimeout(function() {
        irc.privmsg(replyTo, (Math.random() < 0.5) ? "Heads!" : "Tails!");
    }, 1000);
});
