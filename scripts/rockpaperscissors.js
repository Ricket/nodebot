// (c) 2012 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~rps {r|p|s} - Play rock-paper-scissors.

function isValidRPS(choice) {
    return choice.length === 1 && "rps".indexOf(choice) !== -1;
}

listen(regexFactory.startsWith("rps"), function(match, data, replyTo) {
    var botChoice = Math.floor(Math.random() * 3);
    var playerChoice = match[1].toLowerCase();

    if (!isValidRPS(match[1])) {
        irc.privmsg(replyTo, "Usage: ~rps (r|p|s)");
        return;
    }

    var output = "chose ";
    if(botChoice == 0) {
        output += "rock";
    } else if(botChoice == 1) {
        output += "paper";
    } else {
        output += "scissors";
    }
    output += ". ";
    if(
        (playerChoice == 'r' && botChoice == 2) ||
        (playerChoice == 'p' && botChoice == 0) ||
        (playerChoice == 's' && botChoice == 1)
        ) {
        output += "You win!";
    } else if(
        (playerChoice == 'r' && botChoice == 0) ||
        (playerChoice == 'p' && botChoice == 1) ||
        (playerChoice == 's' && botChoice == 2)
        ) {
        output += "We tied. How about a nice game of chess?";
    } else {
        output += "You lose. :-P";
    }

    irc.action(replyTo, output);
});

