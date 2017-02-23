Nodebot - a [node.js](http://www.nodejs.org/) IRC bot
=====================================================

Prerequisites
-------------

- node.js
- npm
- Run `npm install` to install the dependencies listed in `package.json`

Configuration
-------------

Copy `config.js.sample` to `config.js` and then look in the file for all
configuration options. You can disable scripts by renaming them to a different
extension or deleting/moving them out of the scripts folder. To specify a channel 
**nodebot** must initialize by running it once to get the data folder. See 
Channels for for more information.

Running
-------

Just run `node main.js`. It will load the scripts and connect to the IRC server,
at which time the scripts should react to messages on the server (e.g.
autojoin.js will autojoin any channels, nickserv.js will identify with NickServ,
pong.js will send a PONG reply to every PING).

It also starts a REPL loop, so that you can run commands manually. So for
example, you could `nodebot.join('#room')` to cause the bot to join a room,
`nodebot.privmsg('#room', 'hi')` to make the bot talk in the room, or
`nodebot.loadScripts()` to reload the scripts. Refer to main.js for the
available functions in the `global.nodebot` object, or run
`require('util').inspect(nodebot)`.

Scripts
-------

Scripts are still under development, and the framework is such that one is not
able to programmatically create a list of the available commands. Thus, the
`help.js` script is rather useless and certainly not what one might expect. So
please refer to the top and contents of each script to find out what it does.
Each script has a comment at the top clearly explaining what the script does and
each command it makes available.

To trigger a script action, you can say "{botname}, {action}" or
"{prefix}{action}" where prefix is set in the config file.  For example,
"nodebot, help" or "~help". Some scripts don't react this way; the "say" script,
for example, doesn't require a prefix, so you can simply write "say something"
and the bot will reply "something".

For developing your own scripts, use the existing scripts as examples to make
your own.

Channels
-------
To join a channel edit `data/autojoin.txt` and add the hashtag. For more info
on the data folder see the [README](data/README)

__Example__
```terminal
#nodejs
#javascript
```

License
-------

(c) 2012 Richard Carter

This project is licensed under the MIT license; see LICENSE.txt for details.
