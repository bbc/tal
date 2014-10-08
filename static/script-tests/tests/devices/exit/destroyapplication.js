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
	this.DestroyApplicationTest = AsyncTestCase("ExitDestroyApplication");
	
	this.DestroyApplicationTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.DestroyApplicationTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};

	/**
	 * Test that the exit strategies tries to get the HBBTV's window.oipfObjectFactory property,
	 * requesting the correct MIME type for the HBBTV application manager.
	 */
	this.DestroyApplicationTest.prototype.testGetOipfObjectFactory = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/exit/destroyapplication"]},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		var self = this;

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var expectedMimeType = 'application/oipfApplicationManager';
			
			// Mimic the object provided by HBBTVs
			window.oipfObjectFactory = {
					isObjectSupported: function(mimeType) {
						//assertEquals('Requested MIME type is as expected', expectedMimeType, mimeType);
						return false;
					}
			};

            var oipfSpy = self.sandbox.spy( window.oipfObjectFactory, "isObjectSupported" );

            application.getDevice().exit();
            assertTrue( oipfSpy.calledOnce );
		}, config);
	};
	
	/**
	 * Test that if the ApplicationManager is not supported, the exit strategy doesn't attempt to
	 * create it.
	 */
	this.DestroyApplicationTest.prototype.testApplicationManagerNotSupported = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/exit/destroyapplication"]},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var expectedMimeType = 'application/oipfApplicationManager';
			
			// Mimic the object provided by HBBTVs
			window.oipfObjectFactory = {
					isObjectSupported: function(mimeType) {
						assertEquals('Requested MIME type is as expected', expectedMimeType, mimeType);
						return false;
					},
					createApplicationManagerObject: function() {}
			};
			
			var createSpy = this.sandbox.spy(window.oipfObjectFactory, 'createApplicationManagerObject');

            application.getDevice().exit();
            
            // Ensure the createApplicationManagerObject() method has not been called
			assertEquals('createApplicationManagerObject call count', 0, createSpy.callCount);
		}, config);
	};
	
	/**
	 * Test that if the ApplicationManager is supported, the exit strategy creates it and
	 * calls the full sequence of methods required.
	 */
	this.DestroyApplicationTest.prototype.testApplicationManagerSupported = function(queue) {
		expectAsserts(4);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/exit/destroyapplication"]},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var expectedMimeType = 'application/oipfApplicationManager';
			var self = this;
			var getOwnerAppSpy, destroyApplicationSpy;
			
			// Mimic the object provided by HBBTVs
			window.oipfObjectFactory = {
					isObjectSupported: function(mimeType) {
						assertEquals('Requested MIME type is as expected', expectedMimeType, mimeType);
						return true;
					},
					// createApplicationManagerObject() returns object containing getOwnerApplication() method
					createApplicationManagerObject: function() {
						var appManagerObject = {
							// getOwnerApplication() returns object with destroyApplication() method
							getOwnerApplication: function() {
								var ownerAppObject = {
									// No need for this stub to do anything
									destroyApplication: function() {}
								};
								
								// Set up a spy on destroyApplication() for later use
								destroyApplicationSpy = self.sandbox.spy(ownerAppObject, 'destroyApplication');
								return ownerAppObject;
							}
						};
						
						// Set up a spy on getOwnerApplication()
						getOwnerAppSpy = self.sandbox.spy(appManagerObject, 'getOwnerApplication');
						return appManagerObject;
					}
			};
			
			var factory = window.oipfObjectFactory;
			var createSpy = this.sandbox.spy(factory, 'createApplicationManagerObject');

            application.getDevice().exit();
            
            // Each method on the chain should have been called only once
			assertEquals('createApplicationManagerObject call count', 1, createSpy.callCount);
			assertEquals('getOwnerApplication call count', 1, getOwnerAppSpy.callCount);
			assertEquals('destroyApplication call count', 1, destroyApplicationSpy.callCount);
		}, config);
	};

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/exit/destroyapplication'], this.DestroyApplicationTest);

})();
