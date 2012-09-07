var fire_objs = ["pants", "house", "cat", "mouse"];
var on_fire;
var isFire;

listen(/^:([^!]+)!.*PRIVMSG [^ ]+ :~fire$/i, function(match, data, replyTo) {
	var to_fire = Math.floor(Math.random()*fire_objs.length);
	on_fire = fire_objs[to_fire]
	irc.action(replyTo, "HELP!!! My "+on_fire+" is on fire!!!");
	isFire = true;
});

listen(/^:([^!]+)!.*PRIVMSG [^ ]+ :~douse$/i, function(match, data, replyTo) {
	if (isFire==true) {
		irc.action(replyTo, "Thank you for saving my "+on_fire+"!");
		isFire=false;
	}
	else {
		irc.action(replyTo, "You got me stuff wet, why'd you do that?!");
	}
});
listen(/^:([^!]+)!.*PRIVMSG [^ ]+ :~how's the fire\?$/i, function(match, data, replyTo) {
	irc.action(replyTo, "My " + on_fire + " " + isFire+"!");
});

//listen(/^.*fish.*/i,function(match,data,replyTo){
//	irc.action(replyTo, "I love fish!");
//});