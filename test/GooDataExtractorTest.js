var GooDataExtractor = require('../src/extractors/GooDataExtractor.js');
var GooDataExtractor = new GooDataExtractor();

var key = '0AtkoCAIRJ7BPdGM2Y2tYdV9XRXNsNVVrVnFPeFIwb0E';
var delimiters = '/-, -/';

describe('GooDataExtractor', function(){
  	it('should be able to extract data from spreadsheet and parse it', function(done) {
      GooDataExtractor.extract(key, delimiters, '', function (data) {
        var result = false;

        if(typeof data == 'object') {
          result = true;
        }

        result.should.be.true;
        done();
      });
  	});
});