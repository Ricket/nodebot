// (c) 2014 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~coin|flip - randomly chooses heads or tails
//     ~heads     - ... and you win if it's heads
//     ~tails     - ... and you win if it's tails

function isHeads(number) {
    return number < 0.5;
}

function isTails(number) {
    return !isHeads(number);
}

function flipCoin(replyTo, from, expectFunction) {
    irc.action(replyTo, "flips a coin...");
    setTimeout(function() {
        var flip = Math.random(),
            message = from + ": " + (isHeads(flip) ? "Heads!" : "Tails!");
        
        if (expectFunction) {
            message += expectFunction(flip) ? " You win!" : " You lose.";
        }
        irc.privmsg(replyTo, message);
    }, 1000);
}

listen(regexFactory.only(["coin", "flip"]), function(match, data, replyTo, from) {
    flipCoin(replyTo, from);
});

listen(regexFactory.only(["heads"]), function(match, data, replyTo, from) {
    flipCoin(replyTo, from, isHeads);
});

listen(regexFactory.only(["tails"]), function(match, data, replyTo, from) {
    flipCoin(replyTo, from, isTails);
});

