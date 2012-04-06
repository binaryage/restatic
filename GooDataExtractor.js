var GooDataExtractor = function () {};
 
GooDataExtractor.prototype.extract = function (key, delimiters, callback) {
    /*
    this.mineData(key, 1, function (data) { 
    	console.log('------------------------------------------------');
  		console.log(data);
  		// callback(data);
	});
	*/

	delimiters = delimiters.replace(' ', '');
	delimiters = delimiters.split(',');

	callback(GooDataExtractor.prototype.parseContentToArray(delimiters, ''));
}
 
GooDataExtractor.prototype.parseContentToArray = function (delimiters, data) {
	var parsed = new Array();

    parsed[delimiters[0] + 'Posts-B2' + delimiters[1]] = 'Data 1';
    parsed[delimiters[0] + 'Posts-B3' + delimiters[1]] = 'Data 2';
 
    return parsed;
}

GooDataExtractor.rawData = '';
GooDataExtractor.sheetNumber = 1;
 
GooDataExtractor.prototype.mineData = function (key, sheet, callback) {
        var http = require('http');

        var state = '';
        var rawData;

		var link = '/feeds/cells/' + key + '/' + sheet + '/public/values';
 
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
				if(rawData.length < 60) {
					if(GooDataExtractor.rawData.substring(0, 9) == 'undefined') {
						GooDataExtractor.rawData = GooDataExtractor.rawData.substring(9, GooDataExtractor.rawData.length);
					}

					console.log(GooDataExtractor.rawData);
					// callback(GooDataExtractor.rawData);
				} else {
					GooDataExtractor.rawData += rawData;
					GooDataExtractor.sheetNumber++;
					GooDataExtractor.prototype.mineData(key, GooDataExtractor.sheetNumber);
					rawData = '';
				}
			});
		})
}

module.exports = GooDataExtractor;