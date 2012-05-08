require('coffee-script');

var exec = require('child_process').exec;

var Extractor = require('../src/extractors/GoogleSpreadsheet.js');
var Extractor = new Extractor();

// Environment specific
var source = './test/demo_data/source_folder_example';
var target = './test/demo_data/target_folder_example';

var config_file = './test/demo_data/restatic_exclude.json';

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
  it('should be able to parse exclude file as is defined in config', function() {
    console.log('./bin/restatic ' + source + ' ' + target + ' ' + config_file);
    exec('./bin/restatic ' + source + ' ' + target);
    
    sleep(3000);

    // Valid for only one spreadsheet
    var targetFile = fs.readFileSync(target + '/index.html').toString();
    var sourceFile = fs.readFileSync(target + '/index.html').toString();
    
    var failed = false;
    if(targetFile != sourceFile) {
       failed = true;
    }

    failed.should.be.false;
  });
});