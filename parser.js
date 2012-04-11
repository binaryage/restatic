// Libraries setup
var GooDataExtractor = require('./GooDataExtractor.js');
var SiteParser = require('./SiteParser.js');

var rimraf = require('rimraf');
var wrench = require('wrench');
var yaml = require('yaml');
var fs = require('fs');

// Variables setup
var GooDataExtractor = new GooDataExtractor();
var SiteParser = new SiteParser();

var arguments = process.argv.splice(2);
var source = arguments[0];
var target = arguments[1];
var checked = true;

// Input vars checking
if(typeof target == 'undefined') {
  if(typeof source == 'undefined') {
    console.log("\033[32mUsage: parse google docs spreadsheet content using 'restatic source_folder target_folder' or \'restatic -d\' if you want to generate site from actual location to folder _site '\033[39m");
    console.log("By Binaryage.com, for more info see projects homepage");
    checked = false;
  }
}

try {
  sourceStats = fs.lstatSync(source);
}

catch(e) {
  if(source != '-d') {
    console.log('Source directory doesn\'t exists.');
    checked = false;
  }
}

try {
  targetStats = fs.lstatSync(target);
}

catch(e) {
  fs.mkdirSync(target);
}

// Restatic
if(checked) {
  console.log('\033[31mRestatic started parsing html files from ../source_folder_example/ to ../target_folder_example/.\033[39m');
  if(source.charAt(source.length - 1) == '/') {
    source = source.slice(0, -1);
  }
  
  var config = source + '/restatic.json';
  config = fs.readFileSync(config);
  config = JSON.parse(config);

  if(typeof config.googleSpreadSheetKey != undefined) {
    if(typeof config.delimiter != undefined) {
      var googleSpreadSheetKey = config.googleSpreadSheetKey;
      var delimiter = config.delimiter;

      // Clear target's content
      rimraf(target, function (result) {
        // Clear source to target
        wrench.copyDirSyncRecursive(source, target);

        // Extract and parse
        GooDataExtractor.extract(googleSpreadSheetKey, delimiter, target, SiteParser.parse);
      });
    } else {
      console.log('Delimiter is not defined in given config.');
    }
  } else {
    console.log('GoogleSpreadSheetKey is not defined in given config.');
  }
}