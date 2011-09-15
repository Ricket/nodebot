// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.
// https://github.com/Ricket/nodebot
require('./config.js');
var util = require('util'),
	net = require('net');
	fs = require('fs');
	vm = require('vm');
	repl = require('repl');
var irc = global.nodebot = (function () {
    var socket = new net.Socket();
    socket.setNoDelay(true);
    socket.setEncoding('ascii');
    var buffer = {
        b: new Buffer(4096),
        size: 0
    };
    var listeners = [];
    var ignorelist;
    try {
        ignorelist = fs.readFileSync('data/ignore.txt', 'ascii');
        if (!ignorelist) {
			ignorelist = "";
		}
        ignorelist = ignorelist.split('\n');
    } catch (err) {
        ignorelist = [];
    }

    function send(data) {
		if(!data || data.length == 0) {
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
    socket.on('data', function (data) {
        data = data.replace('\r', '');
        var newlineIdx;
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
        console.log("<- " + data);
        var user = (/^:([^!]+)!/i).exec(data);
		var i;
        if (user) {
            user = user[1];
            for (i = 0; i < ignorelist.length; i++) {
                if (ignorelist[i].toUpperCase() == user.toUpperCase()) {
                    // user is ignored
                    return;
                }
            }
        }
        var replyTo = null;
        if (data.indexOf('PRIVMSG') > -1) {
            var dest = (/^:([^!]+)!.*PRIVMSG ([^ ]+) /i).exec(data);
            if (dest) {
                if (dest[2].toUpperCase() == nodebot_prefs.nickname.toUpperCase()) {
                    replyTo = dest[1];
                } else {
                    replyTo = dest[2];
                }
            }
        }
        for (i = 0; i < listeners.length; i++) {
            match = listeners[i][0].exec(data);
            if (match) {
                try {
                    listeners[i][1](match, data, replyTo);
                } catch (err) {
                    console.log("caught error in script " + listeners[i][3] + ": " + err);
                }
                if (listeners[i][2]) {
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
		/* The following function would give full power to scripts;
		 * this is probably not desirable, but can sometimes be good
		 * for testing.
		raw: function(stuff) {
			send(stuff);
		},*/
        connect: function (host, port, nickname, username, realname) {
            var port = port || 6667;
            socket.connect(port, host, function () {
                send('NICK ' + sanitize(nickname));
                send('USER ' + sanitize(username) + ' localhost * ' + sanitize(realname));
            });
        },
        loadScripts: function () {
            socket.pause();
            listeners = [];
            var scripts = fs.readdirSync('scripts');
			var i,j;
            if (scripts) {
                for (i = 0; i < scripts.length; i++) {
                    if (scripts[i].substr(-3) == '.js') {
                        console.log("Loading script " + scripts[i] + "...");
                        var script = fs.readFileSync('scripts/' + scripts[i]);
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
                                listen: function (dataRegex, callback, once) {
                                    once = once || false;
                                    listeners.push([dataRegex, callback, once, scriptName]);
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
            if (!user || !message) return;
            // TODO split message into chunks so it doesn't exceed max length
            send("PRIVMSG " + sanitize(user) + " :" + sanitize(message));
        },
        action: function (channel, action) {
            if (!channel || !action) return;
            send("PRIVMSG " + sanitize(channel) + " :\x01ACTION " + sanitize(action) + "\x01");
        },
        /* ADDITIONAL GLOBAL IRC FUNCTIONALITY */
        ignore: function (user) {
            ignorelist.push(user);
            fs.writeFileSync('data/ignore.txt', ignorelist.join('\n'), 'ascii');
        },
        unignore: function (user) {
			var i;
            for (i = 0; i < ignorelist.length; i++) {
                if (ignorelist[i].toUpperCase() == user.toUpperCase()) {
                    ignorelist.splice(i, 1);
                    i--;
                }
            }
            fs.writeFileSync('data/ignore.txt', ignorelist.join('\n'), 'ascii');
        },
        chatignorelist: function (channel) {
            irc.chatmsg(channel, "Ignore list: " + sanitize(ignorelist.join(",")));
        }
    }
})(); // end of object 'irc'

process.on('uncaughtException', function (err) {
    console.log("caught error in script: " + err);
});

irc.loadScripts();
irc.connect(nodebot_prefs.server, nodebot_prefs.port, nodebot_prefs.nickname, nodebot_prefs.nickname, nodebot_prefs.realname);
repl.start();