var fs = require("fs");
var assert = require("assert");
var AntieFramework = require("../node/antieframework.js");

var AntieFrameworkTest = function() {

    var framework;

    var setUpNormalConfig = function() {
        framework = new AntieFramework("testconfig/", "testconfig/config/");
    }
    var testGenericTV1DeviceHasNoHeaders = function() {
        setUpNormalConfig();
        var headers = framework.getDeviceHeaders(getGenericDevice1Config());
        assert.strictEqual(headers, "");
    }
    var testGenericTV1DeviceHasNoBody = function() {
        setUpNormalConfig();
        body = framework.getDeviceBody(getGenericDevice1Config());
        assert.strictEqual(body, "");
    }
    var testGenericTV1DeviceHasDefaultMimeType = function() {
        setUpNormalConfig();
        mimeType = framework.getMimeType(getGenericDevice1Config());
        assert.strictEqual(mimeType, "text/html");
    }
    var testGenericTV1DeviceHasDefaultRootElement = function() {
        setUpNormalConfig();
        rootElement = framework.getRootHtmlTag(getGenericDevice1Config());
        assert.strictEqual(rootElement, "<html>");
    }
    var testGenericTV1DeviceHasDefaultDocType = function() {
        setUpNormalConfig();
        docType = framework.getDocType(getGenericDevice1Config());
        assert.strictEqual(docType, "<!DOCTYPE html>");
    }
    var testGenericTV2DeviceHasExpectedHeader = function() {
        setUpNormalConfig();

        headers = framework.getDeviceHeaders(getGenericDevice2Config());
        assert.strictEqual(headers, "expectedheader");
    }
    var testGenericTV2DeviceHasExpectedBody = function() {
        setUpNormalConfig();
        body = framework.getDeviceBody(getGenericDevice2Config());
        assert.strictEqual(body, "expectedbody");
    }
    var testGenericTV2DeviceHasExpectedMimeType = function() {
        setUpNormalConfig();
        mimeType = framework.getMimeType(getGenericDevice2Config());
        assert.strictEqual(mimeType, "expectedmimetype");
    }
    var testGenericTV2DeviceHasExpectedRootElement = function() {
        setUpNormalConfig();
        rootElement = framework.getRootHtmlTag(getGenericDevice2Config());
        assert.strictEqual(rootElement, "expectedrootelement");
    }
    var testGenericTV2DeviceHasExpectedDocType = function() {
        setUpNormalConfig();
        docType = framework.getDocType(getGenericDevice2Config());
        assert.strictEqual(docType, "expecteddoctype");
    }
    var testNormaliseKeyNamesReplacesSpecialCharactersWithUnderscores = function() {
        setUpNormalConfig();
        assert.strictEqual(framework.normaliseKeyNames("one$two(three"), "one_two_three");
    }
    var testNormaliseKeyNamesLowercases = function() {
        setUpNormalConfig();
        assert.strictEqual(framework.normaliseKeyNames("one_TWO_Three"), "one_two_three");
    }
    var testGetDeviceConfig = function() {
        setUpNormalConfig();
        deviceConfigJSON = getGenericDevice1Config();
        assert.strictEqual(deviceConfigJSON.modules.base, "antie/devices/browserdevice");
    }
    var testGetAppConfig = function() {
        setUpNormalConfig();
        appConfigJSON = JSON.parse(framework.getConfigurationFromFilesystem("generic-tv1", "applicationconfig"));
        assert.strictEqual(appConfigJSON.deviceConfigurationKey, "generic-tv1");
    }
    var testGetAppConfigAlt = function() {
        setUpNormalConfig();
        appConfigJSON = JSON.parse(framework.getConfigurationFromFilesystem("generic-tv2", "applicationconfig"));
        assert.strictEqual(appConfigJSON.deviceConfigurationKey, "generic-tv2");
    }
    var testAppConfigOverridesDeviceConfigWhenMerged = function() {
        setUpNormalConfig();
        deviceConfigJSON = getGenericDevice1Config();
        appConfigJSON = JSON.parse(framework.getConfigurationFromFilesystem("generic-tv1", "applicationconfig"));
        mergedConfig = framework.mergeConfigurations(deviceConfigJSON, appConfigJSON);
        assert.strictEqual(mergedConfig.deviceelements.deviceelement1, "overridetest");
    }
    function getGenericDevice1Config() {
        var json = JSON.parse(framework.getConfigurationFromFilesystem("generic-tv1", "deviceconfig"));
        return json;
    }

    function getGenericDevice2Config() {
        var json = JSON.parse(framework.getConfigurationFromFilesystem("generic-tv2", "deviceconfig"));
        return json;
    }

    var getFramework = function() {
        return framework;
    }

    return {
        getFramework : getFramework,
        testGenericTV1DeviceHasNoHeaders : testGenericTV1DeviceHasNoHeaders,
        testGenericTV1DeviceHasNoBody : testGenericTV1DeviceHasNoBody,
        testGenericTV1DeviceHasDefaultMimeType : testGenericTV1DeviceHasDefaultMimeType,
        testGenericTV1DeviceHasDefaultRootElement : testGenericTV1DeviceHasDefaultRootElement,
        testGenericTV1DeviceHasDefaultDocType : testGenericTV1DeviceHasDefaultDocType,
        testGenericTV2DeviceHasExpectedHeader : testGenericTV2DeviceHasExpectedHeader,
        testGenericTV2DeviceHasExpectedBody : testGenericTV2DeviceHasExpectedBody,
        testGenericTV2DeviceHasExpectedMimeType : testGenericTV2DeviceHasExpectedMimeType,
        testGenericTV2DeviceHasExpectedRootElement : testGenericTV2DeviceHasExpectedRootElement,
        testGenericTV2DeviceHasExpectedDocType : testGenericTV2DeviceHasExpectedDocType,
        testNormaliseKeyNamesReplacesSpecialCharactersWithUnderscores : testNormaliseKeyNamesReplacesSpecialCharactersWithUnderscores,
        testNormaliseKeyNamesLowercases : testNormaliseKeyNamesLowercases,
        testGetDeviceConfig : testGetDeviceConfig,
        testGetAppConfig : testGetAppConfig,
        testGetAppConfigAlt : testGetAppConfigAlt,
        testAppConfigOverridesDeviceConfigWhenMerged : testAppConfigOverridesDeviceConfigWhenMerged
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

