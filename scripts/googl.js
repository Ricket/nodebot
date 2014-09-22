// (c) 2014 Erik Weber
// This code is licensed under the MIT license; see LICENSE.txt for details.

var googl = require('goo.gl');
googl.setKey(nodebot_prefs.googl_key);
listen(regexFactory.startsWith("googl"), function(match, data, replyTo) {
   googl.shorten(match[1])
        .then(function(result) {
            irc.privmsg(replyTo, result);
         })
         .catch(function(err) {
            console.log("goo.gl error: " + err.message);
         });
});
