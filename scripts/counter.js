// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     Holds onto a number which starts at 0 when the bot loads the script
//     ~increment - increments the number
//     ~decrement - decrements the number

var count = 0;
listen(/~increment$/i, function(match, data, replyTo) {
    count++;
    saycount(replyTo);
});
listen(/~decrement$/i, function(match, data, replyTo) {
    count--;
    saycount(replyTo);
});
listen(/~reset ([0-9]+)$/i, function(match, data, replyTo) {
    count = parseInt(match[1]);
    saycount(replyTo);
});

function saycount(replyTo) {
    irc.privmsg(replyTo, "The count is now " + count);
}
