// (c) 2012 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     some url - look up the url's title and announce it

var request = require('request'),
    entities = require('./lib/entities');

listen(/\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?]))/i, function(match, data, replyTo) {
    var url = match[0];

    if(url.indexOf('http') != 0) {
        url = 'https://' + url;
    }

    var requestObject = {
        uri: url,
        strictSSL: false,
        timeout: 10000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31 Nodebot'
        }
    };

    request(requestObject, function(error, response, body) {
        if(error) {
            if((""+error).indexOf('SSL routines') < 0) {
                irc.privmsg(replyTo, "Error looking up URL: " + error);
            }
        } else if(response.statusCode != 200) {
            // Ignore 403 Access Forbidden; some websites block bots with this
            // code (e.g. Wikipedia).
            if(response.statusCode != 403) {
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

