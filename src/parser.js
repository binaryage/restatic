// Libraries setup
var Environment = require('./Environment.js');
var SiteParser = require('./SiteParser.js');

// Libraries instances setup
var SiteParser = new SiteParser();
var Environment = new Environment();

// Config load
var config = Environment.prepare(process.argv.splice(2), 'restatic.json');

// Extractor setup
var Extractor = require(config.extractor);
var Extractor = new Extractor();


// Restatic
if(config != false) {
  console.log('\033[31mRestatic started parsing html files from ../source_folder_example/ to ../target_folder_example/.\033[39m');
  Extractor.extract(config.googleSpreadSheetKey, config.delimiter, config.target, SiteParser.parse);  
} else {
  console.log("\033[32mUsage: parse google docs spreadsheet content using 'restatic source_folder target_folder' or \'restatic -d\' if you want to generate site from actual location to folder _site '\033[39m");
  console.log("By Binaryage.com, for more info see projects homepage");
}