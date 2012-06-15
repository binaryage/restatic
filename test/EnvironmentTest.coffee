path = require("path")
Environment = require("../src/Environment.coffee")

env = new Environment(
  source: "./test/demo_data/source_folder_example"
  target: "./test/demo_data/target_folder_example"
)

config = env.config

describe "Environment", ->
  it "should be able to check if environment were setted up", ->
    result = path.existsSync(config.source)
    result.should.equal true

describe "Environment", ->
  it "should be able to set googleSpreadSheetKey config variable from right configfile", ->
    config.apiKey.should.equal "0AtkoCAIRJ7BPdGM2Y2tYdV9XRXNsNVVrVnFPeFIwb0E"

describe "Environment", ->
  it "should be able to set delimiter config variable from right configfile", ->
    config.delimiter.should.eql [ "/-", "-/" ]

describe "Environment", ->
  it "should be able to set extractor config variable from right configfile", ->
    result = path.existsSync(config.extractorPath)
    result.should.equal true