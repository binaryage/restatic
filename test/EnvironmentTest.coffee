path = require("path")
Environment = require("../src/Environment.coffee")

diskEnv = new Environment
  source: "./test/demo_data/source_folder_example"
  target: "./test/demo_data/target_folder_example"

defaultEnv = new Environment

customEnv = new Environment
  delimiters: ['a', 'b']

customEnv2 = new Environment
  delimiters: "/-(.+?)-/"

describe "Environment initialized by reading a config file", ->

  it "checks if environment is set up", ->
    path.existsSync(diskEnv.config.source).should.be.true

  it "reads apiKey", ->
    diskEnv.config.apiKey.should.equal "0AtkoCAIRJ7BPdGM2Y2tYdV9XRXNsNVVrVnFPeFIwb0E"

  it "resolves extractorPath", ->
    path.existsSync(diskEnv.config.extractorPath).should.be.true

describe "Default environment", ->

  it "has reasonable default config values", ->
    c = defaultEnv.config
    c.config.should.equal "restatic.json"
    c.source.should.equal "./_site"
    c.target.should.equal "./_restatic"
    c.extractor.should.equal "GoogleSpreadsheet"
    c.delimiters.should.eql [ "/-(.+?)-/" ]
    c.extractorExts.should.eql ["js", "coffee"]
    c.dataFile.should.equal "data.json"

describe "Custom environment", ->

  it "treats delimiters array as array", ->
    customEnv.config.delimiters.should.eql [ 'a', 'b' ]

  it "wraps delimiters string into an array", ->
    customEnv2.config.delimiters.should.eql [ '/-(.+?)-/' ]
