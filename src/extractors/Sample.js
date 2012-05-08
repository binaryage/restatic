var SampleExtractor = function () {};

SampleExtractor.prototype.extract = function (config, callback) {
    // Demo data
    var data = { 
        '/-General-A2-/': 'Your page title', 
        '/-General-B2-/': 'Restatic example', 
        '/-General-A3-/': 'Your page footer', 
        '/-General-B3-/': '(c) Binaryage 2012', 
        '/-Posts-B1-/': 'First post', 
        '/-Posts-B2-/': 'See project homepage on restatic.binaryage.com or'
    };

    callback(data, config);
}

module.exports = SampleExtractor;