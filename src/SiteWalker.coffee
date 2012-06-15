pathUtils = require("path")
walk = require('walk')

class SiteWalker
  constructor: (@config) ->
    
  collect: (root, continuation) ->
    paths = []
    includable = new RegExp @config.includablePaths
    excludeList = @config.excludeFileList

    walker = walk.walkSync root,
      followLinks: false
      
    walker.on "file", (dir, fileStats, next) ->
      targetPath = pathUtils.join(dir, fileStats.name)[root.length-1..-1]
      return next() unless includable.test targetPath # must be includable!
      return next() if targetPath in excludeList  # must not be excluded!
      paths.push targetPath
      next()
      
    walker.on "end", ->
      continuation?(paths)

module.exports = SiteWalker