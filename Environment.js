var Environment = function () {};

Environment.conf = {};
Environment.extractor = '';

Environment.prototype.prepare = function (lineArgs, configFile) {
	// Load raw data
	this.loadLineArgs(lineArgs);
	this.loadConfigFile(configFile);
	this.loadExtractor('./GooDataExtractor.js');

	// Fix it
	this.fixConf();

	// Prepare environment
	this.prepareEnvironment();

	// Check the result
	if(this.checkResults()) {
		Environment.conf.extractor = this.extractor;
		return Environment.conf;
	} else {
		return false;
	}
}

Environment.prototype.loadExtractor = function (defaultExtractor) {
	var path = require('path');
	this.extractor = defaultExtractor;

	if(typeof this.extractor != undefined) {
		if(!path.existsSync(this.extractor)) {
			if(path.existsSync('./' + this.extractor)) {
				this.extractor = './' + this.extractor;
			}
		}
	}
}

Environment.prototype.prepareEnvironment = function () {
	var rimraf = require('rimraf');
	var wrench = require('wrench');

	// Remove existing target
	rimraf(Environment.conf.target, function (result) {
		// Copy source to target
		wrench.copyDirSyncRecursive(Environment.conf.source, Environment.conf.target);
	});
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
	}
}

Environment.prototype.loadLineArgs = function (args) {
	if(typeof args[0] != undefined) {
		if(typeof args[1] != undefined) {
			Environment.conf.source = args[0];
			Environment.conf.target = args[1];
			Environment.conf.checked = true;
		} else {
			console.log('Source is undefined in given arguments!');
		}
	} else {
		console.log('Target is undefined in given arguments!');
	}
}

module.exports = Environment;