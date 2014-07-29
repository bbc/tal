(function() {
	this.DefaultNetworkTest = AsyncTestCase("Network (Default)");

	this.DefaultNetworkTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.DefaultNetworkTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};

	this.DefaultNetworkTest.prototype.testLoadScript = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Waiting for script to load", function(callbacks) {

				// Using a statically named function as the callback because using JSTestDriver
				// can't dynamically generate javascript which calls a dynamically generated
				// callback function name.
				// TODO: revisit this when we've got a test server that can generate such files
				// dynamically.
				antie.framework.__test_dynamicScriptLoaded = callbacks.add(function() {
					delete antie.framework.__test_dynamicScriptLoaded;
					assert(true);
				});

				device.loadScript("/test/fixtures/dynamicscript.js?callback=%callback%", /%callback%/);
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
				device.loadAuthenticatedURL("/test/fixtures/test.json", opts);
			});
		});
	};

	this.DefaultNetworkTest.prototype.testLoadAuthenticatedURLError = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Waiting for data to load", function(callbacks) {
				var opts = {
					onLoad: callbacks.addErrback(function() {}),
					onError: callbacks.add(function() {assert(true);})
				};
				device.loadAuthenticatedURL("invalid:protocol", opts);
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
				device.loadURL("/test/fixtures/test.json", opts);
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
				device.loadURL("invalid:protocol", opts);
			});
		});
	};

	this.DefaultNetworkTest.prototype.testCrossDomainPost = function(queue) {
		expectAsserts(8);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Wait for cross domain post", function(callbacks) {
				var onLoad = callbacks.add(function() {
					assert(true);
				});
				var onError = callbacks.addErrback(function() {});
				device.crossDomainPost("http://www.test.bbc.co.uk/includes/blank/", {"goodbye":"salford", "hello":"world"}, {
					onLoad: onLoad,
					onError: onError,
					blankUrl: "/test/fixtures/blank.html"
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
})();
