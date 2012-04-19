var GooDataExtractor = function () {};
 
GooDataExtractor.prototype.extract = function (key, delimiters, target, callback) {
    this.mineData(key, function (data) { 
    	delimiters = delimiters.replace(' ', '');
		delimiters = delimiters.split(',');

		var i = 0;
		var sheetName = '';
		var result = new Array();

		for(i = 0; i <= data.length; i++) {
			if(typeof data[i] != 'undefined') {
				parsed = JSON.parse(data[i]);
				sheetName = parsed.feed.title.$t;

				for(j = 0; j <= parsed.feed.entry.length; j++) {
					if(typeof parsed.feed.entry[j] != 'undefined') {
						result[delimiters[0] + sheetName + '-' + parsed.feed.entry[j].title.$t + delimiters[1]] = parsed.feed.entry[j].content.$t;
					}
				}
			}
		}
		callback(result, target);
	});
}
 
GooDataExtractor.prototype.mineData = function (key, callback) {
	var http = require('http');

	var rawData;

	var xml = new Array();
	var i = 0;

	(function download() {
		i++;
		rawData = '';

		var link = '/feeds/cells/' + key + '/' + i + '/public/values?alt=json';

		var options = {
			host: 'spreadsheets.google.com',
			port: 80,
			path: link
		};

		http.get(options, function(res) {
			res.setEncoding('utf-8');

			res.on('data', function (chunk) {
				rawData += chunk;
			});
	 
			res.on('end', function () {
				if(res.statusCode == 200) {
					xml.push(rawData);
					download();
				} else {
					callback(xml);
				}
			});
		})
	}());
}

module.exports = GooDataExtractor;