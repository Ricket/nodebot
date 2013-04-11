// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     When someone says something that starts with "say", repeats what was to be said. Example:
//         <person> say it again
//         <nodebot> it again

listen(regexFactory.startsWith("say", "optional"), function(match, data, replyTo) {
    irc.privmsg(replyTo, match[1]);
});
