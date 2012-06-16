var GoogleSpreadsheetDataExtractor = function () {};

GoogleSpreadsheetDataExtractor.prototype.extract = function (config, callback) {
    this.mineData(config.apiKey, function (data) {
        var delimiters = config.delimiters;

        var sheetName = '';
        var result = {};
        
        for(var i = 0; i <= data.length; i++) {
            if(typeof data[i] != 'undefined') {
                var parsed = JSON.parse(data[i]);
                sheetName = parsed.feed.title.$t;

                for(var j = 0; j <= parsed.feed.entry.length; j++) {
                    if(typeof parsed.feed.entry[j] != 'undefined') {
                        result[delimiters[0] + sheetName + '-' + parsed.feed.entry[j].title.$t + delimiters[1]] = parsed.feed.entry[j].content.$t;
                    }
                }
            }
        }
        callback(result, config);
    }, config.cursor);
}
 
GoogleSpreadsheetDataExtractor.prototype.mineData = function (key, callback, cursor) {
    var http = require('http');

    var xml = [];

    var download = function(sheet) {
        var rawData = '';

        var link = '/feeds/cells/' + key + '/' + sheet + '/public/values?alt=json';

        var options = {
            host: 'spreadsheets.google.com',
            port: 80,
            path: link
        };

        if (cursor) {
            cursor.cyan().write(' @ Fetching ').blue().write("http://"+options.host+':'+options.port+options.path).reset();
        }
        http.get(options, function(res) {
            res.setEncoding('utf-8');

            res.on('data', function (chunk) {
                rawData += chunk;
            });

            res.on('end', function () {
                if(res.statusCode == 200) {
                    if (cursor) {
                        cursor.write(" ... OK\n");
                    }
                    xml.push(rawData);
                    download(sheet+1);
                } else {
                    if (cursor) {
                        cursor.write(" ... DONE\n");
                    }
                    callback(xml);
                }
            });
        })
    };

    // start downloading sheet 1
    download(1);
}

module.exports = GoogleSpreadsheetDataExtractor;