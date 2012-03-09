<?php

/*
 * @author Jan Palounek
 * @project Restatic
 * @company BinaryAge
 * @license BSD License 
 */
abstract class Extractor {
	protected static function mineData() {
	}

	public static function extract() {
		return self::mineData();
	}
}