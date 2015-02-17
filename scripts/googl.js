// (c) 2015 Erik Weber, Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

require('./config.js');
var googl = require('goo.gl');

googl.setKey(nodebot_prefs.google_api_key);

listen(regexFactory.startsWith("googl"), function(match, data, replyTo) {
   googl.shorten(match[1])
        .then(function(result) {
            irc.privmsg(replyTo, result);
         })
         .catch(function(err) {
            console.error("goo.gl error: ", err);
         });
});
