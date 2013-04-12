// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~dice|roll [XdY] - rolls a Y-sided die X times, defaults to 1d6; says the result

function printHelp(replyTo) {
    irc.privmsg(replyTo, "Usage: dice [XdY] - where X is number of dice (up "+
            "to 20) and Y is sides per die (up to 10000)");
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

function roll(dice, faces, replyTo) {
    var i, results = [];

    dice = clamp(dice, 1, 20);
    faces = clamp(faces, 1, 20);

    for(i = 0; i < dice; i++) {
        results.push( (Math.floor(Math.random() * faces) + 1).toString(10) );
    }
    irc.privmsg(replyTo, results.join(","));
}

listen(regexFactory.startsWith(['dice','roll']), function(match, data, replyTo) {
    if (match[1].trim().length === 0) {
        // If just dice/roll is said, roll a default 1d6
        roll(1, 6, replyTo);
        return;
    }

    var params = match[1].split('d');
    if (params.length !== 2) {
        printHelp(replyTo);
        return;
    }

    var num1 = parseInt(params[0].trim()),
        num2 = parseInt(params[1].trim());
    if (isNaN(num1) || isNaN(num2)) {
        printHelp(replyTo);
    } else {
        roll(num1, num2, replyTo);
    }
});

