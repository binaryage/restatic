require('coffee-script');

var exec = require('child_process').exec;

var Environment = require('../src/Environment.coffee');
var Environment = new Environment();

var SiteParser = require('../src/SiteParser.coffee');
var SiteParser = new SiteParser();

var Extractor = require('../src/extractors/GoogleSpreadsheetDataExtractor.js');
var Extractor = new Extractor();

// Environment specific
var source = './test/demo_data/source_folder_example';
var target = './test/demo_data/target_folder_example';

var config_file = 'restatic.json';

var config = Environment.prepare({0: source, 1: target}, config_file);
var fs = require('fs');

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

describe('SiteParser', function(){
  it('should be able to parse data correctly to demo target', function() {
    console.log('./bin/restatic ' + source + ' ' + target);
    exec('./bin/restatic ' + source + ' ' + target);
    
    sleep(3000);

    // Valid for only one spreadsheet
    var content = fs.readFileSync(target + '/snippet.html').toString();
    console.log(target);

    var failed = false;
    if(content.replace('/-Posts-B1-/', '') != content) {
       failed = true;
    }

    failed.should.be.false;
  });
});