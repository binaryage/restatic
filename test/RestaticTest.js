require('coffee-script');

var exec = require('child_process').exec;

// Environment specific
var source = './test/demo_data/source_folder_example';
var target = './test/demo_data/target_folder_example';
var config_file = 'restatic.json';

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

    var failed = true;
    if(content.replace('/-Posts-B1-/', '') == content) {
       failed = false;
    }

    failed.should.be.false;
  });
});