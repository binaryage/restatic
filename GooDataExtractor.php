<?php

class GooDataExtractor {
	public static function extract($key, $sheets, $delimiters) {
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

	protected static function mineData($key, $sheets) {
		$sheets = str_replace(' ', '', $sheets);
		$sheets = explode(',', $sheets);
		$result = array();
		
		if(is_array($sheets)) {
			foreach($sheets as $sheet) {
				$sheet = (int)$sheet;
				$link = 'http://spreadsheets.google.com/feeds/cells/' . $key . '/' . $sheet . '/public/values';
				$result[] = file_get_contents($link);
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