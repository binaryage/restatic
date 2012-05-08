var GoogleSpreadsheet = require('../src/extractors/GoogleSpreadsheet.js');
var googleSpreadsheet = new GoogleSpreadsheet();

var config = {
    key: '0AtkoCAIRJ7BPdGM2Y2tYdV9XRXNsNVVrVnFPeFIwb0E',
    delimiters: ['/-', '-/']
}

describe('GoogleSpreadsheet', function(){
    it('should be able to extract data from spreadsheet and parse it', function(done) {
        googleSpreadsheet.extract(config, function (data) {
            var result = false;

            if(typeof data == 'object') {
                result = true;
            }

            result.should.be.true;
            done();
        });
    });
});