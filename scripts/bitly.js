// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

/* Unfortunately the bitly library is currently broken, so the following
 * not only is incomplete, but wouldn't work anyway.

require('./config.js');
var Bitly = require('bitly').Bitly;
var bitly = new Bitly(nodebot_prefs.bitly_username, nodebot_prefs.bitly_apikey);

listen(regexFactory.startsWith("bitly"), function(match, data, replyTo) {
    bitly.shorten(match[1], function(result) {
        console.log(util.inspect(result));
    });
});
*/
