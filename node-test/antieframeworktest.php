<?php

/**
 * @copyright Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */

require_once '../php/antieframework.php';

class AntieFrameworkTest extends PHPUnit_Framework_TestCase
{

    private static $frameworkDir;
    private static $testConfigDir;

    private $framework;

    protected function setUpNormalConfig()
    {
        $this->framework = new AntieFramework();

        if (!isset(self::$frameworkDir)) {
            self::$frameworkDir = realpath(dirname(__FILE__) . "/testconfig/config");
            self::$testConfigDir = realpath(dirname(__FILE__) . "/testconfig");

            //include path needs to pick up the test config first
            $includePath = get_include_path();
            set_include_path(self::$testConfigDir . PATH_SEPARATOR . self::$frameworkDir . PATH_SEPARATOR . $includePath);
        }
    }
    
    protected function setUpAltConfig()
    {
    	$path = realpath(dirname(__FILE__) . "/../php-test/testconfig/");
    	$this->framework = new AntieFramework( $path );
    	 
    	if (!isset(self::$frameworkDir)) {
    		self::$frameworkDir = realpath(dirname(__FILE__) . "/testconfig/config");
    		self::$testConfigDir = realpath(dirname(__FILE__) . "/testconfig");
    
    		//include path needs to pick up the test config first
    		$includePath = get_include_path();
    		set_include_path(self::$testConfigDir . PATH_SEPARATOR . self::$frameworkDir . PATH_SEPARATOR . $includePath);
    	}
    }

    function testGenericTV1DeviceHasNoHeaders()
    {
    	$this->setUpNormalConfig();
        $headers = $this->framework->getDeviceHeaders( $this->getGenericDevice1Config() );
        $this->assertEquals( '', $headers );
    }
    
    function testGenericTV1DeviceHasNoBody()
    {
    	$this->setUpNormalConfig();
        $body = $this->framework->getDeviceBody( $this->getGenericDevice1Config() );
        $this->assertEquals( '', $body);
    }
    
    function testGenericTV1DeviceHasDefaultMimeType()
    {
    	$this->setUpNormalConfig();
    	$mimeType = $this->framework->getMimeType( $this->getGenericDevice1Config() );
    	$this->assertEquals( 'text/html', $mimeType);
    }
    
    function testGenericTV1DeviceHasDefaultRootElement()
    {
    	$this->setUpNormalConfig();
    	$rootElement = $this->framework->getRootHtmlTag( $this->getGenericDevice1Config() );
    	$this->assertEquals( '<html>', $rootElement );
    }
    
    function testGenericTV1DeviceHasDefaultDocType()
    {
    	$this->setUpNormalConfig();
    	$docType = $this->framework->getDocType( $this->getGenericDevice1Config() );
    	$this->assertEquals( '<!DOCTYPE html>', $docType );
    }
    
    function testGenericTV2DeviceHasExpectedHeader()
    {
    	$this->setUpNormalConfig();
    	
    	$headers = $this->framework->getDeviceHeaders( $this->getGenericDevice2Config() );
    	$this->assertEquals( 'expectedheader', $headers );
    }
    
    function testGenericTV2DeviceHasExpectedBody()
    {
    	$this->setUpNormalConfig();
    	$body = $this->framework->getDeviceBody( $this->getGenericDevice2Config() );
    	$this->assertEquals( 'expectedbody', $body);
    }
    
    function testGenericTV2DeviceHasExpectedMimeType()
    {
    	$this->setUpNormalConfig();
    	$mimeType = $this->framework->getMimeType( $this->getGenericDevice2Config() );
    	$this->assertEquals( 'expectedmimetype', $mimeType);
    }
    
    function testGenericTV2DeviceHasExpectedRootElement()
    {
    	$this->setUpNormalConfig();
    	$rootElement = $this->framework->getRootHtmlTag( $this->getGenericDevice2Config() );
    	$this->assertEquals( 'expectedrootelement', $rootElement );
    }
    
    function testGenericTV2DeviceHasExpectedDocType()
    {
    	$this->setUpNormalConfig();
    	$docType = $this->framework->getDocType( $this->getGenericDevice2Config() );
    	$this->assertEquals( 'expecteddoctype', $docType );
    }
    
    function testNormaliseKeyNamesReplacesSpecialCharactersWithUnderscores()
    {
    	$this->setUpNormalConfig();
        $this->assertEquals('one_two_three', $this->framework->normaliseKeyNames('one$two(three'));
    }

    function testNormaliseKeyNamesLowercases()
    {
    	$this->setUpNormalConfig();
        $this->assertEquals('one_two_three', $this->framework->normaliseKeyNames('one_TWO_Three'));
    }

    function testGetDeviceConfig()
    {
    	$this->setUpNormalConfig();
        $deviceConfigJSON = $this->getGenericDevice1Config();
        $this->assertEquals('antie/devices/browserdevice', $deviceConfigJSON->modules->base);
    }

    function testGetAppConfig()
    {
    	$this->setUpNormalConfig();
        $appConfigJSON = json_decode($this->framework->getConfigurationFromFilesystem('generic-tv1', 'applicationconfig'));
        $this->assertEquals('generic-tv1', $appConfigJSON->deviceConfigurationKey);
    }
    
    
    function testGetAppConfigAlt()
    {
    	$this->setUpAltConfig();
    	$appConfigJSON = json_decode($this->framework->getConfigurationFromFilesystem('generic-tv2', 'applicationconfig'));
    	$this->assertEquals('generic-tv2', $appConfigJSON->deviceConfigurationKey);
    }

    function testAppConfigOverridesDeviceConfigWhenMerged()
    {
    	$this->setUpNormalConfig();
        $deviceConfigJSON = $this->getGenericDevice1Config();
        $appConfigJSON = json_decode($this->framework->getConfigurationFromFilesystem('generic-tv1', 'applicationconfig'));
        $mergedConfig = AntieFramework::mergeConfigurations( $deviceConfigJSON, $appConfigJSON );
        $this->assertEquals( 'overridetest', $mergedConfig->deviceelements->deviceelement1 );
    }
    
    function getGenericDevice1Config()
    {
        return json_decode($this->framework->getConfigurationFromFilesystem('generic-tv1', 'deviceconfig'));
    }

    function getGenericDevice2Config()
    {
        return json_decode($this->framework->getConfigurationFromFilesystem('generic-tv2', 'deviceconfig'));
    }
}
