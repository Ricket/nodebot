// (c) 2015 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~mdn - search the Mozilla Developer Network webpage and return first result

require('./config.js');
var entities = require('./lib/entities'),
    fs = require('fs'),
    exec = require('child_process').exec,
    googl = require('goo.gl');

googl.setKey(nodebot_prefs.google_api_key);

var request = require('request').defaults({
    strictSSL: false,
    timeout: 10000,
    encoding: 'utf8',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36'
    }
});

listen(regexFactory.startsWith('mdn'), function (match, data, replyTo) {
    var searchQuery = encodeURIComponent(match[1].trim()).trim(),
        url = 'https://developer.mozilla.org/en-US/search.json?q=' + searchQuery;

    if (searchQuery === '') return;

    console.log('Looking up MDN URL: ' + url);

    request({url: url}, function (error, response) {
        if (error) {
            console.log('Error: ', error);
            return;
        }
        if (!response.body || response.body === "") {
            console.log('MDN response empty or no data');
            irc.privmsg(replyTo, "[MDN] No response");
            return;
        }

        var mdnJson;
        try {
            mdnJson = JSON.parse(response.body);
        } catch (e) {
            console.log('MDN return invalid JSON: ', response.body);
            return;
        }

        if (mdnJson == null || mdnJson.documents == null) {
            console.log('MDN response null or documents null');
            irc.privmsg(replyTo, "[MDN] No response");
            return;
        }

        if (mdnJson.documents.length == 0) {
            irc.privmsg(replyTo, "[MDN] No results");
            return;
        }

        var doc = mdnJson.documents[0];

        googl.shorten(doc.url)
            .then(function (shortUrl) {
                var cleanExcerpt = doc.excerpt.replace(/<[^>]+>/g, '')
                        .replace('&lt;', '<').replace('&gt;', '>');
                irc.privmsg(replyTo, irc.sanitize("[MDN] " + doc.title + " " + shortUrl +
                    " " + cleanExcerpt) + '\u2026', false);
            })
            .catch(function (err) {
                console.log('Error shortening MDN url: ', err);
                irc.privmsg(replyTo, "[MDN] " + doc.title + " " + doc.url);
            });

    });

});

