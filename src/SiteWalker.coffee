pathUtils = require("path")
walk = require('walk')

class SiteWalker
  constructor: (@config) ->
    
  collect: (root, continuation) ->
    paths = []
    includables = (new RegExp r for r in @config.includablePaths)
    excludables = (new RegExp r for r in @config.excludablePaths)

    walker = walk.walkSync root,
      followLinks: false
      
    walker.on "file", (dir, fileStats, next) ->
      targetPath = pathUtils.join(dir, fileStats.name)[root.length-1..-1]
      for includable in includables
        if includable.test targetPath # must be includable!
          isIncludable = true
          break
      return next() unless isIncludable
      for excludable in excludables
        return next() if excludable.test targetPath # must not be excluded!
      paths.push targetPath
      next()
      
    walker.on "end", ->
      continuation?(paths)

module.exports = SiteWalker