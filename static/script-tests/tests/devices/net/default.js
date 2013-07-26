/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
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
	this.DefaultNetworkTest = AsyncTestCase("Network (Default)");

	this.DefaultNetworkTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.DefaultNetworkTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};

	// make sure test hangs in there until after timeouts and responses have all completed
	this.DefaultNetworkTest.prototype.waitFor = function(callbacks, timeInMillis) {
		var notify = callbacks.add(function() { });
		setTimeout(notify, timeInMillis);
	};
	
	this.DefaultNetworkTest.prototype.testLoadScriptWithTimedOutResponse = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Waiting for script to load", function(callbacks) {

				var opts = {
					onError: callbacks.add(function() {
						assert("Expected on error to be called as timeout expired", true);
					}),
					onSuccess: function(data) {
						assert("Expected on success not to be called", false);
					}
				};
				device.loadScript("/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%", /%callback%/, opts, 100, "test1");
				this.waitFor(callbacks, 1000);
			});
		});
	};
	
	this.DefaultNetworkTest.prototype.testLoadScriptWithDefaultFiveSecondTimedOutResponse = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Waiting for script to load", function(callbacks) {

				var opts = {
					onError: callbacks.add(function() {
						assert("Expected on error to be called as timeout expired", true);
					}),
					onSuccess: function(data) {
						assert("Expected on success not to be called", false);
					}
				};
				device.loadScript("/test/script-tests/fixtures/timedoutdynamicscript.js?callback=%callback%", /%callback%/, opts, undefined, "test");
				this.waitFor(callbacks, 6000);
			});
		});
	};
		
	this.DefaultNetworkTest.prototype.testLoadScriptWithSuccessResponse = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Waiting for script to load", function(callbacks) {

				var opts = {
					onSuccess: callbacks.add(function(data) {
						assertEquals("Did not get on load response", "test1", data);
					}),
					onError: function() {
						assert("Timed out response should not occur", false);
					}
				};
				device.loadScript("/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%", /%callback%/, opts, 1000, "test1");
				this.waitFor(callbacks, 1500);
			});
		});
	};
	
	this.DefaultNetworkTest.prototype.testLoadScriptMultipleRequestsWithDifferentSuffixes = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Waiting for script to load", function(callbacks) {

				var opts1 = {
					onSuccess: callbacks.add(function(data) {
						assertEquals("Did not get success response for test1", "test1", data);
					})
				};
				var opts2 = {
					onSuccess: callbacks.add(function(data) {
						assertEquals("Did not get success response for test2", "test2", data);
					})
				};
				device.loadScript("/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%", /%callback%/, opts1, 1000, "test1");
				device.loadScript("/test/script-tests/fixtures/dynamicscript2.js?callback=%callback%", /%callback%/, opts2, 1000, "test2");
				this.waitFor(callbacks, 1500);
			});
		});
	};
	
	this.DefaultNetworkTest.prototype.testLoadScriptMultipleRequestsWithSameSuffixThrowsError = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Waiting for script to load", function(callbacks) {

				var opts = {
					onSuccess: callbacks.add(function(data) {
						assertEquals("Did not get expected success response from overridding call", "test1", data);
					})
				};
				device.loadScript("/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%", /%callback%/, opts, 1000, "test1");
				try {
					device.loadScript("/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%", /%callback%/, {}, 1, "test1");
				} catch (e){
					assert(true);
				}
				this.waitFor(callbacks, 1000);
			});
		});
	};
	
	this.DefaultNetworkTest.prototype.testLoadScriptSequentialRequestsWithSameSuffixAreAllowed = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Load first script", function(callbacks) {
				var opts = {
					onSuccess: callbacks.add(function(data) {
						assertEquals("Did not get expected success response from overridding call", "test1", data);
					})
				};
				
				device.loadScript("/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%", /%callback%/, opts, 1000, "test1");
				this.waitFor(callbacks, 1000);
			});
			queue.call("Load next script", function(callbacks) {
				var opts = {
					onSuccess: callbacks.add(function(data) {
						assertEquals("Did not get expected success response from overridding call", "test1", data);
					})
				};
					
				device.loadScript("/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%", /%callback%/, opts, 1000, "test1");
				this.waitFor(callbacks, 1000);
			});
		});
	};
	
	this.DefaultNetworkTest.prototype.testLoadScriptSubsequentRequestWithSameSuffixIsAllowedAfterTimeout = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Load first script", function(callbacks) {
				var opts = {
					onError: callbacks.add(function(data) {
						assert("Timeout should have triggered", true);
					})
				};
				
				device.loadScript("/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%", /%callback%/, opts, 10, "test1");
				this.waitFor(callbacks, 20);
			});
			queue.call("Load next script after timeout", function(callbacks) {
				var opts = {
					onSuccess: callbacks.add(function(data) {
						assertEquals("Did not get expected success response from overridding call", "test1", data);
					})
				};
					
				device.loadScript("/test/script-tests/fixtures/dynamicscript1.js?callback=%callback%", /%callback%/, opts, 1000, "test1");
				this.waitFor(callbacks, 1000);
			});
		});
	};
	
	this.DefaultNetworkTest.prototype.testLoadAuthenticatedURL = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Waiting for data to load", function(callbacks) {
				var opts = {
					onLoad: callbacks.add(function(data) {
						assertEquals('{"hello":"world"}', data);
					}),
					onError: callbacks.addErrback(function() {})
				};
				device.loadAuthenticatedURL("/test/script-tests/fixtures/test.json", opts);
			});
		});
	};

	this.DefaultNetworkTest.prototype.testLoadAuthenticatedURLError = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Waiting for data to load", function(callbacks) {
				var opts = {
					onLoad: callbacks.addErrback('Data should not have loaded succesfully'),
					onError: callbacks.add(function() {assert(true);})
				};
				device.loadAuthenticatedURL("/test/script-tests/fixtures/doesnotexist.json", opts);
			});
		});
	};


	this.DefaultNetworkTest.prototype.testLoadURL = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Waiting for data to load", function(callbacks) {
				var opts = {
					onLoad: callbacks.add(function(data) {
						assertEquals('{"hello":"world"}', data);
					}),
					onError: callbacks.addErrback(function() {})
				};
				device.loadURL("/test/script-tests/fixtures/test.json", opts);
			});
		});
	};
	
	this.DefaultNetworkTest.prototype.testLoadURLError = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Waiting for data to load", function(callbacks) {
				var opts = {
					onLoad: callbacks.addErrback(function() {}),
					onError: callbacks.add(function() {assert(true);})
				};
				device.loadURL("/test/script-tests/fixtures/doesnotexist.json", opts);
			});
		});
	};

	this.DefaultNetworkTest.prototype.testCrossDomainPost = function(queue) {
		expectAsserts(8);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Wait for cross domain post", function(callbacks) {

				device.crossDomainPost("http://example.com/test", {"goodbye":"salford", "hello":"world"}, {
					onLoad: callbacks.add(function() { assert(true); }),
					onError: callbacks.addErrback('post should complete succesfully'),
					blankUrl: "/test/script-tests/fixtures/blank.html"
				});

				var iframes = document.body.getElementsByTagName("iframe");
				assertEquals(1, iframes.length);

				var iframe = iframes[0];
				iframe.addEventListener('load', function() {
					iframe.removeEventListener('load', arguments.callee);

					window.setTimeout(function() {
						var doc = iframe.contentWindow.document;
						var forms = doc.body.getElementsByTagName("form");
						assertEquals(1, forms.length);
						var fields = forms[0].getElementsByTagName("input");
						assertEquals(2, fields.length);
						assertEquals("goodbye", fields[0].name);
						assertEquals("salford", fields[0].value);
						assertEquals("hello", fields[1].name);
						assertEquals("world", fields[1].value);
					}, 0);
				});
			});
		});

	};
	
	this.DefaultNetworkTest.prototype.testExecuteCrossDomainGetParsesJsonResponseFromLoadUrlWhenCorsIsSupported = function(queue) {
		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice({"networking": { "supportsCORS": true }});
			var resp = "{ \"test\" : \"myValue\" }";
			var testUrl = "http://test";
			var loadUrlSpy = this.sandbox.stub(BrowserDevice.prototype, 'loadURL', function(url, callbacks){
				assertEquals(url,testUrl);
				callbacks.onLoad( resp );
			});

			var successSpy = this.sandbox.spy();
			device.executeCrossDomainGet(testUrl, {onSuccess: successSpy});
			assert(successSpy.calledWith({ test : "myValue" }));
		});
	},
	
	this.DefaultNetworkTest.prototype.testExecuteCrossDomainGetHandlesErrorFromLoadUrlWhenCorsIsSupported = function(queue) {
		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice({"networking": { "supportsCORS": true }});
			var errorSpy = this.sandbox.spy();
			var testUrl = "http://test";
			var loadUrlSpy = this.sandbox.stub(BrowserDevice.prototype, 'loadURL', function(url, callbacks){
				assertEquals(url,testUrl);
				callbacks.onError();
			});

			device.executeCrossDomainGet(testUrl, {onError: errorSpy});
			assert(errorSpy.calledOnce);
		});
	},
	
	this.DefaultNetworkTest.prototype.testExecuteCrossDomainGetDelegatesToLoadScriptWhenCorsIsNotSupported = function(queue) {
		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice({"networking": { "supportsCORS": false }});
			var successSpy = this.sandbox.spy();
			var errorSpy = this.sandbox.spy();
			var loadUrlSpy = this.sandbox.spy();
			var myId = "test";
			var testTimeout = 1;
			var testUrl = "http://test";
			var loadScriptStub = this.sandbox.stub(BrowserDevice.prototype, 'loadScript', function(){});			
			device.executeCrossDomainGet(testUrl, {onSuccess: successSpy, onError: errorSpy}, {timeout: testTimeout, id: myId});
			assert(loadScriptStub.calledWith(testUrl + "?callback=%callback%", /%callback%/, {onSuccess : successSpy, onError : errorSpy}, testTimeout, myId));
		});
	},
	
    this.DefaultNetworkTest.prototype.testExecuteCrossDomainDelegationToLoadScriptWhenCorsIsNotSupportedAllowsCallbackNameChange = function(queue) {
        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
            var device = new BrowserDevice({"networking": { "supportsCORS": false }});
            var testUrl = "http://test";
            var callbackKey = "jsonpCallback";
            var loadScriptStub = this.sandbox.stub(BrowserDevice.prototype, 'loadScript', function(){});
            device.executeCrossDomainGet(testUrl, {}, {callbackKey: callbackKey});
            assertEquals(testUrl + "?jsonpCallback=%callback%", loadScriptStub.getCall(0).args[0]);
        });
    };
    
    this.DefaultNetworkTest.prototype.testExecuteCrossDomainDelegationToLoadScriptWhenCorsIsNotSupportedRespectsExistingQueryParameters = function(queue) {
        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
            var device = new BrowserDevice({"networking": { "supportsCORS": false }});
            var testUrl = "http://test?existingQueryString=blah";
            var loadScriptStub = this.sandbox.stub(BrowserDevice.prototype, 'loadScript', function(){});
            device.executeCrossDomainGet(testUrl, {});
            assertEquals("http://test?callback=%callback%&existingQueryString=blah", loadScriptStub.getCall(0).args[0]);
        });
    };
	
	this.DefaultNetworkTest.prototype.testExecuteCrossDomainPostCallsLoadUrlWithJsonPayloadWhenCorsIsSupported = function(queue) {
		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice({"networking": { "supportsCORS": true }});
			var loadUrlStub = this.sandbox.stub(BrowserDevice.prototype, 'loadURL');

			var message = { test : "myValue" };
			var payload = "{\"test\":\"myValue\"}";
			var successSpy = this.sandbox.spy();
			var errorSpy = this.sandbox.spy();

			var expectedArgs = {
					onLoad : successSpy,
					onError : errorSpy,
					headers : {
						"Content-Type" : "application/json"
					},
					method : "POST",
					data : payload
			};

			var testUrl = "http://test";
			var opts = {
					onLoad : successSpy,
					onError : errorSpy
			}
			device.executeCrossDomainPost(testUrl, message, opts);

			assert(loadUrlStub.calledWith(testUrl, expectedArgs));
		});
	};
	
	this.DefaultNetworkTest.prototype.testExecuteCrossDomainPostCallsCrossDomainPostWhenCorsIsNotSupported = function(queue) {
		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice({"networking": { "supportsCORS": false }});
			
			var testUrl = "http://test";
			var message = { test : "myValue" };
			var payload = "{\"test\":\"myValue\"}";
			var successSpy = this.sandbox.spy();
			var errorSpy = this.sandbox.spy();
			var opts = { onLoad : successSpy, onError : errorSpy, fieldName : "myField" };

			var crossDomainPostStub = this.sandbox.stub(BrowserDevice.prototype, 'crossDomainPost');

			device.executeCrossDomainPost(testUrl, message, opts);
			assert(crossDomainPostStub.calledWith(testUrl, { "myField" : payload }, { onLoad : successSpy, onError : errorSpy} ) );
		});
	};
	
	
}());
