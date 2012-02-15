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

	/*
	protected static function csvToArray($file, $delimiter) { 
		if (($handle = fopen($file, 'r')) !== FALSE) { 
			$i = 0; 
			while (($lineArray = fgetcsv($handle, 4000, $delimiter, '"')) !== FALSE) { 
				for ($j = 0; $j < count($lineArray); $j++) { 
					$arr[$i][$j] = $lineArray[$j]; 
				} 
      			$i++; 
    		} 
    		fclose($handle); 
  		} 
  		return $arr; 
	} 
	*/

	protected static function csvToArray($file, $delimiter) { 
		echo '------------------------------------------------------------------------' . PHP_EOL;
		var_dump($file);
		echo '------------------------------------------------------------------------' . PHP_EOL;
	}

	public static function parseContentToArray($key, $sheets) {
		// return self::csvToArray($link, ',');
		$sheets = self::mineData($key, $sheets);
		if(is_array($sheets)) {
			foreach($sheets as $sheet) {
				self::csvToArray($sheet, ',');
			}
		}

		// foreach
		// return 
	}
}