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

define("CONF_FILE", 'goopages.yml');

$args = $_SERVER['argv'];
$source = $args[1];
$target = $args[2];

// @todo Check if last char is not /
if(file_exists($source . '/' . 'goopages.yml')) {
	$config = Spyc::YAMLLoad($source . '/' . CONF_FILE);
} else {
	die("Config file doesnt exists");
}

$importedData = GooDataExtractor::extract($config['googleSpreadSheetKey'], $config['sheetsIds'], $config['delimiter']);
$filesToParse = FilesDataParser::indexAndParseFolder($source, $target, $config['delimiter'], $importedData);

echo 'Parsing done - enjoy your new site! Its stored in ' . $target . PHP_EOL;