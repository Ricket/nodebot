// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~secret password - authenticate to become an admin
//     ~makeadmin user - make user an admin
//     ~unadmin user - demote user from admin status
//     ~admins - list admins
//     ~ignore user - the bot will no longer respond to messages from [user]
//     ~unignore user - the bot will once more respond to messages from [user]
//     ~reload - reload scripts

var admins;
try {
	admins = fs.readFileSync('data/admins.txt', 'ascii');
	if(!admins) admins = "";
	admins = admins.split('\n');
} catch(err) {admins = [];}


listen(/^:([^!]+).*~secret (.*)$/i, function(match) {
	if(isAdmin(match[1])) {
		irc.privmsg(match[1], "You are already an admin.");
	} else {
		if(match[2] == nodebot_prefs.secret) {
			addAdmin(match[1]);
			irc.privmsg(match[1], "You are now an admin.");
		}
	}
});

listen_admin(/^:([^!]+).*~makeadmin (.*)$/i, function(match) {
	if(isAdmin(match[2])) {
		irc.privmsg(match[1], match[2]+" is already an admin.");	
	} else {
		addAdmin(match[2]);
		irc.privmsg(match[1], match[2]+" is now an admin.");
	}
});

listen_admin(/^:([^!]+).*~unadmin (.*)$/i, function(match) {
	if(isAdmin(match[2])) {
		removeAdmin(match[2]);
		irc.privmsg(match[1], match[2]+" is no longer an admin.");
	} else {
		irc.privmsg(match[1], match[2]+" isn't an admin");
	}
});

function isAdmin(username) {
	for(var i=0; i<admins.length; i++) {
		if(admins[i].toUpperCase() == username.toUpperCase()) return true;
	}
	return false;
}

function addAdmin(username) {
	admins.push(username);

	fs.writeFileSync('data/admins.txt', admins.join('\n'), 'ascii');
}

function removeAdmin(username) {
	for(var i=0; i<admins.length; i++) {
		if(admins[i].toUpperCase() == username.toUpperCase()) {
			admins.splice(i,1);
			i--;
		}
	}
	
	fs.writeFileSync('data/admins.txt', admins.join('\n'), 'ascii');
}

listen(/:([^!]+)!.*PRIVMSG (.*) :~admins/i, function(match, data, replyTo) {
	irc.privmsg(replyTo, "Admins: "+admins.join(","));
});

function listen_admin(regex, listener) {
	listen(/^:([^!]+)/i, function(match, data, replyTo) {
		if(isAdmin(match[1])) {
			var match = regex.exec(data);
			if(match) {
				try {
					listener(match, data, replyTo);
				} catch(err) {
					console.log("caught error in admin script: "+err);
				}
			}
		}
	});
}

listen_admin(/^:([^!]+).*~ignore (.+)$/i, function(match) {
	if(isAdmin(match[2])) {
		irc.privmsg(match[1], match[2]+" is an admin, can't be ignored");
		return;
	}
	
	irc.ignore(match[2]);
	irc.privmsg(match[1], match[2]+" is now ignored.");
});

listen_admin(/^:([^!]+)!.*~unignore (.*)$/i, function(match) {
	irc.unignore(match[2]);
	irc.privmsg(match[1], match[2]+" unignored");
});

listen_admin(/~ignorelist$/i, function (match, data, replyTo) {
	irc.chatignorelist(replyTo);
});

listen_admin(/^:([^!]+)!.*~reload$/i, function(match) {
	irc.loadScripts();
});
