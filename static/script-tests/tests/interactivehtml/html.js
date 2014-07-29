(function() {
	this.HTMLSpec = AsyncTestCase("HTML Spec");

	this.HTMLSpec.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.HTMLSpec.prototype.tearDown = function() {
		this.sandbox.restore();
	};

	this.HTMLSpec.prototype.testIFrame = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
			queue, 
			"lib/mockapplication", 
			["antie/devices/browserdevice"],
			function(application, BrowserDevice) {
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
					assertNotEquals(undefined, iframes[0].contentWindow);

				});
			}
		);
	};

	this.HTMLSpec.prototype.testCreateImageOnLoad = function(queue) {
		expectAsserts(1);

		queuedRequire(
			queue, 
			["antie/devices/browserdevice"], 
			function(BrowserDevice) {
				var device = new BrowserDevice(antie.framework.deviceConfiguration);
				queue.call("Waiting for image to load", function(callbacks) {
					var onLoad = callbacks.add(function() {
						assert(true);
					});
					var onError = callbacks.addErrback(function() {});
					device.createImage(null, null, "http://static.bbc.co.uk/frameworks/barlesque/1.10.0/desktop/2.7/img/blocks.png", null, onLoad, onError);
				});
			}
		);
	};

	this.HTMLSpec.prototype.testGetElementsByTagName = function(queue) {
		expectAsserts(2);

		queuedRequire(
			queue, 
			["antie/devices/browserdevice"], 
			function(BrowserDevice) {
				var device = new BrowserDevice(antie.framework.deviceConfiguration);
				var to = device.createContainer();
				var el1 = device.createContainer();
				var el2 = device.createContainer();
				var el3 = device.createContainer();
				var el4 = device.createContainer();
				var el5 = device.createContainer();

				device.appendChildElement(to, el1);
				device.appendChildElement(to, el2);
				device.appendChildElement(to, el3);
				device.appendChildElement(to, el4);
				device.appendChildElement(to, el5);
				device.appendChildElement(device.getTopLevelElement(), to);

				assertEquals(6, document.getElementsByTagName('div').length);
				assertEquals(5, device.getChildElementsByTagName(to, 'div').length)
			}
		);
	};

	this.HTMLSpec.prototype.testInsertChildElementBefore = function(queue) {
		expectAsserts(7);

		queuedRequire(
			queue, 
			["antie/devices/browserdevice"], 
			function(BrowserDevice) {
				var device = new BrowserDevice(antie.framework.deviceConfiguration);
				var to = device.createContainer();
				assertInstanceOf(Element, to);
				var el = device.createContainer();
				assertInstanceOf(Element, el);

				assertEquals(0, to.childNodes.length);
				device.appendChildElement(to, el);
				assertEquals(1, to.childNodes.length);
				assertSame(el, to.childNodes[0]);

				var el2 = device.createContainer();
				device.insertChildElementBefore(to, el2, el);
				assertEquals(2, to.childNodes.length);
				assertSame(el2, to.childNodes[0]);
			}
		);
	};

	this.HTMLSpec.prototype.testGetElementParent = function(queue) {
		expectAsserts(4);

		queuedRequire(
			queue, 
			["antie/devices/browserdevice"], 
			function(BrowserDevice) {
				var device = new BrowserDevice(antie.framework.deviceConfiguration);
				var to = device.createContainer();
				assertInstanceOf(Element, to);
				var el = device.createContainer();
				assertInstanceOf(Element, el);
				assertNull(device.getElementParent(el));
				device.appendChildElement(to, el);
				assertSame(to, device.getElementParent(el));
			}
		);
	};

	this.HTMLSpec.prototype.testGetElementByIdSetElementAttribute = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue, 
			"lib/mockapplication", 
			[], 
			function(application) {
				var div = document.createElement('div');
				div.id = "sizingdiv";
				div.className = "sizingdivclass";
				document.body.appendChild(div);
				assertEquals('sizingdivclass', document.getElementById('sizingdiv').className);

				document.body.removeChild(document.getElementById('sizingdiv'));
				assertEquals(undefined, document.getElementById('sizingdiv'));
			}
		);
	};

	this.HTMLSpec.prototype.testAddEventListener = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/button", "antie/events/focusevent"],
			function(application, Button, FocusEvent) {
				var root = application.getRootWidget();
				var button = new Button();
				root.appendChildWidget(button);
				var onFocus = this.sandbox.stub();
				application.addEventListener('focus', onFocus);
				application.bubbleEvent(new FocusEvent(button));
				assertEquals(1, onFocus.callCount);
			}
		);
	};

	this.HTMLSpec.prototype.testRemoveEventListener = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/button", "antie/events/focusevent"],
			function(application, Button, FocusEvent) {
				var root = application.getRootWidget();
				var button = new Button();
				root.appendChildWidget(button);
				var onFocus = this.sandbox.stub();
				application.addEventListener('focus', onFocus);
				application.removeEventListener('focus', onFocus);
				application.bubbleEvent(new FocusEvent(button));
				assertFalse(onFocus.called);
			}
		);
	};

	this.HTMLSpec.prototype.testSetTimeout = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			[],
			function(application) {
				queue.call('Setup and delete setTimeout', function(callbacks) {
					var startTime = new Date();
					var testTimeout = window.setTimeout(callbacks.add(function(){
						var nowTime = new Date();
						assertEquals(parseInt((nowTime - startTime)/1000), 3);
					}), 3000);
				});
			}
		);
	};

	// this.HTMLSpec.prototype.testSetClearInterval = function(queue) {
	// 	expectAsserts(3);

	// 	queuedApplicationInit(
	// 		queue,
	// 		"lib/mockapplication",
	// 		[],
	// 		function(application) {
	// 			queue.call('Run for 4 seconds', function(callbacks) {
	// 				var counter = 0;
	// 				var startTime = new Date();
	// 				var testInterval = window.setInterval(callbacks.add(function(){
	// 					var nowTime = new Date();
	// 					counter++;
	// 					assertEquals(parseInt((nowTime - startTime)/1000), counter);
	// 					if (counter == 3) {
	// 						window.clearInterval(testInterval);
	// 						assertEquals(testInterval, null)
	// 					}
	// 				}), 1000);
	// 				assertNotEquals(testInterval, null)
	// 				var testTimeout = window.setTimeout(callbacks.add(function(){
	// 					var nowTime = new Date();
	// 					assertEquals(parseInt((nowTime - startTime)/1000), 3);
	// 				}), 4000);
	// 			});
	// 		}
	// 	);
	// };

	this.HTMLSpec.prototype.testDocumentElement = function(queue) {
		expectAsserts(1);

		queuedRequire(
			queue, 
			[], 
			function() {
				var documenttest = document.documentElement;
				assertNotEquals(undefined, documenttest);
			}
		);
	};

	this.HTMLSpec.prototype.testWindowLocation = function(queue) {
		expectAsserts(1);

		queuedRequire(
			queue, 
			[], 
			function() {
				var location = window.location;
				assertNotEquals(undefined, location);
			}
		);
	};

	this.HTMLSpec.prototype.testWindowName = function(queue) {
		expectAsserts(1);

		queuedRequire(
			queue, 
			[], 
			function() {
				var windowname = window.name;
				assertNotEquals(undefined, windowname);
			}
		);
	};

	// causes browser panic in Safari
	// this.HTMLSpec.prototype.testWindowNavigator = function(queue) {
	// 	expectAsserts(1);

	// 	queuedRequire(
	// 		queue, 
	// 		[], 
	// 		function() {
	// 			var windownavigator = window.navigator;
	// 			assertNotEquals(undefined, windownavigator);
	// 		}
	// 	);
	// };

	this.HTMLSpec.prototype.testDocumentCookie = function(queue) {
		expectAsserts(1);

		queuedRequire(
			queue, 
			[], 
			function() {
				var cookie = document.cookie;
				assertNotEquals(undefined, cookie);
			}
		);
	};

	this.HTMLSpec.prototype.testSetStyle = function(queue) {
		expectAsserts(1);

		queuedRequire(
			queue, 
			[], 
			function() {
				var el1 = document.createElement('div');
				el1.id = "el1";
				el1.style.display = "block";
				document.body.appendChild(el1);
				var el2 = document.getElementById('el1');
				assertEquals('block', el2.style.display);
			}
		);
	};

	this.HTMLSpec.prototype.testCanvas = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
			queue, 
			"lib/mockapplication", 
			[], 
			function(application) {
				var canvas1 = document.createElement('canvas');
				canvas1.id = "canvastest";
				document.body.appendChild(canvas1);
				assertEquals(1, document.getElementsByTagName('canvas').length);
			}
		);
	};

	this.HTMLSpec.prototype.testDocumentBody = function(queue) {
		expectAsserts(1);

		queuedRequire(
			queue, 
			[],
			function() {
				var docbody = document.body;
				assertNotEquals(undefined, docbody);
			}
		);
	};

})();
