// (c) 2015 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     Testing colors

var colors = {
    "00": "white",
    "01": "black",
    "02": "blue",
    "03": "green",
    "04": "red",
    "05": "brown",
    "06": "purple",
    "07": "orange",
    "08": "yellow",
    "09": "lime",
    "10": "teal",
    "11": "aqua",
    "12": "royal",
    "13": "fuchsia",
    "14": "grey",
    "15": "silver"
},
    colorCodes = Object.keys(colors);

listen(regexFactory.matches(['colortest', 'color test']), function (match, data, replyTo) {
    var msg = [];
    for (var color in colors) {
        msg.push("\x03" + color + ",99" + colors[color]);
    }
    irc.privmsg(replyTo, msg.join(' '));
});

var regexLetter = /[a-zA-Z]/;

listen(regexFactory.matches('taste the rainbow'), function (match, data, replyTo) {
    var str = "SKITTLES, TASTE THE RAINBOW",
        colored = "",
        colorIdx = 0;

    for (var idx = 0; idx < str.length; idx++) {
        var c = str[idx];
        if (!regexLetter.test(c)) {
            colored += c;
        } else {
            colored += "\x03" + colorCodes[colorIdx] + ",99" + c;
            colorIdx = (colorIdx + 1) % 16;
        }
    }
    irc.privmsg(replyTo, colored, false);

});
