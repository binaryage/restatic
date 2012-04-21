var ansi = require('ansi');
var cursor = ansi(process.stdout);

var Environment = function () {};

Environment.conf = {};
Environment.extractor = '';

Environment.prototype.prepare = function (lineArgs, configFile) {
	// Load raw data
	this.loadLineArgs(lineArgs);
	this.loadConfigFile(configFile);
	this.loadExtractor('./extractors/GooDataExtractor.js');

	// Fix it
	this.fixConf();

	// Prepare environment
	this.prepareEnvironment();

	// Check the result
	if(this.checkResults()) {
		Environment.conf.extractor = Environment.extractor;
		return Environment.conf;
	} else {
		return false;
	}
}

Environment.prototype.loadExtractor = function (defaultExtractor) {
	var path = require('path');

	if((Environment.conf.extractor != 'defaultExtractor') || (typeof Environment.conf.extractor != undefined)) {
		if(path.existsSync(Environment.conf.extractor)) {
			Environment.extractor = Environment.conf.extractor;
		} else  {
			Environment.extractor = defaultExtractor;	
		}
	} else {
		Environment.extractor = defaultExtractor;
	}

	Environment.conf.extractor = Environment.extractor;
}

Environment.prototype.prepareEnvironment = function () {
	if(Environment.conf.mode == 'process') {
		var rimraf = require('rimraf');
		var wrench = require('wrench');
		// Remove existing target
		rimraf.sync(Environment.conf.target);
		// Copy source to target
		wrench.copyDirSyncRecursive(Environment.conf.source, Environment.conf.target);
		
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

Environment.prototype.fixConf = function () {
	// Slice ending slash if exist
	if(Environment.conf.source.charAt(Environment.conf.source.length - 1) == '/') {
		Environment.conf.source = Environment.conf.source.slice(0, -1);
	}

	if(Environment.conf.source == '-d') {
		Environment.conf.source = './';
		Environment.conf.target = './_site';
	}
}

Environment.prototype.checkResults = function () {
	var fs = require('fs');
	var result = true;

	console.log('Testing validity of input data - config etc.');

	if(typeof Environment.conf.source) {
		targetStats = fs.lstatSync(Environment.conf.source);
		if(!targetStats.isDirectory()) {
			console.log('Source dir doesn\'t exists.');
			result = false;
		}
	} else {
		console.log('Source dir isn\'t specified correctly in config file.');
		result = false;
	}

	return result;
}

Environment.prototype.loadConfigFile = function (fileName) {
	var fs = require('fs');
	var contents = fs.readFileSync(Environment.conf.source + '/' + fileName);
  	config = JSON.parse(contents);

  	if(typeof config != undefined) {
  		Environment.conf.googleSpreadSheetKey = config.googleSpreadSheetKey;
  		Environment.conf.delimiter = config.delimiter;

  		if(typeof config.extractor != undefined) {
  			Environment.conf.extractor = config.extractor;
  		} else {
  			Environment.conf.extractor = 'defaultExtractor';
  		}
  	}
}

Environment.prototype.loadLineArgs = function (args) {
	if(typeof args[0] != undefined) {
		if(typeof args[1] != undefined) {
			Environment.conf.source = args[0];
			Environment.conf.target = args[1];
			if(typeof args[2] != undefined) {
				Environment.conf.mode = args[2];
			} else {
				Environment.conf.mode = 'both';
			}
			Environment.conf.checked = true;
		} else {
			console.log('Source is undefined in given arguments!');
		}
	} else {
		console.log('Target is undefined in given arguments!');
	}
}

Environment.prototype.storeResult = function (data, target) {
	var fs = require('fs');

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

	var log = fs.createWriteStream(target + '/data.json', {'flags': 'w'});
	log.end(json + "\n");
	cursor.green().write('Data fetched in ').blue().write(target + '/data.json').reset().write("\n");
}

Environment.prototype.loadData = function (source, target, callback) {
	var fs = require('fs');

	callback(JSON.parse(fs.readFileSync(target + 'data.json').toString()), target);
}

module.exports = Environment;