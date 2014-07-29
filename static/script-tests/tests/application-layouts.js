(function() {
	this.ApplicationLayoutsTest = AsyncTestCase("Application (Layouts)");

	this.ApplicationLayoutsTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.ApplicationLayoutsTest.prototype.tearDown = function() {
		this.sandbox.restore();

		if(this.application) {
			this.application.destroy();
			this.application = null;
		}
	};

	this.ApplicationLayoutsTest.prototype.testGetBestFitLayout = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var layout = application.getBestFitLayout();
			assertSame(antie.framework.deviceConfiguration.layouts[1], layout);
		});
	};
	this.ApplicationLayoutsTest.prototype.testGetBestFitLayoutOnLargerScreen = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ['antie/devices/browserdevice'], function(BrowserDevice) {
			this.sandbox.stub(BrowserDevice.prototype, 'getScreenSize', function() {
				return {
					width: 1000000,
					height: 1000000
				};
			});

			queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
				var layout = application.getBestFitLayout();
				assertSame(antie.framework.deviceConfiguration.layouts[0], layout);
			});
		});
	};
	this.ApplicationLayoutsTest.prototype.testSetLayoutIsCalled = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["lib/mockapplication"], function(MockApplication) {
			queue.call("Wait for setLayout to be called", function(callbacks) {
				var setLayoutSpy;
				var onBeforeInit = callbacks.add(function() {
					setLayoutSpy = this.sandbox.spy(MockApplication.prototype, 'setLayout');
				});
				var onReady = callbacks.add(function() {
					var layout = require(antie.framework.deviceConfiguration.layouts[1].module);
					assert(setLayoutSpy.calledWith(layout));
				});
				this.application = new MockApplication(document.createElement('div'), null, null, onReady, null, onBeforeInit);
			});
		});
	};
	this.ApplicationLayoutsTest.prototype.testGetLayout = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var expectedLayout = require(antie.framework.deviceConfiguration.layouts[1].module);
			var layout = application.getLayout();
			assertSame(expectedLayout, layout);
		});
	};

	this.ApplicationLayoutsTest.prototype.testSetLayoutLoadCSS = function(queue) {
		/*expectAsserts(3);

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var layout = application.getLayout();
			var device = application.getDevice();

			var loadStyleSheetSpy = this.sandbox.spy(device, 'loadStyleSheet');

			application.setLayout(layout, "about:styleBaseUrl/", null, ["1.css","2.css"], [], []);
			assertEquals(2, loadStyleSheetSpy.callCount);
			assert(loadStyleSheetSpy.calledWithExactly("about:styleBaseUrl/1.css"));
			assert(loadStyleSheetSpy.calledWithExactly("about:styleBaseUrl/2.css"));
		});
		*/
		jstestdriver.console.warn("BrowserDevice::setLayout with stylesheets is currently untested.");
	};

	this.ApplicationLayoutsTest.prototype.testSetLayoutPreloadImages = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var layout = application.getLayout();
			var device = application.getDevice();

			var preloadImageSpy = this.sandbox.spy(device, 'preloadImage');

			application.setLayout(layout, null, "about:imageBaseUrl/", [], [], ["1.png","2.png"]);
			assertEquals(2, preloadImageSpy.callCount);
			assert(preloadImageSpy.calledWithExactly("about:imageBaseUrl/1.png"));
			assert(preloadImageSpy.calledWithExactly("about:imageBaseUrl/2.png"));
		});
	};

	this.ApplicationLayoutsTest.prototype.testSetLayoutSetClasses = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var layout = application.getLayout();
			var device = application.getDevice();
			var tle = device.getTopLevelElement();

			var addClassToElementSpy = this.sandbox.spy(device, 'addClassToElement');

			application.setLayout(layout, null, null, [], ["class1", "class2"], []);
			assertEquals(layout.classes.length + 2, addClassToElementSpy.callCount);
			assert(addClassToElementSpy.calledWithExactly(tle, layout.classes[0]));
			assert(addClassToElementSpy.calledWithExactly(tle, "class1"));
			assert(addClassToElementSpy.calledWithExactly(tle, "class2"));
		});
	};
})();
