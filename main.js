// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.
// https://github.com/Ricket/nodebot
require('./config.js');
var util = require('util'),
    net = require('net'),
    fs = require('fs'),
    vm = require('vm'),
    repl = require('repl'),
    _ = require('lodash'),
    listdb = require('./lib/listdb');

var irc = global.nodebot = (function () {
    var buffer, ignoredb, listeners, socket;

    socket = new net.Socket();
    socket.setNoDelay(true);
    socket.setEncoding('ascii');

    buffer = {
        b: new Buffer(4096),
        size: 0
    };

    listeners = [];

    ignoredb = listdb.getDB('ignore');

    function send(data) {
        if (!data || data.length == 0) {
            console.log("ERROR tried to send no data");
            return;
        } else if (data.length > 510) {
            console.log("ERROR tried to send data > 510 chars in length: " + data);
            return;
        }
        socket.write(data + '\r\n', 'ascii', function () {
            console.log("-> " + data);
        });
    }

    socket.setTimeout(240 * 1000, function () {
        // If the connection is closed, this will fail to send and the 'error'
        // and 'close' events will trigger.
        send('VERSION');
    });

    socket.on('close', function () {
        process.exit();
    });

    socket.on('data', function (data) {
        var newlineIdx;
        data = data.replace('\r', '');
        while ((newlineIdx = data.indexOf('\n')) > -1) {
            if (buffer.size > 0) {
                data = buffer.b.toString('ascii', 0, buffer.size) + data;
                newlineIdx += buffer.size;
                buffer.size = 0;
            }
            handle(data.substr(0, newlineIdx));
            data = data.slice(newlineIdx + 1);
        }
        if (data.length > 0) {
            buffer.b.write(data, buffer.size, 'ascii');
            buffer.size += data.length;
        }
    });

    function handle(data) {
        var dest, i, user, replyTo;
        console.log("<- " + data);
        user = (/^:([^!]+)!/i).exec(data);
        if (user) {
            user = user[1];
            if (ignoredb.hasValue(user, true)) {
                return;
            }
        }
        replyTo = null;
        if (data.indexOf('PRIVMSG') > -1) {
            dest = (/^:([^!]+)!.*PRIVMSG ([^ ]+) /i).exec(data);
            if (dest) {
                if (dest[2].toUpperCase() == nodebot_prefs.nickname.toUpperCase()) {
                    replyTo = dest[1];
                } else {
                    replyTo = dest[2];
                }
            }
        }

        var match, regex;
        for (i = 0; i < listeners.length; i++) {
            if(_.isRegExp(listeners[i][0])) {
                match = listeners[i][0].exec(data);
            } else {
                regex = 'PRIVMSG [^ ]+ :';
                if(listeners[i][3] /* prefixed */) {
                   regex += nodebot_prefs.command_prefix;
                }
                regex += listeners[i][0] + "\\b";
                regex = new RegExp(regex, "i");
                match = regex.exec(data);
            }

            if (match) {
                try {
                    listeners[i][1](match, data, replyTo);
                } catch (err) {
                    console.log("caught error in script " + listeners[i][3] + ": " + err);
                }
                if (listeners[i][2] /* once */) {
                    listeners.splice(i, 1);
                    i--;
                }
            }
        }
    }

    function sanitize(data) {
        if (!data) {
            return data;
        }
        /* Note:
         * 0x00 (null character) is invalid
         * 0x01 signals a CTCP message, which we shouldn't ever need to do
         * 0x02 is bold in mIRC (and thus other GUI clients)
         * 0x03 precedes a color code in mIRC (and thus other GUI clients)
         * 0x04 thru 0x19 are invalid control codes, except for:
         * 0x16 is "reverse" (swaps fg and bg colors) in mIRC
         */
        return data.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[^\x02-\x03|\x16|\x20-\x7e]/g, "");
    }

    return {
        /* The following function gives full power to scripts;
         * you may want to no-op this function for security reasons, if you
         * don't vet your scripts carefully.
         */
        raw: function(stuff) {
            send(stuff);
        },
        connect: function (host, port, nickname, username, realname) {
            port = port || 6667;
            socket.connect(port, host, function () {
                send('NICK ' + sanitize(nickname));
                send('USER ' + sanitize(username) + ' localhost * ' + sanitize(realname));
            });
        },
        loadScripts: function () {
            var i, k, script, scripts;
            socket.pause();
            listeners = [];
            scripts = fs.readdirSync('scripts');
            if (scripts) {
                for (i = 0; i < scripts.length; i++) {
                    if (scripts[i].substr(-3) == '.js' &&
                            scripts[i].substr(-9) != '.child.js') {
                        console.log("Loading script " + scripts[i] + "...");
                        script = fs.readFileSync('scripts/' + scripts[i]);
                        if (script) {
                            var scriptName = scripts[i];
                            var sandbox = {
                                irc: irc,
                                nodebot_prefs: nodebot_prefs,
                                console: console,
                                setTimeout: setTimeout,
                                setInterval: setInterval,
                                vm: vm,
                                fs: fs,
                                require: require,
                                util: util,
                                listen: function (dataRegex, callback, once, prefixed) {
                                    once = !!once;
                                    if (typeof prefixed === "undefined" || prefixed === null) {
                                        prefixed = true;
                                    }
                                    listeners.push([dataRegex, callback, once, prefixed, scriptName]);
                                }
                            };
                            try {
                                vm.runInNewContext(script, sandbox, scripts[i]);
                            } catch (err) {
                                console.log("Error in script " + scripts[i] + ": " + err);
                                for (j = 0; j < listeners.length; j++) {
                                    if (listeners[j][3] == scriptName) {
                                        listeners.splice(j, 1);
                                        j--;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            try {
                socket.resume();
            } catch (err) {}
            console.log("Scripts loaded.");
        },

        /* IRC COMMANDS: */
        pong: function (server) {
            send("PONG :" + server);
        },
        join: function (channel, key) {
            var cmd = "JOIN :" + sanitize(channel);
            if (key) {
                cmd += " " + sanitize(key);
            }
            send(cmd);
        },
        part: function (channel) {
            send("PART :" + sanitize(channel));
        },
        privmsg: function (user, message) {
            if (user && message) {
                user = sanitize(user); //avoid sanitizing these more than once
                message = sanitize(message);
                
                var privmsg = "PRIVMSG " + user + " :";
                var max = 510 - privmsg.length;

                var maxmessages = 3;
                while (message && (maxmessages--) > 0) {
                    send(privmsg + message.slice(0, max));
                    message = message.slice(max);
                }
            }
        },
        action: function (channel, action) {
            if (channel && action) {
                send("PRIVMSG " + sanitize(channel) + " :\x01ACTION " + sanitize(action) + "\x01");
            }
        },

        /* ADDITIONAL GLOBAL IRC FUNCTIONALITY */
        ignore: function (user) {
            ignoredb.add(user);
        },
        unignore: function (user) {
            ignoredb.remove(user, true);
        },
        chatignorelist: function (channel) {
            irc.chatmsg(channel, "Ignore list: " + sanitize(ignoredb.getAll().join(",")));
        }
    }
})(); // end of object 'irc'

process.on('uncaughtException', function (err) {
    console.log("caught error in script: " + err);
});

irc.loadScripts();
irc.connect(nodebot_prefs.server, nodebot_prefs.port, nodebot_prefs.nickname, nodebot_prefs.username, nodebot_prefs.realname);

repl.start({ prompt: '> ', ignoreUndefined: true });
