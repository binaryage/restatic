GoogleSpreadsheet = require("../src/extractors/GoogleSpreadsheet.js")
googleSpreadsheet = new GoogleSpreadsheet()

config =
  key: "0AtkoCAIRJ7BPdGM2Y2tYdV9XRXNsNVVrVnFPeFIwb0E"
  delimiters: [ "/-", "-/" ]

describe "GoogleSpreadsheet", ->
  it "should be able to extract data from spreadsheet and parse it", (done) ->
    googleSpreadsheet.extract config, (data) ->
      result = true if typeof data is "object"
      result.should.be.true
      done()