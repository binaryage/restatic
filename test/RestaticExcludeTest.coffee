exec = require("child_process").exec
fs = require("fs")

source = "./test/demo_data/source_folder_example"
target = "./test/demo_data/target_folder_example"
config_file = "./test/demo_data/restatic_exclude.json"

describe "SiteParser", ->
  it "should be able to parse exclude file as is defined in config", (done) ->
    cmd = "./bin/restatic -s " + source + " -t " + target + " -c " + config_file
    exec cmd, ->
      original = fs.readFileSync(source + "/index.html", "utf-8")
      generated = fs.readFileSync(target + "/index.html", "utf-8")
      generated.should.be.eql original
      done()