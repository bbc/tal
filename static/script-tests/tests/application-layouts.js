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
	this.ApplicationLayoutsTest = AsyncTestCase("Application_Layouts");

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

		queuedApplicationInit(queue, "lib/mockapplication", ['antie/devices/browserdevice'], function(application, BrowserDevice) {
			this.sandbox.stub(BrowserDevice.prototype, 'getScreenSize', function() {
				return {
					width: 1000000,
					height: 1000000
				};
			});
			var layout = application.getBestFitLayout();
			assertSame(antie.framework.deviceConfiguration.layouts[0], layout);
		});
	};
	this.ApplicationLayoutsTest.prototype.testSetLayoutIsCalled = function(queue) {
		expectAsserts(7);

        queuedApplicationInit(queue, "lib/mockapplication", ["lib/mockapplication", "antie/devices/device"], function(application, MockApplication, Device) {

            var device = application.getDevice();
            application.destroy();

            var deviceLoadStub = this.sandbox.stub(Device, "load");

            var setLayoutStub = this.sandbox.stub(MockApplication.prototype, "setLayout");

            var app = new MockApplication(document.createElement('div'), null, null, null);


            assert(deviceLoadStub.calledOnce);
            var deviceLoadCallbacks = deviceLoadStub.args[0][1];
            assertObject(deviceLoadCallbacks);
            assertFunction(deviceLoadCallbacks.onSuccess);

            // When we call back indicating success of Device.load, we load the layouts by using require. We mock
            // out require and simulate the success of the load of the require call that loads the layout module.
            var requireStub = this.sandbox.stub(window, "require");

            deviceLoadCallbacks.onSuccess(device);

            assert(requireStub.calledOnce);
            var requireCallback = requireStub.args[0][1];
            assertFunction(requireCallback);

            assert(setLayoutStub.notCalled);

            var mockLayout = { };

            requireCallback(mockLayout);

            assert(setLayoutStub.calledOnce);
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
