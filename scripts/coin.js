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

function isTwoHeaded(number) {
    return isHeads(number) && Math.abs(number - 0.1337) < 0.009001;
}

function flipCoin(replyTo, from, expectFunction) {
    var flip = Math.random(),
        message = from + ": " + (isHeads(flip) ? "Heads!" : "Tails!");
    
    if (expectFunction) {
        message += expectFunction(flip) ? " You win!" : " You lose.";
    }

    var flipMessage = isTwoHeaded(flip) ? "flips a two-headed coin..." : "flips a coin...";
    irc.action(replyTo, flipMessage);
    setTimeout(function() {
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

