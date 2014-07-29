<?php
require_once '../php/antieframework.php';

class AntieFrameworkTest extends PHPUnit_Framework_TestCase
{

    private static $frameworkDir;
    private static $testConfigDir;

    private $framework;

    protected function setUp()
    {
        $this->framework = new AntieFramework();

        if (!isset(self::$frameworkDir)) {
            self::$frameworkDir = realpath(dirname(__FILE__) . "/../config");
            self::$testConfigDir = realpath(dirname(__FILE__) . "/testconfig");

            //include path needs to pick up the test config first
            $includePath = get_include_path();
            set_include_path(self::$testConfigDir . PATH_SEPARATOR . self::$frameworkDir . PATH_SEPARATOR . $includePath);
        }
    }

    function testDefaultDeviceHasNoHeaders()
    {
        $headers = $this->framework->getDeviceHeaders( $this->getHtml5DeviceConfig() );
        $this->assertEquals( '', $headers );
    }

    function testSamsung2012HasNoDeviceHeaders()
    {
        $headers = $this->framework->getDeviceHeaders( $this->getSamsung2012DeviceConfig());
        $this->assertEquals( '', $headers );
    }

    function testSamsung2012HasNoDeviceBody()
    {
        $body = $this->framework->getDeviceBody( $this->getSamsung2012DeviceConfig());
        $this->assertEquals( '', $body );
    }

    function testSamsungMapleHasSpecialDeviceHeaders()
    {
        $headers = $this->framework->getDeviceHeaders( $this->getSamsungMapleDeviceConfig());
        $file = AntieFrameworkTest::$frameworkDir . '/pagestrategy/samsungmaple/header';
        $this->assertStringEqualsFile($file, $headers);
    }

    function testSamsungMapleHasSpecialDeviceBody()
    {
        $body = $this->framework->getDeviceBody($this->getSamsungMapleDeviceConfig());
        $file = AntieFrameworkTest::$frameworkDir . '/pagestrategy/samsungmaple/body';
        $this->assertStringEqualsFile($file, $body);
    }

    function testSonyDeviceBody()
    {
        $body = $this->framework->getDeviceBody( $this->getSony2012DeviceConfig());
        $this->assertEquals('', $body);
    }

    function testSonyPlaystation3DeviceBody()
    {
        $body = $this->framework->getDeviceBody( $this->getPS3DeviceConfig());
        $file = AntieFrameworkTest::$frameworkDir . '/pagestrategy/playstation3/body';
        $this->assertStringEqualsFile($file, $body);
    }

    function testNormaliseKeyNamesReplacesSpecialCharactersWithUnderscores()
    {
        $this->assertEquals('one_two_three', $this->framework->normaliseKeyNames('one$two(three'));
    }

    function testNormaliseKeyNamesLowercases()
    {
        $this->assertEquals('one_two_three', $this->framework->normaliseKeyNames('one_TWO_Three'));
    }

    function testGetDeviceConfig()
    {
        $deviceConfigJSON = $this->getPS3DeviceConfig();
        $this->assertEquals('antie/devices/ps3', $deviceConfigJSON->modules->base);
    }

    function testGetAppConfig()
    {
        $appConfigJSON = json_decode($this->framework->getConfigurationFromFilesystem('sony-playstation_3', 'applicationconfig'));
        $this->assertEquals('devices-sony-playstation_3-5', $appConfigJSON->deviceConfigurationKey);
    }

    function testAppConfigOverridesDeviceConfigWhenMerged()
    {
        $deviceConfigJSON = $this->getHtml5DeviceConfig();
        $appConfigJSON = json_decode($this->framework->getConfigurationFromFilesystem('chrome-1_0', 'applicationconfig'));
        $mergedConfig = AntieFramework::mergeConfigurations($deviceConfigJSON, $appConfigJSON);
        $this->assertEquals('overridetest', $mergedConfig->mediasets->tv);
    }

    function getSamsung2012DeviceConfig()
    {
        return json_decode($this->framework->getConfigurationFromFilesystem('devices-samsung-tv_2012-1', 'deviceconfig'));
    }

    function getSamsungMapleDeviceConfig()
    {
        return json_decode($this->framework->getConfigurationFromFilesystem('devices-samsung-4', 'deviceconfig'));
    }

    function getPS3DeviceConfig()
    {
        return json_decode($this->framework->getConfigurationFromFilesystem('devices-sony-playstation_3-5', 'deviceconfig'));
    }

    function getHtml5DeviceConfig()
    {
        return json_decode($this->framework->getConfigurationFromFilesystem('devices-html5-4', 'deviceconfig'));
    }

    function getSony2012DeviceConfig()
    {
        return json_decode($this->framework->getConfigurationFromFilesystem('devices-sony-tv_2012-1', 'deviceconfig'));
    }

    function testHbbTvMimeType()
    {
        $sonyDeviceConfig = $this->getSony2012DeviceConfig();
        $this->assertNotNull($sonyDeviceConfig);
        $this->assertEquals('application/vnd.hbbtv.xhtml+xml', $this->framework->getMimeType($sonyDeviceConfig));
    }

    function testHtml5MimeType()
    {
        $html5DeviceConfig = $this->getHtml5DeviceConfig();
        $this->assertEquals('text/html', $this->framework->getMimeType($html5DeviceConfig));
    }

    function testHbbTvDocType()
    {
        $sonyDeviceConfig = $this->getSony2012DeviceConfig();
        $this->assertEquals('<!DOCTYPE html PUBLIC "-//HbbTV//1.1.1//EN" "http://www.hbbtv.org/dtd/HbbTV-1.1.1.dtd">',
                            $this->framework->getDocType($sonyDeviceConfig));
    }

    function testHtml5DocType()
    {
        $html5DeviceConfig = $this->getHtml5DeviceConfig();
        $this->assertEquals('<!DOCTYPE html>', $this->framework->getDocType($html5DeviceConfig));
    }

    function testHtml5RootElement()
    {
        $html5DeviceConfig = $this->getHtml5DeviceConfig();
        $this->assertEquals('<html>', $this->framework->getRootHtmlTag($html5DeviceConfig));
    }

    function testHbbTvRootElement()
    {
        $sonyDeviceConfig = $this->getSony2012DeviceConfig();
        $this->assertEquals('<html xmlns="http://www.w3.org/1999/xhtml">', $this->framework->getRootHtmlTag($sonyDeviceConfig));
    }

}
