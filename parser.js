/* ---- Variables setup ---- */
var GooDataExtractor = require('./GooDataExtractor.js');
var SiteParser = require('./SiteParser.js');

var GooDataExtractor = new GooDataExtractor();
var SiteParser = new SiteParser();

var yaml = require('yaml');
var fs = require('fs');

var arguments = process.argv.splice(2);
var source = arguments[0];
var target = arguments[1];
var checked = true;

/* ---- Input vars checking ---- */
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
  console.log('Target directory doesn\'t exists.');
  checked = false;
}

/* ---- Restatic ---- */
if(checked) {
  console.log('\033[31mRestatic started parsing html files from ../source_folder_example/ to ../target_folder_example/.\033[39m');
  if(source.charAt(source.length - 1) == '/') {
    source = source.slice(0, -1);
  }
  
  var config = source + '/restatic.yml';
  var optimized = '';
  
  var fileContents = fs.readFile(config, function(err, fileContents) {
    var yaml = require('yaml');
    fileContents = fileContents.toString();
    fileContents = '\n' + fileContents;
  
    var commentedLine = false;
  
    for (var i = 0; i <= fileContents.length; i++) {
      if(typeof fileContents[i + 1] != 'undefined') {
        if(fileContents[i] != '\n') {
          if(commentedLine != true) {
            optimized = optimized + fileContents[i];
          }
        } else {
          if(fileContents[i + 1] == '#') {
            commentedLine = true;
          } else {
            commentedLine = false;
          }
        }
      }
    }
  
    optimized = yaml.eval(optimized);
    var key = optimized.googleSpreadSheetKey;
    var delimiters = optimized.delimiter;
  /*
    delimiters = delimiters.replace(" ", "");
    delimiters = delimiters.split(",");
  */
  
  /*
    var importedData = GooDataExtractor.extract(key, delimiters);
    console.log(importedData);
  */
  
    GooDataExtractor.extract(key, delimiters, SiteParser.parse);
  });
}