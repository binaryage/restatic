var GoogleSpreadsheetDataExtractor = require('../src/extractors/GoogleSpreadsheetDataExtractor.js');
var GoogleSpreadsheetDataExtractor = new GoogleSpreadsheetDataExtractor();

var key = '0AtkoCAIRJ7BPdGM2Y2tYdV9XRXNsNVVrVnFPeFIwb0E';
var delimiters = '/-, -/';

describe('GoogleSpreadsheetDataExtractor', function(){
  	it('should be able to extract data from spreadsheet and parse it', function(done) {
      GoogleSpreadsheetDataExtractor.extract(key, delimiters, '', function (data) {
        var result = false;

        if(typeof data == 'object') {
          result = true;
        }

        result.should.be.true;
        done();
      });
  	});
});