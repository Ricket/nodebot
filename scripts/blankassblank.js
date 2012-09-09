// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     When someone says <adjective>-ass <noun>, it repeats the sentence but with the hyphen shifted to the right.

listen(/PRIVMSG [^ ]+ :(.*)([a-zA-Z]+)-ass ([a-zA-Z]+)(.*)$/i, function(match, data, replyTo) {
    irc.privmsg(replyTo, match[1] + match[2] + " ass-" + match[3] + match[4]);
});
