rimraf = require("rimraf")
wrench = require("wrench")
fs = require("fs")
path = require("path")
_ = require("underscore")

defaultConfig =
  config: "restatic.json"
  source: "./_site"
  target: "./_restatic"
  extractor: "GoogleSpreadsheet"
  delimiters: "/-(.+?)-/" # may be an array of regexps
  extractorExts: ["js", "coffee"]
  extractorsLocation: path.join(__dirname, "extractors")
  dataFile: "data.json"
  includablePaths: ".*\\.htm?" # may be an array of regexps
  excludablePaths: [] # may be an array of regexps

class Environment
  constructor: (options = {}) ->
    # try to load config file from the disk (silently)
    fileConfig = @loadConfigFile(options.config, options.source)
    
    # compose effective config, command-line options have highest priority
    @config = _.extend({}, defaultConfig, fileConfig, options)
    
    @sanitize()
    
  loadConfigFile: (configPath, sourceDir) ->
    # first: try raw configPath
    p = configPath if path.existsSync(configPath)
    
    # second: try sourceDir+configPath
    unless p
      if configPath
        testPath = path.join(sourceDir, configPath)
        p = testPath if path.existsSync(testPath)
      
    # third: try sourceDir+defaultConfig
    unless p
      testPath = path.join(sourceDir, defaultConfig.config)
      p = testPath if path.existsSync(testPath)
    
    return {} unless p
    
    contents = fs.readFileSync(p)
    return {} unless contents
    
    JSON.parse(contents)
    
  resolveExtractorPath: ->

    # returns extension for first existing file, see defaultConfig.extractorExts for supported extensions
    detectExtension = (pathWithoutExtension) =>
      _.find @config.extractorExts, (ext) ->
        path.existsSync(pathWithoutExtension + "." + ext)
    
    extractorPathWithoutExtension = path.join(@config.extractorsLocation, @config.extractor)
    ext = detectExtension(extractorPathWithoutExtension)
    extractorPath = extractorPathWithoutExtension
    extractorPath += "." + ext if ext

  loadData: ->
    p = path.join(@config.target, @config.dataFile)
    content = fs.readFileSync(p)
    JSON.parse(content)

  bootstrap: ->
    return if @config.mode is "fetch"
    return unless @config.target
    return unless @config.source
    
    rimraf.sync @config.target
    fs.mkdirSync @config.target, 0o777
    wrench.copyDirSyncRecursive @config.source, @config.target
      
  sanitize: ->
    # resolve extractor location
    @config.extractorPath = @resolveExtractorPath()
    
    filterEmptyValues = (a) ->
      x for x in a when x
      
    turnIntoArray = (v) ->
      [].concat v
    
    @config.delimiters = filterEmptyValues turnIntoArray @config.delimiters
    @config.includablePaths = filterEmptyValues turnIntoArray @config.includablePaths
    @config.excludablePaths = filterEmptyValues turnIntoArray @config.excludablePaths
    
  check: ->
    errors = []
    
    errors.push "Source dir doesn't exists." unless path.existsSync(@config.source)
    errors.push "API key isn't specified." unless @config.apiKey
    errors.push "Delimiters aren't specified." unless @config.delimiters
    
    return unless errors.length
    
    errors

module.exports = Environment