<?php

/**
 * By Jan Palounek - BinaryAge.com
 */

require_once 'Storage.php';

define('KEY_FILE', 'data/key.dat');
define('SITES_FILE', 'data/sites.dat');

$input = array_merge($_GET, $_POST);
$key = file_get_contents(KEY_FILE);

function authorize($key) {
	if($key == file_get_contents(KEY_FILE)) {
		return TRUE;
	} else {
		return FALSE;
	}
}

if(authorize($input['access_key'])) {
	if(isset($input['new_key'])) {
		file_put_contents(KEY_FILE, $input['new_key']);
		echo 'Key saved' . PHP_EOL;
	}

	$storage = new Storage(SITES_FILE);

	if(($input['action'] == 'restatic') and (isset($input['id']))) {
		$id = $input['id'];
		$source = $storage->select($id, 'source');
		$target = $storage->select($id, 'target');

		if((is_dir($source)) and ($target)) {
			exec('sh restatic ' . $source . ' ' . $target, $output);
		}
	}

	if(($input['action'] == 'add') and (isset($input['source'])) and (isset($input['target']))) {
		$source = $input['source'];
		$target = $input['target'];

		if((is_dir($source)) and is_dir($target)) {
			echo $storage->add(array(
				'source' => $source,
				'target' => $target,
			));
		} else {
			echo 'Not dir.' . PHP_EOL;
		}
	}

	if(($input['action'] == 'edit') and (isset($input['id'])) and (isset($input['field'])) and (isset($input['value']))) {
		$id = $input['id'];
		$field = $input['field'];
		$value = $input['value'];

		if((is_dir($value))) {
			if($storage->edit($id, $field, $value)) {
				echo 'Edited.' . PHP_EOL;
			}
		} else {
			echo 'Invalid data.' . PHP_EOL;
		}
	}

	if(is_array($output)) {
		foreach ($output as $row) {
			echo $row . PHP_EOL;
		}
	}
} else {
	echo 'Unauthorized access.' . PHP_EOL;
}