# command-line interface for restatic

ansi = require("ansi")
cursor = ansi(process.stdout)
program = require('commander')
fs = require("fs")
_ = require("underscore")

SiteParser = require("./SiteParser.coffee")
Environment = require("./Environment.coffee")

program.on '--help', ->
  console.log('  Examples:')
  console.log('')
  console.log('  $ restatic -s "path/to/source/dir" -t "path/to/target/dir"')
  console.log('')

program
  .version('0.0.5')
  .option('-s, --source [source]', 'source folder')
  .option('-t, --target [target]', 'target folder')
  .option('-e, --extractor [extractor]', 'extractor class')
  .option('-m, --mode [mode]', 'command modes: fetch, process')
  .option('-v, --verbose', 'be verbose')
  .option('-o, --output [output]', 'output file for fetch')
  .option('-c, --config [config]', 'config file', 'restatic.json')
  .parse(process.argv)

# pick relevant options from the commandline
options = _.pick program,
  'source'
  'target'
  'extractor'
  'mode'
  'config'
  'verbose'
  'output'

# build restatic environment
env = new Environment(options)

##########################################################################################
# helper UI

printFetchInfo = (config) ->
  config.cursor?.
    green().write("Restatic started fetching data from spreadsheet defined in ").
    blue().write(config.source + "restatic.json").
    reset().write(" to ").
    blue().write(config.target).
    reset().write("\n")

printProcessInfo = (config) ->
  config.cursor?.
    green().write("Restatic started parsing html files from ").
    blue().write(config.source).
    reset().write(" to ").
    blue().write(config.target).
    green().write(" using ").
    blue().write(config.extractorName).
    reset().write("\n")

printDefaultInfo = (config) ->
  config.cursor?.
    green().write("Restatic started parsing html files from ").
    blue().write(config.source).
    reset().write(" to ").
    blue().write(config.target).
    reset().write("\n")

printErrors = (config, errors) ->
  for error in errors
    cursor.
      red().write(error).
      reset().write("\n")

##########################################################################################
# main logic

niceJSON = (obj) ->
  JSON.stringify(obj, null, 4)

env.config.cursor = cursor if env.config.verbose
console.log("effective config:\n", env.config) if env.config.verbose

# check the situation
errors = env.check()
if errors
  printErrors(env.config, errors)
  process.exit 1

# this will create target dir and do other filesystem preparations
env.bootstrap()

parser = new SiteParser(env.config)

# TODO: here should be robust error reporting, imagine syntax errors in the js file
Extractor = require(env.config.extractorPath)
extractor = new Extractor()

switch env.config.mode
  when "fetch"
    printFetchInfo env.config
    presentOutput = (data, config) ->
      if config.output
        fs.writeFile(config.output, niceJSON(data))
      else
        console.log niceJSON(data)
    extractor.extract env.config, presentOutput
  when "process"
    printProcessInfo env.config
    data = env.loadData
    # TODO allow loading json from stdin
    parser.parse data
  else # fetch + process
    printDefaultInfo env.config
    processOutput = (data, config) ->
      env.config.cursor?.
        green().write("Received data: ").
        white().write(niceJSON(data)).
        reset().write("\n")
      parser.parse data
    extractor.extract env.config, processOutput