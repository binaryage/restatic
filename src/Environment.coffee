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
  delimiters: ["/-", "-/"]
  extractorExts: ["js", "coffee"]
  extractorsLocation: path.join(__dirname, "extractors")
  dataFile: "data.json"
  includablePaths: ".*\.htm?"
  toBeDeleted: [
    ".git"
    ".gitignore"
    "_site"
    ".DS_Store"
    "restatic.json"
  ]

class Environment
  constructor: (options) ->
    # try to load config file from the disk (silently)
    fileConfig = @loadConfigFile(options.config, options.source)
    
    # compose effective config, command-line options have highest priority
    @config = _.extend({}, defaultConfig, fileConfig, options)
    
    # resolve extractor location
    @config.extractorPath = @resolveExtractorPath()
    
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

    # TODO: this is unexpected behavior, we should not delete stuff without user's agreement
    for file in @config.toBeDeleted
      rimraf.sync path.join(@config.target, file)
    
  check: ->
    errors = []
    
    errors.push "Source dir doesn't exists." unless path.existsSync(@config.source)
    errors.push "API key isn't specified." unless @config.apiKey
    errors.push "Delimiters aren't specified." unless @config.delimiters
    
    return unless errors.length
    
    errors

module.exports = Environment