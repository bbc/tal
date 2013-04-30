var fs = require('fs');
var assert = require('assert');
var AntieFramework = require("../node/antieframework.js");


var AntieFrameworkTest = function() {

	var framework;

	var setUpNormalConfig = function() {
		framework = new AntieFramework("testconfig/config/");		
	}
	
	var testGenericTV1DeviceHasNoHeaders = function() {
		setUpNormalConfig();
		headers = framework.getDeviceHeaders(getGenericDevice1Config());
		assert.equal(headers, '');
	}
	
	var testGenericTV1DeviceHasNoBody = function ()
    {
    	setUpNormalConfig();
        body = framework.getDeviceBody(getGenericDevice1Config());
        assert.equal(body, '');
    }
    
     var testGenericTV1DeviceHasDefaultMimeType  = function ()
    {
    	setUpNormalConfig();
    	mimeType = framework.getMimeType(getGenericDevice1Config());
    	assert.equal(mimeType, 'text/html');
    }
    
    var testGenericTV1DeviceHasDefaultRootElement = function ()
    {
    	setUpNormalConfig();
    	rootElement = framework.getRootHtmlTag(getGenericDevice1Config());
    	assert.equal(rootElement, '<html>');
    }
    
    var testGenericTV1DeviceHasDefaultDocType = function ()
    {
    	setUpNormalConfig();
    	docType = framework.getDocType(getGenericDevice1Config());
    	assert.equal(docType, '<!DOCTYPE html>');
    }
    
    var testGenericTV2DeviceHasExpectedHeader = function ()
    {
    	setUpNormalConfig();
    	
    	headers = framework.getDeviceHeaders(getGenericDevice2Config());
    	assert.equal(headers, 'expectedheader');
    }
    
    var testGenericTV2DeviceHasExpectedBody = function ()
    {
    	setUpNormalConfig();
    	body = framework.getDeviceBody(getGenericDevice2Config());
    	assert.equal(body, 'expectedbody');
    }
    
    var testGenericTV2DeviceHasExpectedMimeType = function ()
    {
    	setUpNormalConfig();
    	mimeType = framework.getMimeType(getGenericDevice2Config());
    	assert.equal(mimeType, 'expectedmimetype');
    }
    
    var testGenericTV2DeviceHasExpectedRootElement = function ()
    {
    	setUpNormalConfig();
    	rootElement = framework.getRootHtmlTag(getGenericDevice2Config());
    	assert.equal(rootElement, 'expectedrootelement');
    }
    
    var testGenericTV2DeviceHasExpectedDocType = function ()
    {
    	setUpNormalConfig();
    	docType = framework.getDocType(getGenericDevice2Config());
    	assert.equal(docType, 'expecteddoctype');
    }
    
    var testNormaliseKeyNamesReplacesSpecialCharactersWithUnderscores = function ()
    {
    	setUpNormalConfig();
        assert.equal('one_two_three', framework.normaliseKeyNames('one$two(three'));
    }
    
    var testNormaliseKeyNamesLowercases =  function ()
    {
    	setUpNormalConfig();
        assert.equal('one_two_three', framework.normaliseKeyNames('one_TWO_Three'));
    }
    
    var testGetDeviceConfig = function ()
    {
    	setUpNormalConfig();
        deviceConfigJSON = getGenericDevice1Config();
        assert.equal('antie/devices/browserdevice', deviceConfigJSON.modules.base);
    }
    
    var testGetAppConfig = function ()
    {
    	setUpNormalConfig();
        appConfigJSON = framework.getConfigurationFromFilesystem('generic-tv1', 'applicationconfig');
        assert.equal('generic-tv1', appConfigJSON.deviceConfigurationKey);
    }
    
    var testGetAppConfigAlt = function ()
    {
    	setUpNormalConfig();
    	appConfigJSON = framework.getConfigurationFromFilesystem('generic-tv2', 'applicationconfig');
    	assert.equal('generic-tv2', appConfigJSON.deviceConfigurationKey);
    }
    
    var testAppConfigOverridesDeviceConfigWhenMerged = function ()
    {
    	setUpNormalConfig();
        deviceConfigJSON = getGenericDevice1Config();
        appConfigJSON = framework.getConfigurationFromFilesystem('generic-tv1', 'applicationconfig');
        mergedConfig = framework.mergeConfigurations( deviceConfigJSON, appConfigJSON );
        assert.equal( 'overridetest', mergedConfig.deviceelements.deviceelement1 );
    }
  
	function getGenericDevice1Config() {
		return framework.getConfigurationFromFilesystem('generic-tv1',  'deviceconfig');
	}
	
	function getGenericDevice2Config()
    {
        return framework.getConfigurationFromFilesystem('generic-tv2',  'deviceconfig');
    }

	var getFramework = function() {
		return framework;
	}

	return {
		getFramework : getFramework,
		testGenericTV1DeviceHasNoHeaders : testGenericTV1DeviceHasNoHeaders,
		testGenericTV1DeviceHasNoBody: testGenericTV1DeviceHasNoBody,
		testGenericTV1DeviceHasDefaultMimeType: testGenericTV1DeviceHasDefaultMimeType,
		testGenericTV1DeviceHasDefaultRootElement: testGenericTV1DeviceHasDefaultRootElement,
		testGenericTV1DeviceHasDefaultDocType: testGenericTV1DeviceHasDefaultDocType,
		testGenericTV2DeviceHasExpectedHeader: testGenericTV2DeviceHasExpectedHeader,
		testGenericTV2DeviceHasExpectedBody: testGenericTV2DeviceHasExpectedBody,
		testGenericTV2DeviceHasExpectedMimeType: testGenericTV2DeviceHasExpectedMimeType,
		testGenericTV2DeviceHasExpectedRootElement: testGenericTV2DeviceHasExpectedRootElement,
		testGenericTV2DeviceHasExpectedDocType: testGenericTV2DeviceHasExpectedDocType,
		testNormaliseKeyNamesReplacesSpecialCharactersWithUnderscores: testNormaliseKeyNamesReplacesSpecialCharactersWithUnderscores,
		testNormaliseKeyNamesLowercases: testNormaliseKeyNamesLowercases,
		testGetDeviceConfig: testGetDeviceConfig,
		testGetAppConfig: testGetAppConfig,
		testGetAppConfigAlt: testGetAppConfigAlt,
		testAppConfigOverridesDeviceConfigWhenMerged: testAppConfigOverridesDeviceConfigWhenMerged
	}

}

var test = new AntieFrameworkTest();

test.testGenericTV1DeviceHasNoHeaders();
test.testGenericTV1DeviceHasNoBody();
test.testGenericTV1DeviceHasDefaultMimeType();
test.testGenericTV1DeviceHasDefaultRootElement();
test.testGenericTV1DeviceHasDefaultDocType();
test.testGenericTV2DeviceHasExpectedHeader();
test.testGenericTV2DeviceHasExpectedBody();
test.testGenericTV2DeviceHasExpectedMimeType();
test.testGenericTV2DeviceHasExpectedRootElement();
test.testGenericTV2DeviceHasExpectedDocType();
test.testNormaliseKeyNamesReplacesSpecialCharactersWithUnderscores();
test.testNormaliseKeyNamesLowercases();
test.testGetDeviceConfig();
test.testGetAppConfig();
test.testGetAppConfigAlt();
test.testAppConfigOverridesDeviceConfigWhenMerged();

