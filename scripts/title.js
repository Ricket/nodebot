// (c) 2012 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     some url - look up the url's title and announce it

var entities = require('./lib/entities'),
    fs = require('fs'),
    exec = require('child_process').exec;

var request = require('request').defaults({
    strictSSL: false,
    timeout: 10000,
    encoding: 'utf8',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36'
    }
});

listen(/PRIVMSG [^ ]+ :.*?\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?]))/i, function(match, data, replyTo) {
    var url = match[1];

    if(url.indexOf('http') != 0) {
        url = 'http://' + url;
    }

    console.log('title: Found url: ' + url);

    var maxSize = 10485760;

    request({url: url, method: 'HEAD'}, function (error, headRes) {
        if (error) {
            if((""+error).indexOf('SSL routines') < 0) {
                irc.privmsg(replyTo, "Error looking up URL: " + error);
            }
            return;
        }

        var size = headRes.headers['content-length'];
        if (size && size > maxSize) {
            console.log('Page size too large: ' + size);
            return;
        }

        var req = request({url: url});
        req.on('error', function (error) {
            if((""+error).indexOf('SSL routines') < 0) {
                irc.privmsg(replyTo, "Error looking up URL: " + error);
            }
        });
        var hostname = "";
        req.on('response', function (response) {
            hostname = response.request.host;

            var statusCode = response.statusCode;
            if (statusCode != 200) {
                req.abort();
                // Ignore 403 Access Forbidden; some websites block bots with this
                // code (e.g. Wikipedia).
                if (statusCode != 403) {
                    irc.privmsg(replyTo, "" + response.statusCode);
                }
            }
        });

        var pageBody = "", foundTitle = false;
        req.on('data', function (data) {
            if (foundTitle) {
                return;
            }
            pageBody += data;
            if (pageBody.length > maxSize) {
                console.log('Page size exceeded limit (' + pageBody.length + ')');
                req.abort();
            }

            var titleMatch = /<title(?: [^>]+)?>([^<]+)<\/title>/i.exec(pageBody);

            if(titleMatch && titleMatch[1]) {
                req.abort();
                foundTitle = true;

                var title = titleMatch[1];
                
                // replace multi-spaces/newlines with spaces
                title = title.replace(/\s{2,}/g, " ");
                
                // trim front and back
                title = title.replace(/^\s+/, "");
                title = title.replace(/\s+$/, "");
                
                // decode HTML entities
                title = entities.decode(title);

                irc.privmsg(replyTo, hostname + " : " + title, false);
            }
        });

    });

});

