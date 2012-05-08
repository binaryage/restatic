# command-line interface for restatic

ansi = require("ansi")
cursor = ansi(process.stdout)

SiteParser = require("./SiteParser.coffee")
Environment = require("./Environment.coffee")

siteParser = new SiteParser()
environment = new Environment()

options = process.argv.splice(2)
config = environment.prepare(options)

# helper UI
printFetchInfo = ->
    cursor
        .green().write("Restatic started fetching data from spreadsheet defined in ")
        .blue().write(config.source + "restatic.json")
        .reset().write(" to ")
        .blue().write(config.target)
        .reset().write("\n")

printProcessInfo = ->
    cursor
        .green().write("Restatic started parsing html files from ")
        .blue().write(config.source)
        .reset().write(" to ")
        .blue().write(config.target)
        .green().write(" using ")
        .blue().write(config.extractorName)
        .reset().write("\n")

printDefaultInfo = ->
    cursor
        .green().write("Restatic started parsing html files from ")
        .blue().write(config.source)
        .reset().write(" to ")
        .blue().write(config.target)
        .reset().write("\n")

printUsage = ->
    cursor
        .green().write("Usage: ")
        .write("parse google docs spreadsheet content using 'restatic source_folder target_folder'")
        .write(" or ")
        .write("'restatic -d' if you want to generate site from actual location to folder _site")
        .reset().write("\n")

##########################################################################################
# main logic

if not config
    printUsage()
    process.exit 1

# TODO: here should be robust error reporting
Extractor = require(config.extractor)
extractor = new Extractor()

switch config.mode
    when "fetch"
        printFetchInfo()
        extractor.extract config.apiKey, config.delimiter, config.target, config.excludable, (data, target, excludable) ->
            environment.storeResult data, config.source
    when "process"
        printProcessInfo()
        environment.loadData config.source, config.target, config.excludable, siteParser.parse
    else
        printDefaultInfo()
        extractor.extract config.apiKey, config.delimiter, config.target, config.excludable, siteParser.parse