// (c) 2013 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

var number = {};

function newNumber() {
    return Math.ceil(Math.random() * 100);
}

function isPlaying(replyTo) {
    return number[replyTo] != null || number[replyTo] === 0;
}

listen(regexFactory.startsWith(["numbergame", "number game", "numgame"]), function (match, data, replyTo, from) {
    if (!isPlaying(replyTo)) {
        number[replyTo] = newNumber();
        irc.action(replyTo, "chose a number between 1 and 100 inclusive. Guess the number! Make sure to mention my name.");
    } else {
        irc.privmsg(replyTo, from + ": I already chose a number, keep guessing!");
    }
});

listen(regexFactory.matches("([0-9]{1,3})"), function (match, data, replyTo, from) {
    if (isPlaying(replyTo)) {
        var userNumber = parseInt(match[1]),
            message = from + ": " + userNumber + " is ";
        if (userNumber < number[replyTo]) {
            message += "too low";
        } else if (userNumber > number[replyTo]) {
            message += "too high";
        } else {
            message += "correct! " + from + " wins!";
            number[replyTo] = null;
        }
        irc.privmsg(replyTo, message);
    }
});

