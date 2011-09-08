// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~tell someone something - Saves the message to tell the person when they get back
//     On user join, looks to see if the new person has any saved messages and if so, says them

var messages;
try {
        messages = fs.readFileSync('data/tell.txt', 'ascii');
        if(!messages) messages = "";
        messages = messages.split('\n');
} catch(err) {messages = [];}

function addMessage(room, user, message) {
        messages.push(room+"#"+user+": "+message);

        fs.writeFileSync('data/tell.txt', messages.join('\n'), 'ascii');
}

function getMessages(room, user) {
        var userMessages = [];
		var searchString = room+"#"+user+": ";
        for(var i=0; i<messages.length; i++) {
                var idx = messages[i].toLowerCase().indexOf(searchString.toLowerCase());
                if(idx == 0) {
                        userMessages.push(messages[i].substr(searchString.length));
                        messages.splice(i, 1);
                        i--;
                }
        }
        return userMessages;
}

listen(/:([^!]+)!.*PRIVMSG ([^ ]+) :~tell ([^ ]+) (.+)$/i, function(match) {
        addMessage(match[2], match[3], match[1]+" told me to tell you: "+match[4]);

	irc.privmsg(match[2], "I'll tell them when they get back.");
});

// listen for join
listen(/:([^!]+)!.*JOIN :(.*)$/i, function(match) {
	// search tell folder for any messages to give
        var userMessages = getMessages(match[2], match[1]);
        for(var i=0; i<userMessages.length; i++) {
                irc.privmsg(match[2], match[1]+": "+userMessages[i]);
        }
});
