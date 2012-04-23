var ansi = require('ansi');
var cursor = ansi(process.stdout);

var GoogleDocumentExtractor = function () {};

GoogleDocumentExtractor.prototype.extract = function (key, delimiters, target, callback) {
	// Demo data
	data = { 
		'/-General-A2-/': 'Your page title', 
		'/-General-B2-/': 'Restatic example', 
		'/-General-A3-/': 'Your page footer', 
		'/-General-B3-/': '(c) Binaryage 2012', 
		'/-Posts-B1-/': 'First post', 
		'/-Posts-B2-/': 'See project homepage on restatic.binaryage.com or'
	};

	callback(data, target);
}

module.exports = GoogleDocumentExtractor;