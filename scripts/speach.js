
listen(/^:([^!]+)!.*PRIVMSG [^ ]+ :.*fail.*$/i, function(match, data, replyTo) {
	var stop_talk;
	if (Math.random()*10>=4)
			stop_talk = true; //else implied, well maybe not
		else 
			stop_talk = false;
	if (!stop_talk) {
		irc.action(replyTo, "Haha failing.");
		stop_talk=true;
		setTimeout(function(){stop_talk=false},3000);
	}
});
listen(/^:([^!]+)!.*PRIVMSG [^ ]+ :.*lol.*$/i, function(match, data, replyTo) {
		
		var stop_talk;
		
		if (Math.random()*10>=4)
			stop_talk = true; //else implied, well maybe not
		else 
			stop_talk = false;
		var lolz =["lolz","LOL","ROFLOL","lol"]
		var lol = Math.floor(Math.random()*lolz.length);
		saylol = lolz[lol]
		if (!stop_talk) {
			irc.action(replyTo, saylol);
			stop_talk=true;
			setTimeout(function(){stop_talk=false},3000);
		}

});