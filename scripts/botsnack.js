// (c) 2012 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~botsnack - hooray!

listen(regexFactory.only("botsnack"), function(match, data, replyTo) {
    irc.privmsg(replyTo, "Yum!");
});
