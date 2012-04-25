var ansi = require('ansi');
var cursor = ansi(process.stdout);
var rimraf = require('rimraf');
var wrench = require('wrench');
var fs = require('fs');
var path = require('path');

var Environment = function () {};

Environment.conf = {};

Environment.prototype.prepare = function (lineArgs, configFile) {
	var defaultExtractor = 'GoogleSpreadsheetDataExtractor';

	// Load
	this.loadLineArgs(lineArgs);
	this.loadConfigFile(configFile);
	this.loadExtractor(defaultExtractor);

	// Prepare environment
	this.prepareEnvironment();

	// Check the result
	if(this.checkResults()) {
		return Environment.conf;
	} else {
		return false;
	}
}

Environment.prototype.loadExtractor = function (defaultExtractor) {
	var extractor = Environment.conf.extractor;
	var nativeExtractor = __dirname + '/extractors/' + extractor + '.js';
	defaultExtractorFullPath = __dirname + '/extractors/' + defaultExtractor + '.js';
	
	if(!path.existsSync(extractor)) { // Check if given extractor exists
		if(!path.existsSync(nativeExtractor)) { // Check if given extractor exists in extractors dir
			extractor = defaultExtractorFullPath; // Set default extractor exists
			Environment.conf.extractorName = defaultExtractor;
		} else {
			Environment.conf.extractorName = extractor;
			extractor = nativeExtractor;
		}
	}

	Environment.conf.extractor = extractor;
}

Environment.prototype.prepareEnvironment = function () {
	if((Environment.conf.mode != 'fetch') && ((typeof Environment.conf.source != 'undefined') || (typeof Environment.conf.target != 'undefined')))  {
		if(Environment.conf.target == './_site/') {
			var dirName = '/tmp/restatic_temp/';

			// Create temporary target
			fs.mkdirSync(dirName, 0777);

			// Copy source to temporary target
			wrench.copyDirSyncRecursive(Environment.conf.source, dirName);

			// Remove existing target
			rimraf.sync(Environment.conf.target);

			// Create target
			fs.mkdirSync(Environment.conf.target, 0777);

			// Copy source to target
			wrench.copyDirSyncRecursive(dirName, Environment.conf.target);

			// Remove temporary target
			rimraf.sync(dirName);
		} else {
			// Remove existing target
			rimraf.sync(Environment.conf.target);

			// Create target
			fs.mkdirSync(Environment.conf.target, 0777);

			// Copy source to target
			wrench.copyDirSyncRecursive(Environment.conf.source, Environment.conf.target);
		}
		
		rimraf(Environment.conf.target + '/.git', function (result) {
			rimraf(Environment.conf.target + '/.gitignore', function (result) {
				rimraf(Environment.conf.target + '/_site', function (result) {
					rimraf(Environment.conf.target + '/.DS_Store', function (result) {
						rimraf(Environment.conf.target + '/restatic.json', function (result) {
		
						});	
					});
				});
			});
		});
	}
}

Environment.prototype.loadConfigFile = function (fileName) {
	if(typeof Environment.conf.source != 'undefined') {
		var contents = fs.readFileSync(Environment.conf.source + fileName);
  		var config = JSON.parse(contents);
  	}

  	if(typeof config != 'undefined') {
  		Environment.conf.apiKey = config.apiKey;
  		Environment.conf.delimiter = config.delimiter;
		Environment.conf.extractor = config.extractor;
  	}
}

Environment.prototype.fixEndingSlash = function (path) {
	if(path.charAt(path.length - 1) != '/') {
		return path + '/';
	} else {
		return path;
	}
}

Environment.prototype.loadLineArgs = function (args) {
	var checked = true;

	if(args[0] != '-d')  {
		if(typeof args[0] != 'undefined') {
			Environment.conf.source = this.fixEndingSlash(path.resolve(args[0]));
		} else {
			checked = false;
		}

		if(typeof args[1] != 'undefined') {
			Environment.conf.target = this.fixEndingSlash(path.resolve(args[1]));
		} else {
			checked = false;
		}

		if(typeof args[2] != 'undefined') {
			Environment.conf.mode = args[2];
		}
	} else {
		Environment.conf.source = './';
		Environment.conf.target = './_site/';
		Environment.conf.mode = args[1];
	}

	return checked;
}

Environment.prototype.storeResult = function (data, target) {
	// Get length
	var i = 0;
	for(var key in data) {i++}
	var length = i
	i = 0;  

	var json = '{';
	for(var key in data) {
  		json += '"' + key + '" : "' + data[key] + '"';

  		// Is last
  		if((i + 1) != length) {
			json += ', ';
  		}
  		i++;
	}
	json += '}';

	var log = fs.createWriteStream(target + 'data.json', {'flags': 'w'});
	log.end(json + "\n");
	cursor.green().write('Data fetched in ').blue().write(target + 'data.json').reset().reset().write("\n");
}

Environment.prototype.loadData = function (source, target, callback) {
	callback(JSON.parse(fs.readFileSync(target + 'data.json').toString()), target);
}

Environment.prototype.checkResults = function () {
	var result = true;

	if(typeof Environment.conf.source != 'undefined') {
		if(!path.existsSync(Environment.conf.source)) {
			cursor.red().write('Source dir doesn\'t exists.').reset().write("\n");
			result = false;
		}
	} else {
		cursor.red().write('Source dir isn\'t specified correctly in config file.').reset().write("\n");
		result = false;
	}

	if(typeof Environment.conf.target != 'undefined') {
		if(!path.existsSync(Environment.conf.target)) {
			// Create target
			fs.mkdirSync(Environment.conf.target, 0777);
		}
	} else {
		cursor.red().write('Target dir isn\'t specified correctly in config file.').reset().write("\n");
		result = false;
	}

	if(typeof Environment.conf.apiKey == 'undefined') {
		cursor.red().write('API key isn\'t specified correctly in configfile.').reset().write("\n");
		result = false;
	}

	if(typeof Environment.conf.delimiter == 'undefined') {
		cursor.red().write('Delimiter isn\'t specified correctly in configfile.').reset().write("\n");
		result = false;
	}

	return result;
}

module.exports = Environment;