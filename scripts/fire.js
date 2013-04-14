var OBJECTS = ["pants", "house", "cat", "mouse"],
    object_on_fire = null;

listen(regexFactory.only("fire"), function(match, data, replyTo) {
    if (!object_on_fire) {
        object_on_fire = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
    }
    irc.action(replyTo, "HELP!!! My " + object_on_fire + " is on fire!!! Please ~douse it!");
});

listen(regexFactory.only("douse"), function(match, data, replyTo) {
    if (object_on_fire) {
        irc.action(replyTo, "Thank you for saving my " + object_on_fire + "!");
        object_on_fire = null;
    }
    else {
        irc.action(replyTo, "You got my stuff wet; why'd you do that?!");
    }
});
