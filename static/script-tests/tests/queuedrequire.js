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
	this.QueuedRequireTest = AsyncTestCase("QueuedRequire Unit Testing Utilities");

	this.QueuedRequireTest.prototype.setUp = function() {
	};

	this.QueuedRequireTest.prototype.tearDown = function() {
	};

	this.QueuedRequireTest.prototype.testQueuedRequire = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["fixtures/requiremodule"], function(module) {
			assertEquals('queuedRequire loads module', 'Mock Require Module', module);
		});
	};

	this.QueuedRequireTest.prototype.testQueuedApplicationInit = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			assertEquals('queuedApplicationInit loads module', 'object', typeof application);
		});
	};

	this.QueuedRequireTest.prototype.testQueuedApplicationInitDependencies = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(queue, 'lib/mockapplication', ['antie/application'], function(application, Application) {
			assertNotUndefined('queuedApplicationInit loads dependencies', Application);
			assert('queuedApplicationInit application is an Application', application instanceof Application);
		});
	};

})();