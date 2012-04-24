var Environment = require('../src/Environment.js');
var Environment = new Environment();
var source = '../source_folder_example/';
var target = '../target_folder_example/';
var config_file = 'restatic.json';
var path = require('path');

describe('Environment', function(){
  	it('should be able to check if environment were setted up', function() {
  		var config = Environment.prepare({0: source, 1: target}, config_file);
  		config.source.should.equal(source);
  	});
});

describe('Environment', function(){
  	it('should be able to set googleSpreadSheetKey config variable from right configfile', function() {
  		var config = Environment.prepare({0: source, 1: target}, config_file);
  		config.apiKey.should.equal('0AtkoCAIRJ7BPdGM2Y2tYdV9XRXNsNVVrVnFPeFIwb0E');
  	});
});

describe('Environment', function(){
  	it('should be able to set delimiter config variable from right configfile', function() {
  		var config = Environment.prepare({0: source, 1: target}, config_file);
  		config.delimiter.should.equal('/-, -/');
  	});
});

describe('Environment', function(){
  	it('should be able to set extractor config variable from right configfile', function() {
  		var config = Environment.prepare({0: source, 1: target}, config_file);

      var result = path.existsSync(config.extractor);
  		result.should.equal(true);
  	});
});

/*
describe('Environment', function(){
    it('should be able to set source config when option -d is active', function() {
      Environment.loadLineArgs({0: '-d', 1: ''});
      Environment.fixConf({0: '-d', 1: ''});
      Environment.conf.target.should.equal('./_site/');
    });
});
*/