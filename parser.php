<?php

/*
 * @author Jan Palounek
 * @project Restatic
 * @company BinaryAge
 * @license BSD License 
 */
 
// Tools
require_once 'libs/spyc-0.5/spyc.php';
require_once 'libs/NFinder/Finder.php';

// Own classes
require_once 'GooDataExtractor.php';
require_once 'FilesDataParser.php';

// Constants
define("CONF_FILE", 'restatic.yml');

// Fill source and target with input data
$args = $_SERVER['argv'];
$source = $args[1];
$target = $args[2];

// Cut ending slashes from folder names
if(substr($source, -1) != '/') {
	$source = $source . '/';
}

if(substr($target, -1) != '/') {
	$target = $target . '/';
}

echo PHP_EOL;

// Config file - load and parse
if(file_exists($source . '' . CONF_FILE)) {
	$config = Spyc::YAMLLoad($source . '' . CONF_FILE);
} else {
	echo "Conf file from " . $source . '' . CONF_FILE . PHP_EOL;
	die("Config file doesnt exists" . PHP_EOL);
}

// Default variables setting - if it wasn't set in config file
if(!isset($config['delimiter'])) {
	$config['delimiter'] = '/-, -/';
}

if(!isset($config['sheetsIds'])) {
	$config['sheetsIds'] = '1, 2, 3';
}

// Extract and parse data
$importedData = GooDataExtractor::extract($config['googleSpreadSheetKey'], $config['sheetsIds'], $config['delimiter']);
$filesToParse = FilesDataParser::indexAndParseFolder($source, $target, $config['delimiter'], $importedData);

echo 'Parsing done - enjoy your new site! Its stored in ' . $target . PHP_EOL;