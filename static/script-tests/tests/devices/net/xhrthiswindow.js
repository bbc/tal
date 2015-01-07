/**
 * @preserve Copyright (c) 2015 British Broadcasting Corporation
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

(function() {
	this.XHRThisWindowNetworkTest = AsyncTestCase("Network (xhrthiswindow)");

	this.XHRThisWindowNetworkTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
        this.xhr = sinon.useFakeXMLHttpRequest();

        var requests = [];
        this.requests = requests;

        this.xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };
	};

	this.XHRThisWindowNetworkTest.prototype.tearDown = function() {
		this.sandbox.restore();
        this.xhr.restore();
	};

	// make sure test hangs in there until after timeouts and responses have all completed
	this.XHRThisWindowNetworkTest.prototype.waitFor = function(callbacks, timeInMillis) {
		var notify = callbacks.add(function() { }, config);
		setTimeout(notify, timeInMillis);
	};

    var config = {
        "modules": {
            "base": "antie/devices/browserdevice",
            "modifiers": [
                "antie/devices/net/default",
                "antie/devices/net/xhrthiswindow",
                "antie/devices/data/json2"
            ]
        },
        "input": {
            "map": {}
        },
        "layouts": [
            {
                "width": 960,
                "height": 540,
                "module": "fixtures/layouts/default",
                "classes": ["browserdevice540p"]
            }
        ],
        "deviceConfigurationKey": "devices-html5-1"
    };

	this.XHRThisWindowNetworkTest.prototype.testLoadAuthenticatedURL = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var opts = {
                onLoad: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            device.loadAuthenticatedURL("/test/script-tests/fixtures/test.json", opts);

            assertEquals(1, this.requests.length);

            this.requests[0].respond(200, { "Content-Type": "application/json" }, '{"hello":"world"}');

            assert(opts.onError.notCalled);
            assert(opts.onLoad.calledOnce);
            assert(opts.onLoad.calledWith('{"hello":"world"}', 200));
		}, config);
	};

	this.XHRThisWindowNetworkTest.prototype.testLoadAuthenticatedURLError = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var opts = {
                onLoad: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            device.loadAuthenticatedURL("/test/script-tests/fixtures/doesnotexist.json", opts);

            assertEquals(1, this.requests.length);

            this.requests[0].respond(404, { "Content-Type": "application/json" }, '{"hello":"world"}');

            assert(opts.onLoad.notCalled);
            assert(opts.onError.calledOnce);
            assert(opts.onError.calledWith('{"hello":"world"}', 404));
		}, config);
	};


	this.XHRThisWindowNetworkTest.prototype.testLoadURL = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var opts = {
                onLoad: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            device.loadURL("/test/script-tests/fixtures/test.json", opts);

            assertEquals(1, this.requests.length);

            this.requests[0].respond(200, { "Content-Type": "application/json" }, '{"hello":"world"}');

            assert(opts.onError.notCalled);
            assert(opts.onLoad.calledOnce);
            assert(opts.onLoad.calledWith('{"hello":"world"}', 200));
		}, config);
	};

    this.XHRThisWindowNetworkTest.prototype.testLoadURLWith202StatusCodeAsASuccess = function (queue) {
        expectAsserts(4);

        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function (application, BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var opts = {
                onLoad: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            device.loadURL("/test/script-tests/fixtures/test.json", opts);

            assertEquals(1, this.requests.length);

            this.requests[0].respond(202, { "Content-Type": "application/json" }, '{"hello":"world"}');

            assert(opts.onError.notCalled);
            assert(opts.onLoad.calledOnce);
            assert(opts.onLoad.calledWith('{"hello":"world"}', 202));
        }, config);
    };

    this.XHRThisWindowNetworkTest.prototype.testLoadURLWithA300StatusCodeAsAnError = function(queue) {
        expectAsserts(4);

        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var opts = {
                onLoad: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            device.loadURL("/test/script-tests/fixtures/test.json", opts);

            assertEquals(1, this.requests.length);

            this.requests[0].respond(300, { "Content-Type": "application/json" }, '{"hello":"world"}');

            assert(opts.onLoad.notCalled);
            assert(opts.onError.calledOnce);
            assert(opts.onError.calledWith('{"hello":"world"}', 300));
        }, config);
    };

	this.XHRThisWindowNetworkTest.prototype.testLoadURLError = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var opts = {
                onLoad: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            device.loadURL("/test/script-tests/fixtures/doesnotexist.json", opts);

            assertEquals(1, this.requests.length);

            this.requests[0].respond(404, { "Content-Type": "application/json" }, '{"hello":"world"}');

            assert(opts.onLoad.notCalled);
            assert(opts.onError.calledOnce);
            assert(opts.onError.calledWith('{"hello":"world"}', 404));
		}, config);
	};

	this.XHRThisWindowNetworkTest.prototype.testExecuteCrossDomainGetParsesJsonResponseFromLoadUrlWhenCorsIsSupported = function(queue) {
        expectAsserts(3);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice({"networking": { "supportsCORS": true }});
			var testUrl = "http://test";
			var successSpy = this.sandbox.stub();

			device.executeCrossDomainGet(testUrl, {onSuccess: successSpy});

            assertEquals(1, this.requests.length);

            this.requests[0].respond(200, { "Content-Type": "application/json" }, '{ "test" : "myValue" }');

            assert(successSpy.calledOnce);
            assert(successSpy.calledWith({ "test" : "myValue" }));
		}, config);
	},

	this.XHRThisWindowNetworkTest.prototype.testExecuteCrossDomainGetHandlesErrorFromLoadUrlWhenCorsIsSupported = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice({"networking": { "supportsCORS": true }});
			var testUrl = "http://test";
			var errorSpy = this.sandbox.stub();

			device.executeCrossDomainGet(testUrl, {onError: errorSpy});

            assertEquals(1, this.requests.length);

            this.requests[0].respond(500, {}, '{}');

            assert(errorSpy.calledOnce);
        }, config);
	}
}());
