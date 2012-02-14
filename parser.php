<?php

// var_dump($_SERVER['argv']);

require_once 'libs/spyc-0.5/spyc.php';
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

var_dump($config);

echo 'Source dir ' . $args[1] . ' target dir ' . $args[2] . PHP_EOL;