// Libraries setup
var Environment = require('./Environment.js');
var SiteParser = require('./SiteParser.js');
var ansi = require('ansi');
var cursor = ansi(process.stdout);

// Libraries instances setup
var SiteParser = new SiteParser();
var Environment = new Environment();

// Config load
var config = Environment.prepare(process.argv.splice(2), 'restatic.json');

// Extractor setup
var Extractor = require(config.extractor);
var Extractor = new Extractor();

// Restatic
if (config) {
	cursor.green().write('Restatic started parsing html files from ').blue().write(config.source).reset().write(' to ').blue().write(config.target).write('\n').reset();
	Extractor.extract(config.googleSpreadSheetKey, config.delimiter, config.target, Environment.storeResult);  
} else {
	cursor.green().write("Usage: parse google docs spreadsheet content using 'restatic source_folder target_folder' or \'restatic -d\' if you want to generate site from actual location to folder _site '\n").reset();
}