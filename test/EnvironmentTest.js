var Environment = require('../src/Environment.js');
var Environment = new Environment();
var source = '../source_folder_example';
var target = '../target_folder_example';
var config_file = 'restatic.json';

// Not working yet
describe('Environment', function(){
  	it('should be able to set googleSpreadSheetKey config variable from right configfile', function() {
  		var config = Environment.prepare({0: source, 1: target}, config_file);
  		config.googleSpreadSheetKey.should.equal('0AtkoCAIRJ7BPdGM2Y2tYdV9XRXNsNVVrVnFPeFIwb0E');
  	});
});