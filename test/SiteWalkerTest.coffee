SiteWalker = require("../src/SiteWalker")

config =
  target: "./test/demo_data/target_folder_example"
  includablePaths: ["\\.htm?"]
  excludablePaths: []

config2 =
  target: "./test/demo_data/target_folder_example"
  includablePaths: ["\\.json"]
  excludablePaths: []

config3 =
  target: "./test/demo_data/target_folder_example"
  includablePaths: ["\\.json", "\\.htm?"]
  excludablePaths: ["^posts/"]

describe "SiteWalker", ->
  it "collects all htm* files", (done) ->
    walker = new SiteWalker config
    walker.collect config.target, (files) =>
      files.should.eql [ 
        'index.html',
        'snippet.html',
        'posts/17-02-12-how-to-user-restatic.html' 
      ]
      done()
      
  it "collects all json files", (done) ->
    walker = new SiteWalker config2
    walker.collect config.target, (files) =>
      files.should.eql [ 'data.json', 'restatic.json' ]
      done()

  it "collects all htm* + json files but excludes posts/*", (done) ->
    walker = new SiteWalker config3
    walker.collect config.target, (files) =>
      files.should.eql [ 'data.json', 'index.html', 'restatic.json', 'snippet.html' ]
      done()
