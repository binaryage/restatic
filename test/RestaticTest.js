var Environment = require('../src/Environment.js');
var Environment = new Environment();

var SiteParser = require('../src/SiteParser.js');
var SiteParser = new SiteParser();

var Extractor = require('../src/extractors/GoogleSpreadsheetDataExtractor.js');
var Extractor = new Extractor();

// Environment specific
var source = '../source_folder_example';
var target = '../target_folder_example';
var config_file = 'restatic.json';

var config = Environment.prepare({0: source, 1: target}, config_file);
var fs = require('fs');

describe('SiteParser', function(){
  	it('should be able to parse data correctly to demo target', function() {
  		Extractor.extract(config.googleSpreadSheetKey, config.delimiter, config.target, SiteParser.parse);
      
      // Valid for only one spreadsheet
      var content = fs.readFileSync(target + '/' + 'snippet.html').toString();
      var failed = false;
      if(content.replace('/-Posts-B1-/', '') != content) {
        failed = true;
      }

      failed.should.be.false;
  	});
});