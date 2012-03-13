<?php

/*
 * @author Jan Palounek
 * @project Restatic
 * @company BinaryAge
 * @license BSD License 
 */
class FilesDataParser {
	public static function indexAndParseFolder($folder, $target, $delimiter, $data) {
		self::removeFolderContent($target);
		self::copyFolder($folder, $target);
		$folder = $target;
		$htmlFiles = self::findHtmlFiles($folder);
		$replacables = self::findReplacables($htmlFiles, $delimiter, $data);
		
		self::removeFolder($folder . '/.git');
		self::removeFolder($folder . '/_site');
		self::removeFile($folder . '/.gitignore');

		return $htmlFiles;
	}

	protected static function removeFile($file) {
		exec('rm -rf ' . $file);
	}

	protected static function removeFolder($folder) {
		exec('rm -rf ' . $folder);
	}

	protected static function removeFolderContent($folder) {
		exec('rm -rf ' . $folder . '/*');
	}

	protected static function copyFolder($source, $target) {
		exec('rsync -avz ' . $source . ' ' . $target);
	}

	protected static function findHtmlFiles($folder) {
		$result = NFinder::findFiles('*.html')->from($folder);

		foreach($result as $file) {
			$files[] = (string)$file;
		}
		
		if(sizeof($files) == 0) {
			die('Nothing to parse!' . PHP_EOL);
		}

		return $files;
	}

	protected static function findReplacables($files, $delimiter, $data) {
		$delimiters = str_replace(' ', '', $delimiter);
		$delimiters = explode(',', $delimiters);

		$result = array();

		$cellsToParse = array_keys($data);
		echo PHP_EOL . 'Parsing started. ' . PHP_EOL;

		foreach($files as $file) {
			$fileName = $file;
			$file = file_get_contents($file);

			foreach($cellsToParse as $cell) {
				$origin = $file;
				$file = str_replace($cell, $data[$cell], $file);

				if($origin != $file) {
					file_put_contents($fileName, $file);
					echo 'Replacing ' . $cell . ' in ' . $fileName . ' with ' . $data[$cell] . ' data.' . PHP_EOL;
				}
			}
		}

		echo 'Parsing done. ' . PHP_EOL;
	}
}