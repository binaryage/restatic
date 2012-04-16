var ansi = require('ansi');
var cursor = ansi(process.stdout);

var SiteParser = function () {};

SiteParser.filesToParse = new Array();
SiteParser.dirs = new Array();

// Only public function called from outside of SiteParser
SiteParser.prototype.parse = function (data, target) {
	var fs = require('fs');
	var i = 0;
	var j = 0;
	SiteParser.prototype.prepareData(target);

	SiteParser.filesToParse.forEach(function (file) {
		fs.readFile(file, 'utf8', function (err, content) {
			j++;
			for(var key in data) {
				updated = content.replace(key, data[key]);

				if(content != updated) {
					fs.writeFileSync(file, updated, 'utf8');
					var friendlyFilename = file.replace(target, '');
					cursor.magenta().write(' * ')
						.write('Replacing ').yellow().write(key).reset()
						.write(' with ').yellow().write(data[key]).reset()
						.write(' in ').blue().write(friendlyFilename).reset().write("\n");
					i++;
				}
			}

			if(i == 0) {
				console.log('Nothing to update in ' + file);
			} else {
				i = 0;
			}

			if(j == SiteParser.filesToParse.length) {
				cursor.green().write('Parsing done in ').blue().write(target).reset().write("\n");
			}
		});
	});
}

SiteParser.prototype.prepareData = function (target) {
	var fs = require('fs');
	var dir = fs.readdirSync(target);

	SiteParser.dirs[0] = target;
	SiteParser.prototype.walkThrought(dir, target);

	SiteParser.dirs.forEach(function (dir) {
		SiteParser.prototype.indexDir(fs.readdirSync(dir), dir);
	});
}

// Tested for two levels of depth
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

// Finds all .html or .htm ending files
SiteParser.prototype.indexDir = function (dir, path) {
	var i = SiteParser.filesToParse.length;

	if(path.charAt(path.length - 1) == '/') {
    	path = path.slice(0, -1);
  	}

	dir.forEach(function(file) {
		if(file.substr(-5) == '.html') {
			SiteParser.filesToParse[i] = path + '/' + file;
			i++;
		} else {
			if(file.substr(-4) == '.htm') {
				SiteParser.filesToParse[i] = path + '/' + file;
				i++;
			}
		}
	});
}
module.exports = SiteParser;