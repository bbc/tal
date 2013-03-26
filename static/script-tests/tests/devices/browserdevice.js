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
	this.BrowserDeviceTest = AsyncTestCase("BrowserDevice");

	this.BrowserDeviceTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.BrowserDeviceTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};

	this.BrowserDeviceTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/devices/browserdevice","antie/devices/device"], function(BrowserDevice, Device) {

			assertEquals('BrowserDevice should be a function', 'function', typeof BrowserDevice);
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			assert('BrowserDevice should extend from Device', device instanceof Device);

		});
	};

	this.BrowserDeviceTest.prototype.testArrayIndexOf = function(queue) {
		expectAsserts(5);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var arr = [1,2,3];
			assertEquals(0, device.arrayIndexOf(arr, 1));
			assertEquals(2, device.arrayIndexOf(arr, 3));
			assertEquals(1, device.arrayIndexOf(arr, 2));
			assertEquals(-1, device.arrayIndexOf(arr, 4));
			assertEquals(-1, device.arrayIndexOf(arr, null));
		});
	};

	function defineElementCreationTests(funcName, expectedTag) {
		expectedTag = expectedTag.toLowerCase();

		this.BrowserDeviceTest.prototype["test" + funcName] = function(queue) {
			expectAsserts(3);

			queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
				var device = new BrowserDevice(antie.framework.deviceConfiguration);
				var el = device[funcName]();
				assertInstanceOf(Element, el);
				assertEquals(expectedTag, el.tagName.toLowerCase());
				assertEquals("", el.id);
			});
		};
		this.BrowserDeviceTest.prototype["test" + funcName + "ID"] = function(queue) {
			expectAsserts(1);

			queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
				var device = new BrowserDevice(antie.framework.deviceConfiguration);
				var el = device[funcName]("testID");
				assertEquals("testID", el.id);
			});
		};
		this.BrowserDeviceTest.prototype["test" + funcName + "Classes"] = function(queue) {
			expectAsserts(3);

			queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
				var device = new BrowserDevice(antie.framework.deviceConfiguration);
				var el = device[funcName](null,["class1","class2","class3"]);
				assertClassName("class1", el);
				assertClassName("class2", el);
				assertClassName("class3", el);

			});
		};
	};

	defineElementCreationTests("createContainer", "div");
	defineElementCreationTests("createLabel", "span");
	defineElementCreationTests("createButton", "div");
	defineElementCreationTests("createList", "ul");
	defineElementCreationTests("createListItem", "li");
	defineElementCreationTests("createImage", "img");

	this.BrowserDeviceTest.prototype.testCreateLabelText = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createLabel(null, null, "HELLO WORLD");
			assertEquals("HELLO WORLD", el.innerHTML);
		});
	};

	this.BrowserDeviceTest.prototype.testCreateImageSize = function(queue) {
		expectAsserts(6);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createImage(null, null, null, {width:100});
			assertEquals("100px", el.style.width);
			assertEquals("", el.style.height);

			el = device.createImage(null, null, null, {height:123});
			assertEquals("", el.style.width);
			assertEquals("123px", el.style.height);

			el = device.createImage(null, null, null, {width:456, height:123});
			assertEquals("456px", el.style.width);
			assertEquals("123px", el.style.height);
		});
	};

	this.BrowserDeviceTest.prototype.testCreateImageURL = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createImage(null, null, "about:blank");
			assertEquals("about:blank", el.src);
		});
	};

	this.BrowserDeviceTest.prototype.testCreateImageAltText = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createImage(null, null, "about:blank");
			assertEquals("", el.alt);
		});
	};

	this.BrowserDeviceTest.prototype.testCreateImageOnLoad = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Waiting for image to load", function(callbacks) {
				// Not possible to serve an image from fixtures - JsTestDriver gives wrong MIME type
				// Generate an image via canvas and load it
				var imgSrc = document.createElement('canvas').toDataURL();
				var onLoad = callbacks.add(function() {
					assert(true);
				});
				var onError = callbacks.addErrback(function() {});
				device.createImage(null, null, imgSrc, null, onLoad, onError);
			});
		});
	};

	this.BrowserDeviceTest.prototype.testCreateImageOnError = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Waiting for image to load", function(callbacks) {
				var onLoad = callbacks.addErrback(function() {});
				var onError = callbacks.add(function() {
					assert(true);
				});
				device.createImage(null, null, "invalid:protocol", null, onLoad, onError);
			});
		});
	};

    /**
     * TODO: This test is a bit fragile, because the jsTestDriver.conf always preloads 2 css files before running the
     * tests this means that there are always two stylesheets in the DOM, possibly more depending if prior
     * js-test-driver tests have loaded any stylesheets
     * @param queue
     */
    this.BrowserDeviceTest.prototype.testGetStylesheetElements = function(queue) {
    	/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/carousels.css">*/
    	/*:DOC += <link rel="stylesheet" type="text/css" href="/test/script-tests/lib/css3transitions.css">*/
        expectAsserts(1);

        queuedRequire(queue, ['antie/devices/browserdevice'], function(BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);
            assertEquals(2, device.getStylesheetElements().length);
        });
    };

	this.BrowserDeviceTest.prototype.testLoadStyleSheet = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Waiting for stylesheet to load", function(callbacks) {
				var div = document.createElement('div');
				div.id = "sizingdiv";
				document.body.appendChild(div);

				assertEquals(0, div.offsetHeight);
				var timeout = callbacks.add(function() {
					var d2 = document.getElementById('sizingdiv');
					assertNotEquals(0, d2.offsetHeight);
					document.body.removeChild(d2);
				});

				device.loadStyleSheet("/test/script-tests/fixtures/dynamicstylesheet.css", function(){
					timeout();
				});
			});
		});
	};
	this.BrowserDeviceTest.prototype.testLoadStyleSheetWithCallback = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			queue.call("Waiting for stylesheet to load", function(callbacks) {
				var callback = callbacks.add(function() {
					assert(true);
				});

				device.loadStyleSheet("/test/script-tests/fixtures/dynamicstylesheet.css", callback);
			});
		});
	};
	this.BrowserDeviceTest.prototype.testAppendChildElement = function(queue) {
		expectAsserts(7);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var to = device.createContainer();
			assertInstanceOf(Element, to);
			var el = device.createContainer();
			assertInstanceOf(Element, el);
			assertEquals(0, to.childNodes.length);
			device.appendChildElement(to, el);
			assertEquals(1, to.childNodes.length);
			assertSame(el, to.childNodes[to.childNodes.length - 1]);
			var el2 = device.createContainer();
			device.appendChildElement(to, el2);
			assertEquals(2, to.childNodes.length);
			assertSame(el2, to.childNodes[to.childNodes.length - 1]);
		});
	};

	this.BrowserDeviceTest.prototype.testAppendChildElementWhenElementAlreadyInDOM = function(queue) {
		expectAsserts(8);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var to = device.createContainer();
			assertInstanceOf(Element, to);
			var el = device.createContainer();
			assertInstanceOf(Element, el);
			assertEquals(0, to.childNodes.length);
			device.appendChildElement(to, el);
			assertEquals(1, to.childNodes.length);
			assertSame(el, to.childNodes[to.childNodes.length - 1]);
			var to2 = device.createContainer();
			device.appendChildElement(to2, el);
			assertEquals(0, to.childNodes.length);
			assertEquals(1, to2.childNodes.length);
			assertSame(el, to2.childNodes[to2.childNodes.length - 1]);
		});
	};

	this.BrowserDeviceTest.prototype.testPrependChildElement = function(queue) {
		expectAsserts(7);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var to = device.createContainer();
			assertInstanceOf(Element, to);
			var el = device.createContainer();
			assertInstanceOf(Element, el);
			assertEquals(0, to.childNodes.length);
			device.prependChildElement(to, el);
			assertEquals(1, to.childNodes.length);
			assertSame(el, to.childNodes[0]);
			var el2 = device.createContainer();
			device.prependChildElement(to, el2);
			assertEquals(2, to.childNodes.length);
			assertSame(el2, to.childNodes[0]);
		});
	};

	this.BrowserDeviceTest.prototype.testPrependChildElementWhenElementAlreadyInDOM = function(queue) {
		expectAsserts(8);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var to = device.createContainer();
			assertInstanceOf(Element, to);
			var el = device.createContainer();
			assertInstanceOf(Element, el);
			assertEquals(0, to.childNodes.length);
			device.prependChildElement(to, el);
			assertEquals(1, to.childNodes.length);
			assertSame(el, to.childNodes[0]);
			var to2 = device.createContainer();
			device.prependChildElement(to2, el);
			assertEquals(0, to.childNodes.length);
			assertEquals(1, to2.childNodes.length);
			assertSame(el, to2.childNodes[0]);
		});
	};

	this.BrowserDeviceTest.prototype.testInsertChildElementBefore = function(queue) {
		expectAsserts(7);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
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
		});
	};

	this.BrowserDeviceTest.prototype.testInsertChildElementAtBeginning = function(queue) {
		expectAsserts(7);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
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
			device.insertChildElementAt(to, el2, 0);
			assertEquals(2, to.childNodes.length);
			assertSame(el2, to.childNodes[0]);
		});
	};
	this.BrowserDeviceTest.prototype.testInsertChildElementAtEnd = function(queue) {
		expectAsserts(7);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
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
			device.insertChildElementAt(to, el2, 1);
			assertEquals(2, to.childNodes.length);
			assertSame(el2, to.childNodes[1]);
		});
	};
	this.BrowserDeviceTest.prototype.testGetElementParent = function(queue) {
		expectAsserts(4);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var to = device.createContainer();
			assertInstanceOf(Element, to);
			var el = device.createContainer();
			assertInstanceOf(Element, el);
			assertNull(device.getElementParent(el));
			device.appendChildElement(to, el);
			assertSame(to, device.getElementParent(el));
		});
	};
	this.BrowserDeviceTest.prototype.testRemoveElement = function(queue) {
		expectAsserts(4);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var to = device.createContainer();
			assertInstanceOf(Element, to);
			var el = device.createContainer();
			assertInstanceOf(Element, el);
			device.appendChildElement(to, el);
			assertNotNull(device.getElementParent(el));
			device.removeElement(el);
			assertNull(device.getElementParent(el));
		});
	};
	this.BrowserDeviceTest.prototype.testClearElement = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var to = device.createContainer();
			device.appendChildElement(to, device.createContainer());
			device.appendChildElement(to, device.createContainer());
			device.appendChildElement(to, device.createContainer());
			assertEquals(3, to.childNodes.length);

			device.clearElement(to);

			assertEquals(0, to.childNodes.length);
		});
	};
	this.BrowserDeviceTest.prototype.testSetElementClasses = function(queue) {
		expectAsserts(8);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer();
			assertEquals("", el.className);
			device.setElementClasses(el, ["class1", "class2", "class3"]);
			assertClassName("class1", el);
			assertClassName("class2", el);
			assertClassName("class3", el);
			device.setElementClasses(el, ["class4", "class2", "class5"]);
			assertNoMatch(/class1/, el.className);
			assertClassName("class4", el);
			assertClassName("class2", el);
			assertClassName("class5", el);

		});
	};
	this.BrowserDeviceTest.prototype.testSetRemoveClassFromElement = function(queue) {
		expectAsserts(6);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer();
			device.setElementClasses(el, ["class1", "class2", "class3"]);
			assertClassName("class1", el);
			assertClassName("class2", el);
			assertClassName("class3", el);
			device.removeClassFromElement(el, "class2");
			assertNoMatch(/class2/, el.className);
			assertClassName("class1", el);
			assertClassName("class3", el);
		});
	};
	this.BrowserDeviceTest.prototype.testSetRemoveClassFromElementDeepFalse = function(queue) {
		expectAsserts(13);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer();
			var innerEl = device.createContainer();
			device.appendChildElement(el, innerEl);
			assertSame(el, device.getElementParent(innerEl));

			device.setElementClasses(el, ["class1", "class2", "class3"]);
			assertClassName("class1", el);
			assertClassName("class2", el);
			assertClassName("class3", el);
			device.setElementClasses(innerEl, ["class1", "class2", "class3"]);
			assertClassName("class1", innerEl);
			assertClassName("class2", innerEl);
			assertClassName("class3", innerEl);

			device.removeClassFromElement(el, "class2", false);
			assertNoMatch(/class2/, el.className);
			assertClassName("class1", el);
			assertClassName("class3", el);
			assertClassName("class1", innerEl);
			assertClassName("class2", innerEl);
			assertClassName("class3", innerEl);
		});
	};
	this.BrowserDeviceTest.prototype.testSetRemoveClassFromElementDeepTrue = function(queue) {
		expectAsserts(13);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer();
			var innerEl = device.createContainer();
			device.appendChildElement(el, innerEl);
			assertSame(el, device.getElementParent(innerEl));

			device.setElementClasses(el, ["class1", "class2", "class3"]);
			assertClassName("class1", el);
			assertClassName("class2", el);
			assertClassName("class3", el);
			device.setElementClasses(innerEl, ["class1", "class2", "class3"]);
			assertClassName("class1", innerEl);
			assertClassName("class2", innerEl);
			assertClassName("class3", innerEl);

			device.removeClassFromElement(el, "class2", true);
			assertNoMatch(/class2/, el.className);
			assertNoMatch(/class2/, innerEl.className);
			assertClassName("class1", el);
			assertClassName("class3", el);
			assertClassName("class1", innerEl);
			assertClassName("class3", innerEl);
		});
	};
	this.BrowserDeviceTest.prototype.testAddClassToElement = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer();
			assertEquals("", el.className);
			device.addClassToElement(el, "class1");
			assertEquals("class1", el.className);
		});
	};
	this.BrowserDeviceTest.prototype.testAddClassToElement = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer();
			assertEquals("", el.className);
			device.addClassToElement(el, "class1");
			assertEquals("class1", el.className);
		});
	};
	this.BrowserDeviceTest.prototype.testAddKeyEventListener = function(queue) {
		expectAsserts(3);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			document.onkeydown = null;
			document.onkeypress = null;
			document.onkeyup = null;
			device.addKeyEventListener();
			assertFunction(document.onkeydown);
			assertFunction(document.onkeypress);
			assertFunction(document.onkeyup);
		});
	};
	this.BrowserDeviceTest.prototype.testGetElementSize = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer();
			device.appendChildElement(document.body, el);
			el.style.width = "100px";
			el.style.height = "200px";
			el.style.position = "absolute";
			var size = device.getElementSize(el);
			assertEquals(100, size.width);
			assertEquals(200, size.height);
		});
	};
	this.BrowserDeviceTest.prototype.testSetElementSize = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer();
			device.appendChildElement(document.body, el);
			el.style.position = "absolute";
			device.setElementSize(el, {width:300, height:400});
			assertEquals("300px", el.style.width);
			assertEquals("400px", el.style.height);
		});
	};
	this.BrowserDeviceTest.prototype.testSetElementPosition = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer();
			device.appendChildElement(document.body, el);
			el.style.position = "absolute";
			device.setElementPosition(el, {top:100, left:200});
			assertEquals("100px", el.style.top);
			assertEquals("200px", el.style.left);
		});
	};
	this.BrowserDeviceTest.prototype.testGetElementOffset = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer();
			device.appendChildElement(document.body, el);
			el.style.position = "absolute";
			el.style.top = "100px";
			el.style.left = "200px";
			var pos = device.getElementOffset(el);
			assertEquals(100, pos.top);
			assertEquals(200, pos.left);
		});
	};
	this.BrowserDeviceTest.prototype.testGetElementOffset = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer();
			device.appendChildElement(document.body, el);
			el.style.position = "absolute";
			device.setElementPosition(el, {top:100, left:200});
			var offset = device.getElementOffset(el);
			assertEquals(100, offset.top);
			assertEquals(200, offset.left);
		});
	};
	this.BrowserDeviceTest.prototype.testSetElementContent = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer();
			device.setElementContent(el, "HELLO WORLD!");
			assertEquals("HELLO WORLD!", el.innerHTML);
		});
	};
	this.BrowserDeviceTest.prototype.testCloneElement = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer("id");
			assertEquals("id", el.id);
			var clone = device.cloneElement(el);
			assertEquals("id", clone.id);
		});
	};
	this.BrowserDeviceTest.prototype.testCloneElement = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer("id");
			assertEquals("id", el.id);
			var clone = device.cloneElement(el);
			assertEquals("id", clone.id);
		});
	};
	this.BrowserDeviceTest.prototype.testCloneElementDeep = function(queue) {
		expectAsserts(5);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer("id");
			var innerEl = device.createContainer("innerID");
			device.appendChildElement(el, innerEl);
			var clone = device.cloneElement(el, false);
			assertEquals("id", clone.id);
			assertEquals(0, clone.childNodes.length);
			clone = device.cloneElement(el, true);
			assertEquals("id", clone.id);
			assertEquals(1, clone.childNodes.length);
			assertEquals("innerID", clone.childNodes[0].id);
		});
	};
	this.BrowserDeviceTest.prototype.testCloneElementAppendClass = function(queue) {
		expectAsserts(9);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer("id");
			var innerEl = device.createContainer("innerID");
			device.appendChildElement(el, innerEl);
			device.setElementClasses(el, ["class1", "class2"]);
			device.setElementClasses(innerEl, ["class4"]);

			var clone = device.cloneElement(el, true);
			assertClassName("class1", clone);
			assertClassName("class2", clone);
			assertNoMatch(/class3/, clone.className);
			assertClassName("class4", clone.childNodes[0]);
			assertNoMatch(/class3/, clone.childNodes[0].className);

			clone = device.cloneElement(el, true, "class3");
			assertClassName("class1", clone);
			assertClassName("class2", clone);
			assertClassName("class3", clone);
			assertNoMatch(/class3/, clone.childNodes[0].className);
		});
	};

	this.BrowserDeviceTest.prototype.testCloneElementAppendID = function(queue) {
		expectAsserts(4);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var el = device.createContainer("id");
			var innerEl = device.createContainer("innerID");
			device.appendChildElement(el, innerEl);

			var clone = device.cloneElement(el, true);
			assertEquals("id", clone.id);
			assertEquals("innerID", clone.childNodes[0].id);

			clone = device.cloneElement(el, true, null, "_testclone");
			assertEquals("id_testclone", clone.id);
			assertEquals("innerID", clone.childNodes[0].id);
		});
	};
	this.BrowserDeviceTest.prototype.testGetTextHeight = function(queue) {
		expectAsserts(3);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			assertEquals(0, device.getTextHeight("", 100, []));
			assertNotEquals(0, device.getTextHeight("HELLO", 100, []));

			var oneLine = device.getTextHeight("HELLO HELLO HELLO HELLO HELLO HELLO HELLO HELLO HELLO HELLO HELLO", 1000, []);
			var multipleLines = device.getTextHeight("HELLO HELLO HELLO HELLO HELLO HELLO HELLO HELLO HELLO HELLO HELLO", 50, []);
			assert(multipleLines > oneLine);
		});
	};
	this.BrowserDeviceTest.prototype.testGetChildElementsByTagName = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var outer = device.createContainer();
			device.appendChildElement(outer, device.createContainer());
			device.appendChildElement(outer, device.createContainer());
			device.appendChildElement(outer, device.createLabel());
			device.appendChildElement(outer, device.createContainer());

			assertEquals(3, device.getChildElementsByTagName(outer, "div").length);
			assertEquals(1, device.getChildElementsByTagName(outer, "span").length);
		});
	};
	this.BrowserDeviceTest.prototype.testGetTopLevelElement = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var tle = device.getTopLevelElement();
			assertEquals("html", tle.tagName.toLowerCase());
		});
	};

	this.BrowserDeviceTest.prototype.testGetScreenSize = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var size = device.getScreenSize();
			assertNotEquals(0, size.width);
			assertNotEquals(0, size.height);
		});
	};
	this.BrowserDeviceTest.prototype.testGetCurrentRoute = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			window.location.hash = "#test1/test2/test3";
			assertEquals(["test1","test2","test3"], device.getCurrentRoute());
		});

	};
	this.BrowserDeviceTest.prototype.testSetCurrentRoute = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			device.setCurrentRoute(["test4","test5","test6"]);
			assertEquals("#test4/test5/test6", window.location.hash);
		});

	};
	this.BrowserDeviceTest.prototype.testGetReferer = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var referrer = device.getReferrer();
			assertEquals(document.referrer, referrer);
		});

	};
	this.BrowserDeviceTest.prototype.testIsHDEnabled = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			assert(device.isHDEnabled());
		});

	};
	this.BrowserDeviceTest.prototype.testPreloadImage = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);
			var img = null;
			this.sandbox.stub(window, 'Image', function() {
				img = {};
				return img;
			});
			device.preloadImage("http://endpoint.invalid/image");
			assertNotNull(img);
			assertEquals("http://endpoint.invalid/image", img.src)
		});

	};
	this.BrowserDeviceTest.prototype.testScrollElementToCenter = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
			var device = new BrowserDevice(antie.framework.deviceConfiguration);

			this.div = device.createContainer("id_mask");
			document.body.appendChild(this.div);
			this.div.style.overflow = "hidden";
			this.div.style.width = "10px";
			this.div.style.height = "10px";
			this.div.style.position = "absolute";
			var inner = device.createContainer("id");
			inner.style.position = "absolute";
			inner.style.top = 0;
			inner.style.left = 0;
			inner.style.width = "1000px";
			inner.style.height = "1000px";
			device.appendChildElement(this.div, inner);

			var scrollElementToSpy = this.sandbox.spy(device, 'scrollElementTo');
			device.scrollElementToCenter(this.div, 100, 100);
			assert(scrollElementToSpy.calledWith(this.div, 95, 95));
			this.div.parentNode.removeChild(this.div);
			this.div = null;
		});

	};
	
	
	function stubDeviceAndGetEventSpiesForLeftKey(BrowserDevice, KeyEvent, device, sandbox) {
	    "use strict";
	    var talKey, stubs;
	    stubs = {};      
        // stub out event bubbling so we can detect but it does nothing
        device._application = {};
        stubs.eventStub = sandbox.stub();
        device._application.bubbleEvent = stubs.eventStub;
        // spy on KeyEvent init so we can test which events generated
        talKey = sandbox.spy(KeyEvent.prototype, 'init');
        stubs.talDown = talKey.withArgs('keydown', KeyEvent.VK_LEFT);
        stubs.talUp = talKey.withArgs('keyup', KeyEvent.VK_LEFT);
        stubs.talPress = talKey.withArgs('keypress', KeyEvent.VK_LEFT);
        // stub out event key map
        sandbox.stub(device, 'getKeyMap').returns( { "37": KeyEvent.VK_LEFT } );
        // register TAL events to DOM events
        device.addKeyEventListener();
        
        return stubs;
	}
	
	function assertCorrectTalKeyTapBehaviour(stubs) {
	    // Key tap = quick press and release of key.
	    assert("TAL keydown event fired once: ", stubs.talDown.calledOnce);
        assert("TAL keypress event fired once: ", stubs.talPress.calledOnce);
        assert("TAL keyup event fired once: ", stubs.talUp.calledOnce);
	    assert("Exactly three events should bubble: ", stubs.eventStub.calledThrice);
        sinon.assert.callOrder(stubs.talDown, stubs.talPress, stubs.talUp);
	}
	
	function getMockDomLeftKeyEvent() {
	    return {
            keyCode: 37, // left keycode
            preventDefault: function(){}
        };
	}
	
	this.BrowserDeviceTest.prototype.testFirefox3OSXStyleLeftKeyTapBehaviourNormalisedCorrectly = function(queue) {
        queuedRequire(queue, 
            [
                "antie/devices/browserdevice",
                "antie/events/keyevent"
            ], 
            function(BrowserDevice, KeyEvent) {
                var device, stubs, mockEvent;
                
                device = new BrowserDevice(antie.framework.deviceConfiguration);
                stubs = stubDeviceAndGetEventSpiesForLeftKey(BrowserDevice, KeyEvent, device, this.sandbox);
                mockEvent = getMockDomLeftKeyEvent();
                
                // fire mock firefox 3 style events
                document.onkeydown(mockEvent);
                document.onkeypress(mockEvent);
                document.onkeyup(mockEvent);
                
                // check correct TAL behaviour
                assertCorrectTalKeyTapBehaviour(stubs);
            }
        );
    };
    
    // see TVPJSFRMWK-774 BSCREEN-1065 TVPJSFRMWK-583
    /*
    this.BrowserDeviceTest.prototype.testChromeOSXStyleLeftKeyTapBehaviourNormalisedCorrectly = function(queue) {
        queuedRequire(queue, 
            [
                "antie/devices/browserdevice",
                "antie/events/keyevent"
            ], 
            function(BrowserDevice, KeyEvent) {
                var device, stubs, mockEvent;

                device = new BrowserDevice(antie.framework.deviceConfiguration);
                stubs = stubDeviceAndGetEventSpiesForLeftKey(BrowserDevice, KeyEvent, device, this.sandbox);
                mockEvent = getMockDomLeftKeyEvent();
                
                // fire mock chrome style events
                document.onkeydown(mockEvent);
                document.onkeyup(mockEvent);
                
                // check correct TAL behaviour
                assertCorrectTalKeyTapBehaviour(stubs);
            }
        );
    }; 
    */
    
    function queueKeyRepeatsThenAssertCorrectTALEvents(keyDownFn, keyHoldFn, stubs, queue) {
        var repeats, repeatDelay, mockElement;
         function repeatAndEnd() {
            var i;
            for(i = 0; i !== repeats; i += 1) {
                keyHoldFn();
            }
            document.onkeyup(mockElement);
        }
        
        function assertCorrectTALKeyHoldEvents() {
            assert("TAL keydown event fired once: ", stubs.talDown.calledOnce);
            assert("TAL keyup event fired once: ", stubs.talUp.calledOnce);
            assertEquals("TAL keypress event fired repeats (" + repeats + ") + 1 times: ", repeats + 1, stubs.talPress.callCount);
            sinon.assert.callOrder(stubs.talDown, stubs.talPress, stubs.talUp);
        }
        
        repeats = 3; // Fairly arbitrary
        repeatDelay = 200; // 200ms (unlikely to be less then this)
        mockElement = getMockDomLeftKeyEvent();
        
        keyDownFn(); // press the key down
        queue.call(repeatAndEnd, repeatDelay); // hold it down then let go.
        queue.call(assertCorrectTALKeyHoldEvents, repeatDelay + 100); // ensure TAL events have fired
    }
    
    this.BrowserDeviceTest.prototype.testFirefox3OSXStyleLeftKeyHoldBehaviourNormalisedCorrectly = function(queue) {
        queuedRequire(queue, 
            [
                "antie/devices/browserdevice",
                "antie/events/keyevent"
            ], 
            function(BrowserDevice, KeyEvent) {
                var mockEvent, stubs, device;
                function ff3KeyDown() {
                    document.onkeydown(mockEvent);
                    document.onkeypress(mockEvent);
                }
                function ff3KeyRepeat() {
                    document.onkeypress(mockEvent);
                }
                
                device = new BrowserDevice(antie.framework.deviceConfiguration);
                stubs = stubDeviceAndGetEventSpiesForLeftKey(BrowserDevice, KeyEvent, device, this.sandbox);
                mockEvent = getMockDomLeftKeyEvent();
                
                queueKeyRepeatsThenAssertCorrectTALEvents(ff3KeyDown, ff3KeyRepeat, stubs, queue);
            }
        );
    };
    
    // see TVPJSFRMWK-774 BSCREEN-1065 TVPJSFRMWK-583 BSCREEN-1609
    /*
    this.BrowserDeviceTest.prototype.testFirefox19OSXStyleLeftKeyHoldBehaviourNormalisedCorrectly = function(queue) {
        queuedRequire(queue, 
            [
                "antie/devices/browserdevice",
                "antie/events/keyevent"
            ], 
            function(BrowserDevice, KeyEvent) {
                var mockEvent, stubs, device;
                function ff19KeyDown() {
                    document.onkeydown(mockEvent);
                    document.onkeypress(mockEvent);
                }
                function ff19KeyRepeat() {
                    document.onkeydown(mockEvent);
                    document.onkeypress(mockEvent);
                }
                
                device = new BrowserDevice(antie.framework.deviceConfiguration);
                stubs = stubDeviceAndGetEventSpiesForLeftKey(BrowserDevice, KeyEvent, device, this.sandbox);
                mockEvent = getMockDomLeftKeyEvent();
                
                queueKeyRepeatsThenAssertCorrectTALEvents(ff19KeyDown, ff19KeyRepeat, stubs, queue);
            }
        );
    };
    */
    
    // see TVPJSFRMWK-774 BSCREEN-1065 TVPJSFRMWK-583 BSCREEN-1609
    /*
    this.BrowserDeviceTest.prototype.testChromeOSXStyleLeftKeyHoldBehaviourNormalisedCorrectly = function(queue) {
        queuedRequire(queue, 
            [
                "antie/devices/browserdevice",
                "antie/events/keyevent"
            ], 
            function(BrowserDevice, KeyEvent) {
                var mockEvent, stubs, device;
                function chromeKeyDown() {
                    document.onkeydown(mockEvent);
                }
                function chromeKeyRepeat() {
                    document.onkeydown(mockEvent);
                }
                
                device = new BrowserDevice(antie.framework.deviceConfiguration);
                stubs = stubDeviceAndGetEventSpiesForLeftKey(BrowserDevice, KeyEvent, device, this.sandbox);
                mockEvent = getMockDomLeftKeyEvent();
                
                queueKeyRepeatsThenAssertCorrectTALEvents(chromeKeyDown, chromeKeyRepeat, stubs, queue);
            }
        );
    };
    */
    
    // see TVPJSFRMWK-774 BSCREEN-1065 TVPJSFRMWK-583 BSCREEN-1609
    // This is a case special for some linux's using gecko taken from http://unixpapa.com/js/key.html
    /*
    this.BrowserDeviceTest.prototype.testOldGeckoLinuxStyleLeftKeyHoldBehaviourNormalisedCorrectly = function(queue) {
        queuedRequire(queue, 
            [
                "antie/devices/browserdevice",
                "antie/events/keyevent"
            ], 
            function(BrowserDevice, KeyEvent) {
                var mockEvent, stubs, device;
                function linuxGeckoKeyDown() {
                    document.onkeydown(mockEvent);
                }
                
                function linuxGeckoRepeat() {
                    document.onkeyup(mockEvent);
                    document.onkeydown(mockEvent);
                    document.onkeypress(mockEvent);
                }
                
                device = new BrowserDevice(antie.framework.deviceConfiguration);
                stubs = stubDeviceAndGetEventSpiesForLeftKey(BrowserDevice, KeyEvent, device, this.sandbox);
                mockEvent = getMockDomLeftKeyEvent();
                
                queueKeyRepeatsThenAssertCorrectTALEvents(linuxGeckoKeyDown, linuxGeckoRepeat, stubs, queue);
            }
        );
    };
    */
}());
