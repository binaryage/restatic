exec = require("child_process").exec

source = "./test/demo_data/source_folder_example"
target = "./test/demo_data/target_folder_example"
config_file = "./test/demo_data/restatic_exclude.json"

fs = require("fs")
describe "SiteParser", ->
    it "should be able to parse exclude file as is defined in config", (done) ->
        cmd = "./bin/restatic -s " + source + " -t " + target + " -c " + config_file
        console.log cmd
        exec cmd, ->
            targetFile = fs.readFileSync(target + "/index.html", 'utf-8')
            sourceFile = fs.readFileSync(target + "/index.html", 'utf-8')
            targetFile.should.be.eql sourceFile
            done()