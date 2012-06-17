GoogleSpreadsheet = require("../src/extractors/GoogleSpreadsheet")
googleSpreadsheet = new GoogleSpreadsheet()

config =
  key: "0AtkoCAIRJ7BPdGM2Y2tYdV9XRXNsNVVrVnFPeFIwb0E"

describe "GoogleSpreadsheet", ->
  it "extracts data from the spreadsheet and parses it", (done) ->
    googleSpreadsheet.extract config, (data) ->
      result = true if typeof data is "object"
      result.should.be.true
      done()