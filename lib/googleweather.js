/* Modified version of node-googleweather by maxkueng
 * (Removed the celsius and kmh conversions)
 * Original library can be found at:
 * https://github.com/maxkueng/node-googleweather/
 *
MIT License

Copyright (c) 2011 Max Kueng (http://maxkueng.com/)
 
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
 
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var request = require('request');
var jsdom = require('jsdom');

Date.prototype.pad = function (n) {
	return (n < 10) ? '0' + n : n;
};

Date.prototype.toISODate = function () {
	return this.getFullYear() + '-'
		+ this.pad(this.getMonth() + 1) + '-'
		+ this.pad(this.getDate());
};

var get = function (callback, location, forecastDate) {
	var currentConditions = {
		'date' : null, 
		'condition' : null, 
		'temperature' : null, 
		'humidity' : null, 
		'wind' : {
			'direction' : null, 
			'speed' : null
		}
	};

	var forecast = [];

	var uri = 'http://www.google.com/ig/api?weather='
		+ escape(location);

	request({
		'method' : 'GET', 
		'uri' : uri, 
		'headers' : {
			'User-Agent' : 'Nintendo Gameboy/1.0'
		}
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			jsdom.env(body, [], 
				function(errors, window) {
					try {
						var document = window.document;
						var info = document.getElementsByTagName('forecast_information')[0];
						var current = document.getElementsByTagName('current_conditions')[0];
						var forecasts = document.getElementsByTagName('forecast_conditions');

						var baseDateString = info.getElementsByTagName('forecast_date')[0].getAttribute('data');
						var baseDate = new Date(baseDateString);

						currentConditions.date = baseDateString;
						currentConditions.condition = current.getElementsByTagName('condition')[0].getAttribute('data');
						currentConditions.temperature = current.getElementsByTagName('temp_f')[0].getAttribute('data');

						var humidityString =  current.getElementsByTagName('humidity')[0].getAttribute('data');
						currentConditions.humidity = /(\d+)%/.exec(humidityString)[1];

						var windString =  current.getElementsByTagName('wind_condition')[0].getAttribute('data');
						var windMatches = /([NESW]+)\sat\s([0-9]+)\smph/.exec(windString);
						currentConditions.wind.direction = windMatches[1];
						currentConditions.wind.speed = windMatches[2];

						for (var i = 0; i < forecasts.length; i++) {
							var d = new Date(baseDate.getTime() + ( i * 24 * 3600 * 1000 ));
							var condition = forecasts[i].getElementsByTagName('condition')[0].getAttribute('data');
							var lowTemp = forecasts[i].getElementsByTagName('low')[0].getAttribute('data');
							var highTemp = forecasts[i].getElementsByTagName('high')[0].getAttribute('data');

							var forecastDay = {
								'date' : d.toISODate(), 
								'condition' : condition, 
								'temperature' : {
									'low' : lowTemp, 
									'high' : highTemp
								}
							};

							forecast[d.toISODate()] = forecastDay;
						}

						callback(currentConditions, forecast[forecastDate]);	
					} catch(err) {
						callback(null, null);
						return;
					}
				}
			);
		}
	});
};

exports.get = get;