var yaml = require('yaml');
var fs = require('fs');
var path = '../source_folder_example/restatic.yml';
var optimized = '';

console.log('\n');

var fileContents = fs.readFile(path, function(err, fileContents) {
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

  console.log(optimized.googleSpreadSheetKey);
  console.log(optimized.delimiters);
})