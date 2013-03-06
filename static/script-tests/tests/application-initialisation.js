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
	this.ApplicationInitialisationTest = AsyncTestCase("Application (Initialisation)");

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

	this.ApplicationInitialisationTest.prototype.testReadyCalled = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["lib/mockapplication"], function(application, MockApplication) {
			application.destroy();

			queue.call("Wait for run to be called", function(callbacks) {
				var onReady = callbacks.add(function() {
					assert(true);
				});
				this.application = new MockApplication(document.createElement('div'), null, null, onReady);
			});
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
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["lib/mockapplication"], function(application, MockApplication) {
			application.destroy();

			queue.call("Wait for run to be called", function(callbacks) {
				var runSpy;
				var onBeforeInit = callbacks.add(function() {
					runSpy = this.sandbox.spy(MockApplication.prototype, 'run');
				});
				var onReady = callbacks.add(function() {
					assert(runSpy.called);
				});
				this.application = new MockApplication(document.createElement('div'), null, null, onReady, null, onBeforeInit);
			});
		});
	};
	this.ApplicationInitialisationTest.prototype.testGetDevice = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/browserdevice"], function(application, BrowserDevice) {
			assertInstanceOf(BrowserDevice, application.getDevice());
		});
	};

})();
