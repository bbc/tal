<?php  
class AntieFramework {
	
	private $_configPath;

	public function __construct($configPath = false) {
		if($configPath) {
			$configPath .= "/";
		}
		$this->_configPath = $configPath;
	}
	
	public function getDocType($deviceConfig) {
        $devicePageStrategy = $deviceConfig->pageStrategy;
        return $this->getPageStrategyElement( $devicePageStrategy, 'doctype', '<!DOCTYPE html>' );
	}

    public function getMimeType($deviceConfig){
    	$devicePageStrategy = $deviceConfig->pageStrategy;
    	return $this->getPageStrategyElement( $devicePageStrategy, 'mimetype', 'text/html');
    }

    public function getRootHtmlTag($deviceConfig) {
    	$devicePageStrategy = $deviceConfig->pageStrategy;
    	return $this->getPageStrategyElement( $devicePageStrategy, 'rootelement', '<html>');
    }

	protected function isSamsungMapleBrowser($brand, $deviceConfig) {
		return $brand == 'Samsung' && !$this->isHtml5Browser($deviceConfig);
	}
	
	protected function isHtml5Browser($deviceConfig) {
		return in_array("antie/devices/media/html5", $deviceConfig->modules->modifiers);
	}	
	
	public function getDeviceHeaders($deviceConfig) {
		$devicePageStrategy = $deviceConfig->pageStrategy;
		return $this->getPageStrategyElement( $devicePageStrategy, 'header', "" );
	}

	public function getDeviceBody( $deviceConfig) {
		
		$devicePageStrategy = $deviceConfig->pageStrategy;
		return $this->getPageStrategyElement( $devicePageStrategy, 'body', "" );
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
	
	public function getPageStrategyElement( $pageStrategy, $element, $default )
	{
		$returnFile = @file_get_contents( $this->_configPath."pagestrategy/$pageStrategy/$element", FILE_USE_INCLUDE_PATH );
		return $returnFile ? $returnFile : $default;
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
