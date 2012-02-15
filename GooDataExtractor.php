<?php

class GooDataExtractor {
	protected static function mineData($key, $sheets) {
		$sheets = str_replace(' ', '', $sheets);
		$sheets = explode(',', $sheets);
		$result = array();
		
		if(is_array($sheets)) {
			foreach($sheets as $sheet) {
				$link = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=' . $key . '&output=csv&gid=' . $sheet;

				$result[] = file_get_contents($link);
			}
		}
		return $result;		
	}

	protected static function csvToArray($file, $delimiter) { 
		echo '------------------------------------------------------------------------' . PHP_EOL;
		var_dump($file);
		echo '------------------------------------------------------------------------' . PHP_EOL;
	}

	public static function parseContentToArray($key, $sheets) {
		$sheets = self::mineData($key, $sheets);
		$data = array();

		if(is_array($sheets)) {
			foreach($sheets as $sheet) {
				$data[] = self::csvToArray($sheet, ',');
			}
		}

		return $data;
	}
}