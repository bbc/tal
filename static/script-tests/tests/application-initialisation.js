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
	this.ApplicationInitialisationTest = AsyncTestCase("Application_Initialisation");

	this.ApplicationInitialisationTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.ApplicationInitialisationTest.prototype.tearDown = function() {
		this.sandbox.restore();

		if(this.application) {
			this.application.destroy();
			this.application = null;
		}
	};

	this.ApplicationInitialisationTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/application","antie/class"], function(application, Application, Class) {
			application.destroy();

			assertEquals('Application should be a function', 'function', typeof Application);
			this.application = new Application();
			assert('Application should extend from Class', this.application instanceof Class);

		});
	};

	this.ApplicationInitialisationTest.prototype.testOnReadyHandlerCalledWhenCallingReady = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/application"], function(application, Application) {

            application.destroy();

            var clock = sinon.useFakeTimers();

            var onReady = this.sandbox.stub();

            var app = new Application(document.createElement('div'), null, null, onReady);

            assert(onReady.notCalled);

            app.ready();

            assert(onReady.notCalled);

            clock.tick(1);

            assert(onReady.calledOnce);
            assert(onReady.calledWith(app));

            clock.restore();
		});
	};

	this.ApplicationInitialisationTest.prototype.testGetCurrentApplication = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/application"], function(application, Application) {
			assertSame(Application.getCurrentApplication(), application);
		});
	};
	this.ApplicationInitialisationTest.prototype.testApplicationCanBeInitialisedOnlyOnce = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["lib/mockapplication"], function(application, MockApplication) {
			application.destroy();

			this.application = new MockApplication(document.createElement('div'));
			assertException(function() {
				new MockApplication(document.createElement('div'));
			});
		});
	};
	this.ApplicationInitialisationTest.prototype.testApplicationCanBeInitialisedAfterDestroy = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["lib/mockapplication"], function(application, MockApplication) {
			application.destroy();

			this.application = new MockApplication(document.createElement('div'));
			this.application.destroy();
			var self = this;
			assertNoException(function() {
				self.application = new MockApplication(document.createElement('div'));
			});
		});
	};

	this.ApplicationInitialisationTest.prototype.testRunIsCalled = function(queue) {
		expectAsserts(7);

		queuedApplicationInit(queue, "lib/mockapplication", ["lib/mockapplication", "antie/devices/device"], function(application, MockApplication, Device) {

            var device = application.getDevice();
            application.destroy();

            var deviceLoadStub = this.sandbox.stub(Device, "load");

            var runStub = this.sandbox.stub(MockApplication.prototype, "run");

            var app = new MockApplication(document.createElement('div'), null, null, null);


            assert(deviceLoadStub.calledOnce);
            var deviceLoadCallbacks = deviceLoadStub.args[0][1];
            assertObject(deviceLoadCallbacks);
            assertFunction(deviceLoadCallbacks.onSuccess);

            var requireStub = this.sandbox.stub(window, "require");

            deviceLoadCallbacks.onSuccess(device);

            assert(requireStub.calledOnce);
            var requireCallback = requireStub.args[0][1];
            assertFunction(requireCallback);

            assert(runStub.notCalled);

            var mockLayout = { };

            requireCallback(mockLayout);

            assert(runStub.calledOnce);
		});
	};
	this.ApplicationInitialisationTest.prototype.testGetDevice = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			assertInstanceOf(BrowserDevice, application.getDevice());
		});
	};

})();
