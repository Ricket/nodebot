// (c) 2012 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     some url - look up the url's title and announce it

var request = require('request'),
    entities = require('./lib/entities');

listen(/\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?]))/i, function(match, data, replyTo) {
	var url = match[0];

    request(url, function(error, response, body) {
        if(error) {
            irc.privmsg(replyTo, "Error looking up URL: " + error);
        } else if(response.statusCode != 200) {
            // Ignore 403 Access Forbidden; some websites block bots with this
            // code (e.g. Wikipedia).
            if(res.statusCode != 403) {
                irc.privmsg(replyTo, "" + response.statusCode);
            }
        } else if(response.headers['content-type'] && response.headers['content-type'].toLowerCase().indexOf('text/html') == -1) {
            // Not an HTML page
        } else {
            var titleMatch = /<title>([^<]+)<\/title>/i.exec(body),
                hostname = response.request.host;

            if(titleMatch && titleMatch[1]) {
                var title = titleMatch[1];
                
                // replace multi-spaces/newlines with spaces
                title = title.replace(/\s{2,}/g," ");
                
                // trim front and back
                title = title.replace(/^\s+/,"");
                title = title.replace(/\s+$/,"");
                
                // decode HTML entities
                title = entities.decode(title);

                irc.privmsg(replyTo, hostname + " : " + title);
            } else {
                irc.privmsg(replyTo, hostname + " : title not found");
            }
        }
    });
});
