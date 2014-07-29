<?php  
class AntieFramework {
	
	private $_configPath;

	public function __construct($configPath = false) {
		if($configPath) {
			$configPath .= "/";
		}
		$this->_configPath = $configPath;
	}
	
	public function getDocType($brand, $model) {
		return "<!DOCTYPE html>";
	}
	
	public function getDeviceHeaders($brand, $model) {
		if($brand == "Samsung") {
			return $this->getDeviceFragment($this->_configPath.'devicefragments/header/samsung/generic', 'Samsung', 'Header');
		}
	}
	
	public function getDeviceBody($brand, $model) {
		switch($brand) {
			case 'Samsung':
				return $this->getDeviceFragment($this->_configPath.'devicefragments/body/samsung/generic', 'Samsung', 'Body');
			break;
			case 'Sony':
				if ($model == 'Playstation 3') {
					return $this->getDeviceFragment($this->_configPath.'devicefragments/body/sony/playstation3', 'Sony Playstation3', 'Body');
				}
			break;
		}
	}
	
	public static function normaliseKeyNames($value) {
		return strtolower(preg_replace("/[^a-zA-Z0-9]/m", "_", $value));
	}
	
	public function getConfigurationFromFilesystem($key, $type) {
		$configurationJSON = "";
		$configurationPath = $this->_configPath."$type/$key.json";
		$configurationJSON = @file_get_contents($configurationPath, FILE_USE_INCLUDE_PATH);
		return $configurationJSON;
	}
	
	private function getDeviceFragment($filename, $message, $type) {
		$returnFile = @file_get_contents($filename, FILE_USE_INCLUDE_PATH);
		if ($returnFile) {
			return $returnFile;
		} else {
			throw new Exception ("Could not find $message specific $type File: $filename");
		}		
	}
	
	public static function mergeConfigurations($original, $patch) {
		foreach ($patch as $key => $value) {
			if (property_exists($original, $key) && is_object($original->{$key}) && is_object($value)){
				$original->{$key} = self::mergeConfigurations($original->{$key}, $value);
			}
			else {
				$original->{$key} = $value;
			}
		}
		return $original;
	}
}
