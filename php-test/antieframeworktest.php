<?php
require_once '../php/antieframework.php';

class AntieFrameworkTest extends PHPUnit_Framework_TestCase{
		
	private static $frameworkDir;
	private static $testConfigDir;

	private $framework;
	
	protected function setUp() {
		$this->framework = new AntieFramework();
		
		if (!isset(self::$frameworkDir)) {
			self::$frameworkDir = realpath(dirname(__FILE__) . "/../config");
			self::$testConfigDir = realpath(dirname(__FILE__) . "/testconfig");

			//include path needs to pick up the test config first
			$includePath = get_include_path();
			set_include_path(self::$testConfigDir.PATH_SEPARATOR.self::$frameworkDir.PATH_SEPARATOR.$includePath);
		}
	}

	function testDocType() {
		$this->assertEquals('<!DOCTYPE html>', $this->framework->getDocType('Samsung', ''));
	}

	function testDefaultDeviceHasNoHeaders() {
		$this->assertEquals('', $this->framework->getDeviceHeaders('default_brand', 'default_model'));
	}

	function testSamsungHasSpecialDeviceHeaders() {
		$headers = $this->framework->getDeviceHeaders('Samsung', '');
		$file = AntieFrameworkTest::$frameworkDir.'/devicefragments/header/samsung/generic';
		$this->assertStringEqualsFile($file, $headers);		
	}
	
	function testSamsungDeviceBody() {
		$body = $this->framework->getDeviceBody('Samsung', '');
		$file = AntieFrameworkTest::$frameworkDir.'/devicefragments/body/samsung/generic';
		$this->assertStringEqualsFile($file, $body);
	}
	
	function testSonyDeviceBody() {
		$body = $this->framework->getDeviceBody('Sony', '');
		$this->assertEquals('', $body);
	}
	
	function testSonyPlaystation3DeviceBody() {
		$body = $this->framework->getDeviceBody('Sony', 'Playstation 3');
		$file = AntieFrameworkTest::$frameworkDir.'/devicefragments/body/sony/playstation3';
		$this->assertStringEqualsFile($file, $body);
	}
	
	function testNormaliseKeyNamesReplacesSpecialCharactersWithUnderscores() {
		$this->assertEquals('one_two_three', $this->framework->normaliseKeyNames('one$two(three'));
	}
	
	function testNormaliseKeyNamesLowercases() {
		$this->assertEquals('one_two_three', $this->framework->normaliseKeyNames('one_TWO_Three'));
	}
	
	function testGetDeviceConfig() {
		$deviceConfigJSON = json_decode($this->framework->getConfigurationFromFilesystem('devices-sony-playstation_3-1','deviceconfig'));
		$this->assertEquals('tvpjsframework/devices/ps3', $deviceConfigJSON->modules->base);
	}
	
	function testGetAppConfig() {
		$appConfigJSON = json_decode($this->framework->getConfigurationFromFilesystem('sony-playstation_3','applicationconfig'));
		$this->assertEquals('devices-sony-playstation_3-1', $appConfigJSON->deviceConfigurationKey);
	}	
	
	function testAppConfigOverridesDeviceConfigWhenMerged() {
		$deviceConfigJSON = json_decode($this->framework->getConfigurationFromFilesystem('devices-html5-1','deviceconfig'));
		$appConfigJSON = json_decode($this->framework->getConfigurationFromFilesystem('chrome-1_0','applicationconfig'));
		$mergedConfig = AntieFramework::mergeConfigurations($deviceConfigJSON, $appConfigJSON);
		$this->assertEquals('overridetest', $mergedConfig->mediasets->tv);	
	}

}
