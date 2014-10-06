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
	this.RuntimeContextTest = AsyncTestCase("RuntimeContext");

	this.RuntimeContextTest.prototype.testGetApplicationWhenNoApplicationIsSet = function(queue) {
		expectAsserts(1);
		DoTest(queue, function(RuntimeContext) {
			assertEquals(undefined, RuntimeContext.getCurrentApplication());
		});
	};

	this.RuntimeContextTest.prototype.testSetApplication = function(queue) {
		expectAsserts(1);
		DoTest(queue, function(RuntimeContext) {
			var mockApplication = {};
			RuntimeContext.setCurrentApplication(mockApplication);
			assertEquals(mockApplication, RuntimeContext.getCurrentApplication());
		});
	};

	this.RuntimeContextTest.prototype.testSetApplicationTwiceCausesError = function(queue) {
		expectAsserts(1);
		DoTest(queue, function(RuntimeContext) {
			RuntimeContext.setCurrentApplication({});
			assertException(function () {
				RuntimeContext.setCurrentApplication({});
			}, 'Error');
			
		});
	};

	this.RuntimeContextTest.prototype.testClearApplication = function(queue) {
		expectAsserts(1);
		DoTest(queue, function(RuntimeContext) {
			RuntimeContext.setCurrentApplication({});
			RuntimeContext.clearCurrentApplication();
			assertEquals(undefined, RuntimeContext.getCurrentApplication());
		});
	};

	this.RuntimeContextTest.prototype.testGetDevice = function(queue) {
		expectAsserts(1);
		DoTest(queue, function(RuntimeContext) {
			var mockDevice = {};
			var mockApplication = {
				getDevice: function () {
					return mockDevice;
				}
			};
			RuntimeContext.setCurrentApplication(mockApplication);
			assertEquals(mockDevice, RuntimeContext.getDevice());
		});
	};

	// Helper
	function DoTest (queue, test) {
		queuedRequire(queue, ["antie/runtimecontext"], function(RuntimeContext) { // Make sure the class under test is available
			var original = RuntimeContext.getCurrentApplication();
			RuntimeContext.clearCurrentApplication(); // Start from scratch each time
			test(RuntimeContext); // Run the actual test code
			// tear down
			RuntimeContext.clearCurrentApplication();
			RuntimeContext.setCurrentApplication(original);
		});
	}
})();
