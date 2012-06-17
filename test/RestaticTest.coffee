exec = require("child_process").exec
fs = require("fs")

source = "./test/demo_data/source_folder_example"
target = "./test/demo_data/target_folder_example"
config_file = "./test/demo_data/restatic.json"

describe "Restatic", ->
  it "runs and generates correct output", (done) ->
    cmd = "./bin/restatic -s " + source + " -t " + target
    exec cmd, ->
      original = fs.readFileSync(source + "/snippet.html", "utf-8")
      generated = fs.readFileSync(target + "/snippet.html", "utf-8")
      generated.should.not.be.eql original
      done()