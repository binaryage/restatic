ansi = require("ansi")
cursor = ansi(process.stdout)
SiteParser = ->

SiteParser.filesToParse = new Array()
SiteParser.dirs = new Array()
SiteParser::parse = (data, target) ->
  fs = require("fs")
  i = 0
  j = 0
  SiteParser::prepareData target
  SiteParser.filesToParse.forEach (file) ->
    origin = fs.readFileSync(file, "utf8").toString()
    updated = origin
    j++
    for key of data
      updated = updated.replace(key, data[key])
      unless origin is updated
        fs.writeFileSync file, updated, "utf8"
        friendlyFilename = file.replace(target, "")
        cursor.magenta().write(" * ").write("Replacing ").yellow().write(key).reset().write(" with ").yellow().write(data[key]).reset().write(" in ").blue().write(friendlyFilename).reset().write "\n"
        i++
    content = fs.readFileSync(file, "utf8").toString()
    if i is 0
      cursor.white().write("Nothing to update in " + file).reset().write "\n"
    else
      i = 0
    cursor.green().write("Parsing done in ").blue().write(target).reset().write "\n"  if j is SiteParser.filesToParse.length

SiteParser::prepareData = (target) ->
  fs = require("fs")
  dir = fs.readdirSync(target)
  SiteParser.dirs[0] = target
  SiteParser::walkThrought dir, target
  SiteParser.dirs.forEach (dir) ->
    SiteParser::indexDir fs.readdirSync(dir), dir

SiteParser::walkThrought = (dir, path) ->
  fs = require("fs")
  stats = undefined
  i = SiteParser.dirs.length
  j = 0
  foundDirs = new Array()
  dir.forEach (file) ->
    if fs.lstatSync(path + file).isDirectory()
      SiteParser.dirs[i] = path + file
      j++

  if j > 0
    foundDirs.forEach (foundDir) ->
      SiteParser::walkThrought fs.readdirSync(foundDir), path + foundDir
  else
    true

SiteParser::indexDir = (dir, path) ->
  i = SiteParser.filesToParse.length
  path = path.slice(0, -1)  if path.charAt(path.length - 1) is "/"
  dir.forEach (file) ->
    if file.substr(-5) is ".html"
      SiteParser.filesToParse[i] = path + "/" + file
      i++
    else
      if file.substr(-4) is ".htm"
        SiteParser.filesToParse[i] = path + "/" + file
        i++

module.exports = SiteParser