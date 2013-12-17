// (c) 2012 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     some url - look up the url's title and announce it

var request = require('request'),
    entities = require('./lib/entities'),
    fs = require('fs'),
    exec = require('child_process').exec;

listen(/PRIVMSG [^ ]+ :.*\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?]))/i, function(match, data, replyTo) {
    var url = match[1];

    if(url.indexOf('http') != 0) {
        url = 'https://' + url;
    }

    var requestObject = {
        uri: url,
        strictSSL: false,
        timeout: 10000,
        encoding: null,
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
        } else if(response.headers['content-type'] && response.headers['content-type'].toLowerCase().indexOf('image') > -1) {
            var hostname = response.request.host;
            // Image
            var tmpFilename = "/tmp/nodebotimg" + (""+Math.random()).substr(2);

            var imgExtensionMatch = /(\.[a-zA-Z0-9]{3,4})$/.exec(url),
                imgExtension = ".png";
            if (imgExtensionMatch != null) {
                imgExtension = imgExtensionMatch[1];
            }
           
            console.log("Writing file " + tmpFilename + imgExtension); 
            fs.writeFile(tmpFilename + imgExtension, body, { encoding: 'binary' }, function (err1) {
                if (err1) {
                    console.error(err1);
                    return;
                }

                console.log("Executing tesseract on file");
                exec('tesseract "' + tmpFilename + imgExtension + '" "' + tmpFilename + '"', { timeout: 90000 }, function (err2, stdout, stderr) {
                    fs.unlink(tmpFilename + imgExtension);

                    if (err2) {
                        console.error(err2);
                        fs.unlink(tmpFilename + ".txt");
                        return;
                    }

                    console.log("Reading tesseract output from " + tmpFilename + ".txt");
                    fs.readFile(tmpFilename + ".txt", function (err3, data) {
                        fs.unlink(tmpFilename + ".txt");
                        if (err3) {
                            console.err(err3);
                            return;
                        }

                        data = irc.sanitize(data.toString())
                            .replace(/\\r/g, " ").replace(/\\n/g, " ").replace(/^ +| +$/g, "");
                        if (data.length > 0) {
                            irc.privmsg(replyTo, hostname + " : " + data.substr(0, (400 - hostname.length)), false);
                        } else {
                            irc.privmsg(replyTo, hostname + " : [image, no text found]");
                        }
                    });
                });
            });
        } else {
            var titleMatch = /<title(?: [^>]+)?>([^<]+)<\/title>/i.exec(body.toString("utf8")),
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

                irc.privmsg(replyTo, hostname + " : " + title, false);
            } else {
                irc.privmsg(replyTo, hostname + " : title not found");
            }
        }
    });
});

