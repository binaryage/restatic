# Restatic
Pumps spreadsheet data to your static web!
By binaryage.com - see [Projects homepage](restatic.binaryage.com)

# Technical informations

## How it works
It take source directory, copy the content to target directory. Extract data from Goole documents spreadsheet and save it to associative array. Index contents of target directory and replace all markups with data.

## How to write the own extractor
Extend the class Extractor and create function extract which will return the associative array with markup in key and data in value - eg. array('/-Posts-2B-/' => 'Hello world')