var GooDataExtractor = function () {};
 
GooDataExtractor.prototype.extract = function (key, delimiter) {
        console.log(key);
        console.log(delimiter);
 
        var importedData = this.mineAndParseContentToArray(key);
        return importedData;
}
 
GooDataExtractor.prototype.parseContentToArray = function (data) {
        var parsed = new Array();
        parsed['/-Posts-B2/'] = 'Data 1';
        parsed['/-Posts-B3/'] = 'Data 2';
 
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
 
GooDataExtractor.prototype.mineAndParseContentToArray = function (key) {
    this.mineData(key, 1, function (data) { 
    	console.log('------------------------------------------------');
  		console.log(data);
  		// callback(data);
	});
}
 
module.exports = GooDataExtractor;