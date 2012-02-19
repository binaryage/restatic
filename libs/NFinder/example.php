<!DOCTYPE html><link rel="stylesheet" href="files/style.css">

<h1>NFinder demo (see source code)</h1>

<pre>
<?php

require dirname(__FILE__) . '/Finder.php52.php';



// non-recursive file search
foreach (NFinder::findFiles('file.txt')->in('files') as $file) {
	echo $file, "\n";
}

// recursive file search
foreach (NFinder::findFiles('*.txt', '*.gif')->from('files') as $file) {
	echo $file, "\n";
}

// recursive file search with depth limit
$finder = NFinder::findFiles('file.txt')->from('files')->limitDepth(1);

// non-recursive file & directory search
$finder = NFinder::find('file.txt')->in('files');

// recursive file & directory search from multiple sources
$finder = NFinder::find('file.txt')->from('files', __DIR__);
// or $finder = NFinder::find('file.txt')->from(array('files', __DIR__));

// recursive file & directory search in child-first order
$finder = NFinder::find('file.txt')->from('files')->childFirst();

// recursive file & directory search excluding folders
$finder = NFinder::find('file.txt')->from('files')->exclude('images')->exclude('subdir2', '*.txt');

// non-recursive directory search
$finder = NFinder::findDirectories('subdir*')->in('files');

// subdir mask
$finder = NFinder::findFiles('*/*2/*')->from('files');

// excluding mask
$finder = NFinder::findFiles('*')->exclude('*i*')->in('files/subdir');

// complex mask
$finder = NFinder::findFiles('*[efd][a-z][!a-r]*')->from('files');

// anchored masks
$finder = NFinder::findFiles('/f*')->from('files');
$finder = NFinder::findFiles('/**/f*')->from('files');

// size filter
$finder = NFinder::findFiles('*')->size('> 1 kB')->from('files');

// date filter
$finder = NFinder::findFiles('*')->date('>', new DateTime)->from('files');

// custom filter (example for PHP 5.3)
/*
$finder = NFinder::findFiles('*')->filter(function($file) {
	return strlen($file->getFilename()) % 2;
})->from('files');
*/
