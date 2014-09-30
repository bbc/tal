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
    /* jshint newcap: false, onevar: false */
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

	this.BrowserDeviceTest.prototype.testCreateImageSetsProvidedElementProperties = function(queue) {
		expectAsserts(10);

		queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {

            var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var createElementStub = this.sandbox.stub(document, "createElement");
            var mockImage =  { style: { } };
            createElementStub.returns(mockImage);

            var onLoad = this.sandbox.stub();
            var onError = this.sandbox.stub();

            var classes = [];

            device.createImage("id", classes, "http://mydomain.com/image.jpg", {width: 100, height: 200}, onLoad, onError);

            assert(createElementStub.calledOnce);
            assert(createElementStub.calledWith("img"));
            assertEquals("id", mockImage.id);
            assertUndefined(mockImage.className);
            assertEquals("http://mydomain.com/image.jpg", mockImage.src);
            assertEquals("100px", mockImage.style.width);
            assertEquals("200px", mockImage.style.height);
            assertEquals("", mockImage.alt);
            assertSame(onLoad, mockImage.onload);
            assertSame(onError, mockImage.onerror);
		});
	};


	var createGetStyleSheetsElementsTest = function (linkElements, styleElements) {
		return function(queue) {
		        expectAsserts(1);

			var self = this;
		
		        queuedRequire(queue, ['antie/devices/browserdevice'], function(BrowserDevice) {

				var stub = self.sandbox.stub(document, "getElementsByTagName");
				stub.withArgs("link").returns(linkElements);
				stub.withArgs("style").returns(styleElements);

				var device = new BrowserDevice(antie.framework.deviceConfiguration);
				assertEquals(linkElements.length + styleElements.length, device.getStylesheetElements().length);
		        });
		};
	};

    this.BrowserDeviceTest.prototype.testGetStylesheetElementsWhenThereAreNone = createGetStyleSheetsElementsTest([], []);
    this.BrowserDeviceTest.prototype.testGetStylesheetElementsWhenOnlyLinkElements = createGetStyleSheetsElementsTest([{}], []);
    this.BrowserDeviceTest.prototype.testGetStylesheetElementsWhenOnlyStyleElements = createGetStyleSheetsElementsTest([], [{}]);
    this.BrowserDeviceTest.prototype.testGetStylesheetElementsWhenBothLinkAndStyleElements = createGetStyleSheetsElementsTest([{}], [{}]);
    this.BrowserDeviceTest.prototype.testGetStylesheetElementsWhenMultipleLinkAndStyleElements = createGetStyleSheetsElementsTest([{}, {}], [{}, {}]);

	this.BrowserDeviceTest.prototype.testLoadStyleSheetImportsStyleSheetWhenCSSRulesSupported = function(queue) {
		expectAsserts(3);

        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {

            var createElement = document.createElement;
            var createElementStub = this.sandbox.stub(document, "createElement", function(tag) {
                if (tag === "style") {
                    return { sheet: { cssRules: true }, parentNode: { removeChild: function() {} } };
                }
                return createElement(tag);
            });

            var device = new BrowserDevice(antie.framework.deviceConfiguration);
            var callback = this.sandbox.stub();

            var appendToHead = this.sandbox.stub(document.getElementsByTagName("head")[0], "appendChild");
            this.sandbox.stub(window, "setInterval");

            device.loadStyleSheet("/test/script-tests/fixtures/dynamicstylesheet.css", callback);

            assert(createElementStub.calledTwice);
            assertEquals("@import url('/test/script-tests/fixtures/dynamicstylesheet.css');", createElementStub.returnValues[1].innerHTML);
            assert(appendToHead.calledWith(createElementStub.returnValues[1]));
       });
    };
    this.BrowserDeviceTest.prototype.testLoadStyleSheetLinksStyleSheetWhenCSSRulesNotSupported = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {

            var createElement = document.createElement;
            var link = { };
            var createElementStub = this.sandbox.stub(document, "createElement", function(tag) {
                if (tag === "style") {
                    return { parentNode: { removeChild: function() {} } };
                } else if (tag === "link") {
                    return link;
                } else if (tag === "img") {
                    return { parentNode: { removeChild: function() {} } };
                }
                return createElement(tag);
            });

            var topLevelElement = document.documentElement || document.body.parentNode || document;
            this.sandbox.stub(topLevelElement, "appendChild");

            var device = new BrowserDevice(antie.framework.deviceConfiguration);

            var appendToHead = this.sandbox.stub(document.getElementsByTagName("head")[0], "appendChild");

            device.loadStyleSheet("/test/script-tests/fixtures/dynamicstylesheet.css");

            assertEquals("/test/script-tests/fixtures/dynamicstylesheet.css", link.href);
            assert(appendToHead.calledWith(link));
        });
    };
	this.BrowserDeviceTest.prototype.testLoadStyleSheetCallbackFiredAfter200msOfCSSRuleLoadingWhenCSSRulesSupported = function(queue) {
		expectAsserts(5);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {

            var createElement = document.createElement;
            var createElementStub = this.sandbox.stub(document, "createElement", function(tag) {
                if (tag === "style") {
                    return { sheet: { cssRules: true }, parentNode: { removeChild: function() {} } };
                }
                return createElement(tag);
            });

            var clock = sinon.useFakeTimers();

            var device = new BrowserDevice(antie.framework.deviceConfiguration);
            var callback = this.sandbox.stub();

            this.sandbox.stub(document.getElementsByTagName("head")[0], "appendChild");

            device.loadStyleSheet("/test/script-tests/fixtures/dynamicstylesheet.css", callback);

            assert(createElementStub.calledTwice);
            assert(callback.notCalled);

            clock.tick(199);

            assert(callback.notCalled);

            clock.tick(2);

            assert(callback.calledOnce);
            assert(callback.calledWith("/test/script-tests/fixtures/dynamicstylesheet.css"));

            clock.restore();
		});
	};
    this.BrowserDeviceTest.prototype.testLoadStyleSheetCallbackFiredAfterImgErrorWhenCSSRulesNotSupported = function(queue) {
        expectAsserts(5);

        queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {

            var createElement = document.createElement;
            var img = { parentNode: { removeChild: this.sandbox.stub() } };
            var createElementStub = this.sandbox.stub(document, "createElement", function(tag) {
                if (tag === "style") {
                    return { parentNode: { removeChild: function() {} } };
                } else if (tag === "link") {
                    return { };
                } else if (tag === "img") {
                    return img;
                }
                return createElement(tag);
            });

            var topLevelElement = document.documentElement || document.body.parentNode || document;
            this.sandbox.stub(topLevelElement, "appendChild");


            var device = new BrowserDevice(antie.framework.deviceConfiguration);
            var callback = this.sandbox.stub();

            this.sandbox.stub(document.getElementsByTagName("head")[0], "appendChild");

            device.loadStyleSheet("/test/script-tests/fixtures/dynamicstylesheet.css", callback);

            assert(createElementStub.calledThrice);
            assert(callback.notCalled);

            assertFunction(img.onerror);

            img.onerror();

            assert(callback.calledOnce);
            assert(callback.calledWith("/test/script-tests/fixtures/dynamicstylesheet.css"));

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
	this.BrowserDeviceTest.prototype.testGetCurrentRouteIgnoresHistory = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);
            window.location.hash = "#test1/test2/test3&*history=http://www.sometest.com/test";
            assertEquals(["test1","test2","test3"], device.getCurrentRoute());
        });

    };
    
    this.BrowserDeviceTest.prototype.testSetCurrentRoutePreservesHistory = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);
            window.location.hash = "#test1/test2/test3&*history=http://www.sometest.com/test";
            device.setCurrentRoute(["test4", "test5", "test6"]);
            assertEquals("&*history=http://www.sometest.com/test", device.getHistorian().toString());
        });

    };
    
    this.BrowserDeviceTest.prototype.testSetCurrentRouteWithNoHistory = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);
            window.location.hash = "#test1/test2/test3";
            device.setCurrentRoute(["test4", "test5", "test6"]);
            assertEquals("#test4/test5/test6", window.location.hash);
        });

    };
    
    this.BrowserDeviceTest.prototype.testSetCurrentRouteWithNoRouteButHistory = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);
            window.location.hash = "#test1/test2/test3&*history=http://www.test.com";
            device.setCurrentRoute([]);
            assertEquals("#&*history=http://www.test.com", window.location.hash);
        });
    };
    
    this.BrowserDeviceTest.prototype.testSetCurrentRouteWithNoRouteOrHistory = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/devices/browserdevice"], function(BrowserDevice) {
            var device = new BrowserDevice(antie.framework.deviceConfiguration);
            window.location.hash = "#test1/test2/test3";
            device.setCurrentRoute([]);
            assertEquals("", window.location.hash);
        });
    };
    
    this.BrowserDeviceTest.prototype.testGetHistory = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, 
            [   
                "antie/devices/browserdevice",
                "antie/historian"
            ], 
            function(BrowserDevice, Historian) {
                var historySpy;
                historySpy = this.sandbox.spy(Historian.prototype, 'init');
                var device = new BrowserDevice(antie.framework.deviceConfiguration);
                device._windowLocation = {
                    href: "http://www.test0.com/blah/#test1/test2/test3&*history=http://www.test.com&*history=http://www.test2.com"
                };
                device.getHistorian();
                assert(historySpy.calledWith("http://www.test0.com/blah/#test1/test2/test3&*history=http://www.test.com&*history=http://www.test2.com"));
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

    function stubDeviceAndGetEventSpiesForNextKey(BrowserDevice, KeyEvent, device, sandbox) {
        "use strict";
        var talKey, stubs;
        stubs = {};
        // stub out event bubbling so we can detect but it does nothing
        device._application = {};
        stubs.eventStub = sandbox.stub();
        device._application.bubbleEvent = stubs.eventStub;
        // spy on KeyEvent init so we can test which events generated
        talKey = sandbox.spy(KeyEvent.prototype, 'init');
        stubs.talDown = talKey.withArgs('keydown', KeyEvent.VK_NEXT);
        stubs.talUp = talKey.withArgs('keyup', KeyEvent.VK_NEXT);
        stubs.talPress = talKey.withArgs('keypress', KeyEvent.VK_NEXT);
        // stub out event key map
        sandbox.stub(device, 'getKeyMap').returns( { "425": KeyEvent.VK_NEXT } );
        // register TAL events to DOM events
        device.addKeyEventListener();

        return stubs;
    }

    function stubDeviceAndGetEventSpiesForPrevKey(BrowserDevice, KeyEvent, device, sandbox) {
        "use strict";
        var talKey, stubs;
        stubs = {};
        // stub out event bubbling so we can detect but it does nothing
        device._application = {};
        stubs.eventStub = sandbox.stub();
        device._application.bubbleEvent = stubs.eventStub;
        // spy on KeyEvent init so we can test which events generated
        talKey = sandbox.spy(KeyEvent.prototype, 'init');
        stubs.talDown = talKey.withArgs('keydown', KeyEvent.VK_PREV);
        stubs.talUp = talKey.withArgs('keyup', KeyEvent.VK_PREV);
        stubs.talPress = talKey.withArgs('keypress', KeyEvent.VK_PREV);
        // stub out event key map
        sandbox.stub(device, 'getKeyMap').returns( { "424": KeyEvent.VK_PREV } );
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

    function getMockDomNextKeyEvent() {
        return {
            keyCode: 425, // Skip forward keycode
            preventDefault: function(){}
        };
    }

    function getMockDomPrevKeyEvent() {
        return {
            keyCode: 424, // Skip Backward keycode
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

    this.BrowserDeviceTest.prototype.testPrevKey = function(queue) {
        queuedRequire(queue,
            [
                "antie/devices/browserdevice",
                "antie/events/keyevent"
            ],
            function(BrowserDevice, KeyEvent) {
                var device, stubs, mockEvent;

                device = new BrowserDevice(antie.framework.deviceConfiguration);
                stubs = stubDeviceAndGetEventSpiesForPrevKey(BrowserDevice, KeyEvent, device, this.sandbox);
                mockEvent = getMockDomPrevKeyEvent();

                // fire mock firefox 3 style events
                document.onkeydown(mockEvent);
                document.onkeypress(mockEvent);
                document.onkeyup(mockEvent);

                // check correct TAL behaviour
                assertCorrectTalKeyTapBehaviour(stubs);
            }
        );
    };

    this.BrowserDeviceTest.prototype.testNextKey = function(queue) {
        queuedRequire(queue,
            [
                "antie/devices/browserdevice",
                "antie/events/keyevent"
            ],
            function(BrowserDevice, KeyEvent) {
                var device, stubs, mockEvent;

                device = new BrowserDevice(antie.framework.deviceConfiguration);
                stubs = stubDeviceAndGetEventSpiesForNextKey(BrowserDevice, KeyEvent, device, this.sandbox);
                mockEvent = getMockDomNextKeyEvent();

                // fire mock firefox 3 style events
                document.onkeydown(mockEvent);
                document.onkeypress(mockEvent);
                document.onkeyup(mockEvent);

                // check correct TAL behaviour
                assertCorrectTalKeyTapBehaviour(stubs);
            }
        );
    };
    
    this.BrowserDeviceTest.prototype.testFirefox3OSXStyleLeftKeyHoldBehaviourNormalisedCorrectly = function(queue) {
        expectAsserts(3);
        queuedRequire(queue, 
            [
                "antie/devices/browserdevice",
                "antie/events/keyevent"
            ], 
            function(BrowserDevice, KeyEvent) {
                var mockEvent, stubs, device;

                device = new BrowserDevice(antie.framework.deviceConfiguration);
                stubs = stubDeviceAndGetEventSpiesForLeftKey(BrowserDevice, KeyEvent, device, this.sandbox);
                mockEvent = getMockDomLeftKeyEvent();

                document.onkeydown(mockEvent);
                document.onkeypress(mockEvent);
                document.onkeypress(mockEvent);
                document.onkeypress(mockEvent);
                document.onkeypress(mockEvent);
                document.onkeyup(mockEvent);

                assert("TAL keydown event fired once: ", stubs.talDown.calledOnce);
                assert("TAL keyup event fired once: ", stubs.talUp.calledOnce);
                assertEquals("TAL keypress event fired repeats 4 times: ", 4, stubs.talPress.callCount);
                sinon.assert.callOrder(stubs.talDown, stubs.talPress, stubs.talUp);
            }
        );
    };

    /**
     * Test that device.getWindowLocation() returns values from underlying window.location.
     */
    this.BrowserDeviceTest.prototype.testGetWindowLocation = function(queue) {
        queuedRequire(queue, 
            [
                "antie/devices/browserdevice"
            ], 
            function(BrowserDevice) {
                var device = new BrowserDevice(antie.framework.deviceConfiguration);
                
                // Stub out window.location used by BrowserDevice
                var windowLocation = {
                    protocol: 'https:',
                    host: 'test.invalid:12345',
                    pathname: '/testurl/',
                    hash: '#route',
                    search: '?a=x%3Dy&b=&z',
                    href: 'https://test.invalid:12345/testurl/?a=x%3Dy&b=&z#route'
                };
                device._windowLocation = windowLocation; 

                var getWindowLocation = device.getWindowLocation();
                assertEquals('Correct protocol returned', windowLocation.protocol, getWindowLocation.protocol);
                assertEquals('Correct host returned', windowLocation.host, getWindowLocation.host);
                assertEquals('Correct pathname returned', windowLocation.pathname, getWindowLocation.pathname);
                assertEquals('Correct hash returned', windowLocation.hash, getWindowLocation.hash);
                assertEquals('Correct search returned', windowLocation.search, getWindowLocation.search);
                assertEquals('Correct href returned', windowLocation.href, getWindowLocation.href);
            }
        );
    };

    /**
     * Test that device.getWindowLocation() returns the full URL for location.href, even when the underlying DOM API doesn't give the right value. The scamp.
     */
    this.BrowserDeviceTest.prototype.testGetWindowLocationHrefCorrection = function(queue) {
        queuedRequire(queue,
            [
                "antie/devices/browserdevice"
            ],
            function(BrowserDevice) {
                var device = new BrowserDevice(antie.framework.deviceConfiguration);

                // The 'href' value here is dodgy - it doesn't include the hash on the end
                var windowLocation = {
                    protocol: 'https:',
                    host: 'test.invalid:12345',
                    pathname: '/testurl/',
                    hash: '#route',
                    search: '?a=x%3Dy&b=&z',
                    href: 'https://test.invalid:12345/testurl/?a=x%3Dy&b=&z'
                };
                device._windowLocation = windowLocation;

                var getWindowLocation = device.getWindowLocation();
                assertEquals('Correct href returned', 'https://test.invalid:12345/testurl/?a=x%3Dy&b=&z#route', getWindowLocation.href);
            }
        );
    };

    /**
     * Test that device.getWindowLocation() returns the full URL for location.href when there is no route to append
     */
    this.BrowserDeviceTest.prototype.testGetWindowLocationHrefCorrectionNotOverzealous = function(queue) {
        queuedRequire(queue,
            [
                "antie/devices/browserdevice"
            ],
            function(BrowserDevice) {
                var device = new BrowserDevice(antie.framework.deviceConfiguration);

                // Href doesn't have a hash because there is no hash
                var windowLocation = {
                    protocol: 'https:',
                    host: 'test.invalid:12345',
                    pathname: '/testurl/',
                    hash: '#',
                    search: '?a=x%3Dy&b=&z',
                    href: 'https://test.invalid:12345/testurl/?a=x%3Dy&b=&z'
                };
                device._windowLocation = windowLocation;

                var getWindowLocation = device.getWindowLocation();
                assertEquals('Correct href returned', 'https://test.invalid:12345/testurl/?a=x%3Dy&b=&z', getWindowLocation.href);
            }
        );
    };
    
    /**
     * Test that device.setWindowLocationUrl() calls functionality on underlying window.location.
     */
    this.BrowserDeviceTest.prototype.testSetWindowLocationUrl = function(queue) {
        queuedRequire(queue, 
            [
                "antie/devices/browserdevice"
            ],
            function(BrowserDevice) {
                var device = new BrowserDevice(antie.framework.deviceConfiguration);
                var targetUrl = 'http://example.com:55555/path/to/test.html?device=sample&config=precert&a=x%3Dy&b=&z';

                // Stub out window.location.assign
                var windowLocation = {
                    assign: this.sandbox.stub()
                };

                device._windowLocation = windowLocation;
                device.setWindowLocationUrl(targetUrl);

                assertEquals('window.location.assign call count', 1, windowLocation.assign.callCount);
                assertEquals('Correct URL passed through', targetUrl, windowLocation.assign.getCall(0).args[0]);
            }
        );
    };

    /**
     * Test that device.setWindowLocationUrl() uses the alternative navigation approach when window.location.assign() is unavailable.
     */
    this.BrowserDeviceTest.prototype.testSetWindowLocationUrlAlternative = function(queue) {
        queuedRequire(queue,
            [
                "antie/devices/browserdevice"
            ],
            function(BrowserDevice) {
                var device = new BrowserDevice(antie.framework.deviceConfiguration);
                var targetUrl = 'http://example.com:55555/path/to/test.html?device=sample&config=precert&a=x%3Dy&b=&z';

                // window.location.assign() does not exist
                var windowLocation = {};

                device._windowLocation = windowLocation;
                device.setWindowLocationUrl(targetUrl);

                assertEquals('location.href property set', targetUrl, windowLocation.href);
            }
        );
    };

}());
