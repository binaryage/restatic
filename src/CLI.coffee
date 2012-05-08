# command-line interface for restatic

Environment = require("./Environment.coffee")
SiteParser = require("./SiteParser.coffee")

ansi = require("ansi")
cursor = ansi(process.stdout)

SiteParser = new SiteParser()
Environment = new Environment()

config = Environment.prepare(process.argv.splice(2))

unless config is false
    Extractor = require(config.extractor)
    Extractor = new Extractor()
    switch config.mode
        when "fetch"
            cursor.green().write("Restatic started fetching data from spreadsheet defined in ").blue().write(config.source + "restatic.json").reset().write(" to ").blue().write(config.target).write("\n").reset()
            Extractor.extract config.apiKey, config.delimiter, config.target, config.excludable, (data, target, excludable) ->
                Environment.storeResult data, config.source
        when "process"
            cursor.green().write("Restatic started parsing html files from ").blue().write(config.source).reset().write(" to ").blue().write(config.target).green().write(" using ").blue().write(config.extractorName).write("\n").reset()
            Environment.loadData config.source, config.target, config.excludable, SiteParser.parse
        else
            cursor.green().write("Restatic started parsing html files from ").blue().write(config.source).reset().write(" to ").blue().write(config.target).write("\n").reset()
            Extractor.extract config.apiKey, config.delimiter, config.target, config.excludable, SiteParser.parse
else
    cursor.green().write("Usage: parse google docs spreadsheet content using 'restatic source_folder target_folder' or 'restatic -d' if you want to generate site from actual location to folder _site '\n").reset()    if config.finished is false