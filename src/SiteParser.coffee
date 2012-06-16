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
    for delimiter in @config.delimiters
      re = new RegExp delimiter, "gm"
      updated = updated.replace re, (match, key) =>
        val = data[key]
        return match unless val? # TODO: report this bailout in verbose mode?
        @config.cursor?.
          magenta().write(" * Replacing ").
          yellow().write(key).
          reset().write(" with ").
          yellow().write(val).
          reset().write(" in ").
          blue().write(file).
          reset().write "\n"
        val
    
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