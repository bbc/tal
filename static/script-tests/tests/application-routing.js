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
	this.ApplicationRoutingTest = AsyncTestCase("Application_Routing");

	this.ApplicationRoutingTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.ApplicationRoutingTest.prototype.tearDown = function() {
		this.sandbox.restore();

		if(this.application) {
			this.application.destroy();
			this.application = null;
		}
	};


	this.ApplicationRoutingTest.prototype.testGetSetCurrentRoute = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();

			application.setCurrentRoute(["a","b","c"]);
			assertEquals(["a","b","c"], application.getCurrentRoute());

		});

	};

	this.ApplicationRoutingTest.prototype.testSetCurrentRouteUsesDevice = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();

			var setCurrentRouteSpy = this.sandbox.spy(device, 'setCurrentRoute');
			application.setCurrentRoute(["a","b","c"]);
			assert(setCurrentRouteSpy.called);

		});

	};

	this.ApplicationRoutingTest.prototype.testGetCurrentRouteUsesDevice = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();

			var getCurrentRouteSpy = this.sandbox.spy(device, 'getCurrentRoute');
			application.getCurrentRoute()
			assert(getCurrentRouteSpy.called);

		});

	};

	this.ApplicationRoutingTest.prototype.testGetReferer = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			assertNotNull(application.getReferer());
		});

	};
	this.ApplicationRoutingTest.prototype.testRouteIsCalled = function(queue) {
		expectAsserts(7);

        queuedApplicationInit(queue, "lib/mockapplication", ["lib/mockapplication", "antie/devices/device"], function(application, MockApplication, Device) {

            var device = application.getDevice();
            application.destroy();

            var deviceLoadStub = this.sandbox.stub(Device, "load");

            var routeStub = this.sandbox.stub(MockApplication.prototype, "route");

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

            assert(routeStub.notCalled);

            var mockLayout = { };

            requireCallback(mockLayout);

            assert(routeStub.calledOnce);
        });

	};
})();
