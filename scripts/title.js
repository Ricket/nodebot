// (c) 2012 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     some url - look up the url's title and announce it

var http = require('http'),
    entities = require('./lib/entities');

listen(/\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?]))/i, function(match, data, replyTo) {
	var url = match[0];
    var req = http.request(url, function(res) {
        if(res.statusCode != 200) {
            // Ignore 403 Access Forbidden; some websites block bots with this
            // code (e.g. Wikipedia).
            if(res.statusCode != 403) {
                irc.privmsg(replyTo, "" + res.statusCode);
            }
            req.abort();
        } else if(res.headers['content-type'] &&
                  res.headers['content-type'].toLowerCase().indexOf("text/html") == -1) {
            // Not an HTML page
            req.abort();
        } else {
            var data = "";
            var titleFound = false;

            var hostname = require('url').parse(url).hostname;

            res.on('data', function(chunk) {
                data += chunk;

                var titleMatch = /<title>([^<]+)<\/title>/i.exec(data);
                if(titleMatch && titleMatch[1]) {
                    titleFound = true;

                    var title = titleMatch[1];
                    
                    // replace multi-spaces/newlines with spaces
                    title = title.replace(/\s{2,}/g," ");
                    
                    // trim front and back
                    title = title.replace(/^\s+/,"");
                    title = title.replace(/\s+$/,"");
                    
                    // decode HTML entities
                    title = entities.decode(title);

                    irc.privmsg(replyTo, hostname + " : " + title);
                    res.pause();
                    res.destroy();
                    req.abort();
                }
            });
            res.on('end', function() {
                if(!titleFound) {
                    irc.privmsg(replyTo, hostname + " : title not found");
                    res.destroy();
                }
            });
        }
    }).on('error', function(e) {
        irc.privmsg(replyTo, "Error looking up URL: " + e.message);
    });
    req.end();
});
