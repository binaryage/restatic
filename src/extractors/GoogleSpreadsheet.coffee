class GoogleSpreadsheetDataExtractor

  extract: (config, callback) ->
    @mineData config, (data) ->
      result = {}
      for item in data when item?
        item = JSON.parse(item)
        sheetName = item.feed.title.$t
        for entry in item.feed.entry when entry?
          key = config.delimiters[0] + sheetName + "-" + entry.title.$t + config.delimiters[1]
          value = entry.content.$t
          result[key] = value
      callback? result, config

  mineData: (config, callback) ->
    http = require("http")
    xml = []
    
    download = (sheet) ->
      rawData = ""
      link = "/feeds/cells/" + config.apiKey + "/" + sheet + "/public/values?alt=json"
      options =
        host: "spreadsheets.google.com"
        port: 80
        path: link

      config.cursor?.
        cyan().write(" @ Fetching ").
        blue().write("http://" + options.host + ":" + options.port + options.path).
        reset()
        
      http.get options, (res) ->
        res.setEncoding "utf-8"
        res.on "data", (chunk) ->
          rawData += chunk

        res.on "end", ->
          if res.statusCode is 200
            cursor?.write " ... OK\n"
            xml.push rawData
            download sheet + 1
          else
            cursor?.write " ... DONE\n"
            callback xml

    download 1

module.exports = GoogleSpreadsheetDataExtractor