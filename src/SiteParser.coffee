fs = require("fs")
pathUtils = require("path")
SiteWalker = require('./SiteWalker')

class SiteParser
  constructor: (@config) ->

  parse: (data, continuation) ->
    walker = new SiteWalker @config
    walker.collect @config.target, (files) =>
      for file in files
        @process file, data
      continuation?()

  process: (file, data) ->
    fullPath = pathUtils.join(@config.target, file)
    origin = fs.readFileSync(fullPath , "utf8")
    updated = origin
    for key of data
      newUpdated = updated.replace(@config.delimiters[0]+key+@config.delimiters[1], data[key])
      if newUpdated isnt updated
        updated = newUpdated
        @config.cursor?.
          magenta().write(" * Replacing ").
          yellow().write(key)
          reset().write(" with ").
          yellow().write(data[key]).
          reset().write(" in ").
          blue().write(file).
          reset().write "\n"

    if origin isnt updated
      fs.writeFileSync fullPath , updated, "utf8"
    else
      @config.cursor?.
        white().write("Nothing to update in " + file).
        reset().write "\n"

    @config.cursor?.
      green().write("Parsing done in ").
      blue().write(@config.target).
      reset().write "\n"

module.exports = SiteParser