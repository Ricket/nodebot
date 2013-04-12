// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~translate language phrase - translates the phrase from English to the given language

var translate = require('translate');

listen(regexFactory.startsWith("translate"), function(match, data, replyTo) {
    var msgMatch = /^([^ ]+) (.*)$/.exec(match[1]);

    if (msgMatch) {
        translate.text({input: 'English', output: match[1]}, match[2], function(err, translation) {
            irc.privmsg(replyTo, translation);
        });
    } else {
        irc.privmsg(replyTo, "Usage: translate {language} {word or phrase}");
    }
});

