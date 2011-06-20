// (c) 2011 Richard Carter
// This code is licensed under the MIT license; see LICENSE.txt for details.

// This script handles the following functions:
//     ~weather [location] - gives today's and tomorrow's weather in the given location, or the default location specified in config.js

Date.prototype.pad = function (n) {
	return (n < 10) ? '0' + n : n;
};

Date.prototype.toISODate = function () {
	return this.getFullYear() + '-'
		+ this.pad(this.getMonth() + 1) + '-'
		+ this.pad(this.getDate());
};

var googleweather = require('./lib/googleweather.js');

listen(/PRIVMSG [^ ]+ :~weather$/i, function(match, data, replyTo) {
	sayLocation(replyTo, nodebot_prefs.default_location);
});
listen(/PRIVMSG [^ ]+ :~weather (.*)$/i, function(match, data, replyTo) {
	sayLocation(replyTo, match[1]);
});

function sayLocation(replyTo, location) {
	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate()+1);
	tomorrow = tomorrow.toISODate();
	try {
		googleweather.get(function (current, forecast) {
			if(current) {
				irc.privmsg(replyTo, 'Currently '+current.condition+', '+current.temperature+'\xB0F, '+current.humidity+'% humidity and wind '+current.wind.direction+' at '+current.wind.speed+' mph.');
			}
			if(forecast) {
				irc.privmsg(replyTo, 'Tomorrow, '+forecast.condition+', high '+forecast.temperature.high+'\xB0F, low '+forecast.temperature.low+'\xB0F.');
			}
		}, location, tomorrow);
	} catch(err) {}
}