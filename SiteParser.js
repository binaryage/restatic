var SiteParser = function () {};

SiteParser.filesToParse = new Array();
SiteParser.dirs = new Array();

/* Only public function called from outside of SiteParser */
SiteParser.prototype.parse = function (data, target) {
	var fs = require('fs');
	var dir = fs.readdirSync(target);

	SiteParser.dirs[0] = target;
	SiteParser.prototype.walkThrought(dir, target);

	SiteParser.dirs.forEach(function (dir) {
		SiteParser.prototype.indexDir(fs.readdirSync(dir));
	});

	console.log(SiteParser.filesToParse);
}
/* Tested for two levels of depth */
SiteParser.prototype.walkThrought = function (dir, path) {
	var fs = require('fs');
	var stats;
	var i = SiteParser.dirs.length;
	var j = 0;
	var foundDirs = new Array();

	dir.forEach(function(file) {
		if(fs.lstatSync(path + file).isDirectory()) {
			SiteParser.dirs[i] = path + file;
			j++;
		}
	});

	if(j > 0) {
		foundDirs.forEach(function (foundDir) {
			SiteParser.prototype.walkThrought(fs.readdirSync(foundDir), path + foundDir);
		});
	} else {
		return true;
	}
}

/* Finds all .html or .htm ending files */
SiteParser.prototype.indexDir = function (dir) {
	var i = SiteParser.filesToParse.length;

	dir.forEach(function(file) {
		if(file.substr(-5) == '.html') {
			SiteParser.filesToParse[i] = file;
			i++;
		} else {
			if(file.substr(-4) == '.htm') {
				SiteParser.filesToParse[i] = file;
				i++;
			}
		}
	});
}

module.exports = SiteParser;