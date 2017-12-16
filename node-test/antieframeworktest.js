var fs = require("fs");
var assert = require("assert");
var AntieFramework = require("../node/antieframework.js");

var AntieFrameworkTest = function() {

    var framework;

	module.exports = {
		'Generic TV1 Device has no Headers' : function(test) {
			setUpNormalConfig();
			var headers = framework.getDeviceHeaders(getGenericDevice1Config());
			test.ok(!headers.trim(), "The device headers are not empty. It contains: " + headers);
			test.done();
		},

		'Generic TV1 Device has no body'  : function(test) {
			setUpNormalConfig();
			body = framework.getDeviceBody(getGenericDevice1Config());
			test.ok(!body.trim(), "The device body is not empty. It contains: " + body);
			test.done();
		},

		'Generic TV1 Device has default Mime type' : function(test) {
			setUpNormalConfig();
			mimeType = framework.getMimeType(getGenericDevice1Config());
			test.ok(mimeType == "text/html", "The mime type is not text/html. The value was " + mimeType);
			test.done();
		},

		'Generic TV1 Device has default Root element' : function(test) {
			setUpNormalConfig();
			rootElement = framework.getRootHtmlTag(getGenericDevice1Config());
			test.ok(rootElement == "<html>", "The root element is not '<html>'. The value was " + rootElement);
			test.done();
		},

		'Generic TV1 Device has default Doc type' : function(test) {
			setUpNormalConfig();
			rootElement = framework.getDocType(getGenericDevice1Config());
			test.ok(rootElement == "<!DOCTYPE html>", "The device does not have the default doc type (<!DOCTYPE html>). The value was " + rootElement);
			test.done();
		},

		'Device has expected header' : function(test) {
			setUpNormalConfig();
			headers = framework.getDeviceHeaders({
				pageStrategy: "samsungmaple"
			});
			var expected = fs.readFileSync('../node_modules/tal-page-strategies/samsungmaple/header', 'UTF-8');
			test.ok(headers === expected, "The device header was not the expected value. The value was " + headers);
			test.done();
		},

		'Device has expected body' : function(test) {
			setUpNormalConfig();
			body = framework.getDeviceBody(getHbbtvDeviceConfig());
			var expected = fs.readFileSync('../node_modules/tal-page-strategies/hbbtv/body', 'UTF-8');
			test.ok(body === expected, "The device body was not the expected value. The value was " + body);
			test.done();
		},

		'Device has expected Mime type' : function(test) {
			setUpNormalConfig();
			mimeType = framework.getMimeType(getHbbtvDeviceConfig());
			var expected = fs.readFileSync('../node_modules/tal-page-strategies/hbbtv/mimetype', 'UTF-8');
			test.ok(mimeType === expected, "The device mime type was not the expected value. It was " + mimeType);
			test.done();
		},

		'Device has expected Root element' : function(test) {
			setUpNormalConfig();
			rootElement = framework.getRootHtmlTag(getHbbtvDeviceConfig());
			var expected = fs.readFileSync('../node_modules/tal-page-strategies/hbbtv/rootelement', 'UTF-8');
			test.ok(rootElement === expected, "The device root element was not the expected value. It was " + rootElement);
			test.done();
		},

		'Device has expected Doc type' : function(test) {
			setUpNormalConfig();
			docType = framework.getDocType(getHbbtvDeviceConfig());
			var expected = fs.readFileSync('../node_modules/tal-page-strategies/hbbtv/doctype', 'UTF-8');
			test.ok(docType === expected, "The device doc type was not the expected value. It was " + docType);
			test.done();
		},

		'Normalise key names replaces special characters with underscores' : function(test) {
			setUpNormalConfig();
			test.ok(framework.normaliseKeyNames("one$two(three") == "one_two_three", "The key names did not have special characters replaced with underscores. The key names are one$two(three");
			test.done();
		},

		'Normalise key names replaces upper case to lower case' : function(test) {
			setUpNormalConfig();
			test.ok(framework.normaliseKeyNames("one_TWO_Three") == "one_two_three", "The key names were not set to lower case. The key names were: one_TWO_Three");
			test.done();
		},

		'Get generic device config' : function(test) {
			setUpNormalConfig();
			deviceConfigJSON = getGenericDevice1Config();
			test.ok(deviceConfigJSON.modules.base == "antie/devices/browserdevice", "The generic device config was not fetched. The returned json is: " + deviceConfigJSON.modules.base);
			test.done();
		},

		'Get generic app config' : function(test) {
			setUpNormalConfig();
			appConfigJSON = JSON.parse(framework.getConfigurationFromFilesystem("generic-tv1", "applicationconfig"));
			test.ok(appConfigJSON.deviceConfigurationKey == "generic-tv1", "The generic app config was not parsed correctly. The returned json is: " + appConfigJSON);
			test.done();
		},

		'Get generic app config (Alt)' : function(test) {
			setUpNormalConfig();
			appConfigJSON = JSON.parse(framework.getConfigurationFromFilesystem("generic-tv2", "applicationconfig"));
			test.ok(appConfigJSON.deviceConfigurationKey == "generic-tv2", "The generic app config (alt) was not parsed correctly. The returned json is: " + appConfigJSON);
			test.done();
		},

		'App config overrides device config when merged' : function(test) {
			setUpNormalConfig();
			deviceConfigJSON = getGenericDevice1Config();
			appConfigJSON = JSON.parse(framework.getConfigurationFromFilesystem("generic-tv1", "applicationconfig"));
			mergedConfig = framework.mergeConfigurations(deviceConfigJSON, appConfigJSON);
			test.ok(mergedConfig.deviceelements.deviceelement1 == "overridetest", "The config override was unsuccessful. The merged config returned " + mergedConfig.deviceelements.deviceelement1);
			test.done();
		},
	};

    var setUpNormalConfig = function() {
        framework = new AntieFramework("../server-tests/fixtures/", "../server-tests/fixtures/");
    }

    function getGenericDevice1Config() {
        var json = JSON.parse(framework.getConfigurationFromFilesystem("generic-tv1", "deviceconfig"));
        return json;
    }

    function getHbbtvDeviceConfig() {
        return {
            pageStrategy: 'hbbtv'
        };
    }

    var getFramework = function() {
        return framework;
    }

    return {
        getFramework : getFramework
    }

}
var test = new AntieFrameworkTest();
