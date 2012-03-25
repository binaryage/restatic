<?php

class Storage {
	protected $storageFile;
	protected $config = array(
		'autoHeal' => 'TRUE',
	);

	public function __construct($file) {
		$this->storageFile = $file;
	}

	protected function healStorage() {
		file_put_contents($this->storageFile, json_encode(array(0 => '')));
	}

	protected function getStorage() {
		$storage = file_get_contents($this->storageFile);
		return (array)json_decode($storage, TRUE);
	}

	public function add($data) {
		$storage = $this->getStorage($this->storageFile);
		$storage[] = array(sizeof($storage) + 1 => $data);
		file_put_contents($this->storageFile, json_encode($storage));
		echo sizeof($storage);
	}

	public function edit($id, $field, $value) {
		$storage = $this->getStorage();
		$result  = $storage;
		if($storage) {
			foreach($storage as $key => $row) {
				if($row) {
					foreach($row as $setId => $dataSet) {
						if($id == $setId) {
							foreach($dataSet as $fieldName => $fieldValue) {
								if($field == $fieldName) {
									$result[$key][$setId][$fieldName] = $value;
								}
							}
						}
					}
				}
			}
		}

		file_put_contents($this->storageFile, json_encode($result));
	
		return TRUE;
	}

	public function select($id, $field) {
		$storage = $this->getStorage();

		if((!is_array($storage)) and ($this->config['autoHeal'])) {
			$this->healStorage();
			$result = 'Inited';
		} else {
			if($storage) {
				foreach($storage as $row) {
					if($row) {
						foreach($row as $setId => $dataSet) {
							if($id == $setId) {
								foreach($dataSet as $fieldName => $fieldValue) {
									if($field == $fieldName) {
										$result = $fieldValue;
									}
								}
							}
						}
					}
				}
			}
		}

		return $result;
	}
}