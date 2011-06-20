// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~smack user - smacks user with a random object

var smackobjects = ["smelly fish", "tin pot", "frying pan", "mouse", "keyboard", "fly swatter", "old boot"];

listen(/^:([^!]+)!.*PRIVMSG [^ ]+ :~smack (.*)$/i, function(match, data, replyTo) {
	var smackidx = Math.floor(Math.random()*smackobjects.length);
	if(match[2].toUpperCase() == "ME" || match[2].toUpperCase() == "YOU" ||
			match[2].toUpperCase() == "HIMSELF" || 
			match[2].toUpperCase() == "HERSELF" || 
			match[2].toUpperCase() == "ITSELF" || 
			match[2].toUpperCase() == "SELF" || 
			match[2].toUpperCase() == nodebot_prefs.nickname.toUpperCase()) {
		irc.action(replyTo, "smacks "+match[1]+" with a "+smackobjects[smackidx]+".");
	} else {
		irc.action(replyTo, "smacks "+match[2]+" with a "+smackobjects[smackidx]+".");
	}
});
