// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     Holds onto a number which starts at 0 when the bot loads the script
//     ~increment   - increments the number
//     ~decrement   - decrements the number
//     ~reset [num] - resets count to num or 0

var count = 0;

function announceCount(replyTo) {
    irc.privmsg(replyTo, "The count is now " + count);
}

listen(regexFactory.only("increment"), function(match, data, replyTo) {
    count++;
    announceCount(replyTo);
});

listen(regexFactory.only("decrement"), function(match, data, replyTo) {
    count--;
    announceCount(replyTo);
});

listen(regexFactory.startsWith("reset"), function(match, data, replyTo) {
    count = parseInt(match[1]) || 0;
    announceCount(replyTo);
});

