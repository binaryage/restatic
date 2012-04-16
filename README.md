# [Restatic from BinaryAge](http://restatic.binaryage.com)

A command-line utility which can pump spreadsheet data to your static web!

<img src="http://restatic.binaryage.com/images/restatic_visualisation.png">

# Technical information

## How it works

Restatic takes your static web and replaces restatic markup with dynamic data, say fields from Google Spreadsheets.

When you launch restatic, it will:
  
  * copy the source to target directory
  * extract data from Google Spreadsheets and builds associative array
  * processe contents of target directory and replace all marks with associated fields

## You may write your own extractor

Extend the class Extractor and write function `extract` which will return the associative array with markup in key and data in value - eg. `{ "/-Posts-2B-/": "Hello world" }`