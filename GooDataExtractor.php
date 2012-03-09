<?php

/*
 * @author Jan Palounek
 * @project Restatic
 * @company BinaryAge
 * @license BSD License 
 */
class GooDataExtractor extends Extractor {
	public static function extract($key, $delimiters) {
		$importedData = self::parseContentToArray($key, $sheets);

		$delimiters = str_replace(' ', '', $delimiters);
		$delimiters = explode(',', $delimiters);

		$data = array();
		foreach($importedData as $sheet) {
			foreach($sheet as $title => $sheetElems) {
				foreach($sheetElems as $celCode => $elem) {
					$data[$delimiters[0] . $title . '-' . $celCode . $delimiters[1]] = $elem;;
				}
			}
		}

		return $data;
	}

	protected static function mineData($key) {
		$result = array();
		
		$valid = TRUE;
		$sheet = 1;
		
		while($valid) {
			$link = 'http://spreadsheets.google.com/feeds/cells/' . $key . '/' . $sheet . '/public/values';

			ini_set("display_errors","Off");
			$valid = isset(simplexml_load_string(file_get_contents($link))->entry);
			ini_set("display_errors","On");

			if($valid) {
				$result[] = file_get_contents($link);
				$sheet++;
			} else {
				echo $sheet . ' sheets found in given document.';
			}
		}

		return $result;
	}

	protected static function atomToArray($data) {
		$sheets = array();
		$data = simplexml_load_string($data);

		$sheetTitle = $data->title->__toString();
		foreach($data->entry as $entry) {
			$sheets[$sheetTitle][$entry->title->__toString()] = $entry->content->__toString();
		}

		return $sheets;
	}

	protected static function parseContentToArray($key, $sheets) {
		$sheets = self::mineData($key, $sheets);
		$data = array();

		if(is_array($sheets)) {
			foreach($sheets as $sheet) {
				$data[] = self::atomToArray($sheet);
			}
		}

		return $data;
	}
}