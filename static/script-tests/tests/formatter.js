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
	this.FormatterTest = AsyncTestCase("Formatter");

	this.FormatterTest.prototype.setUp = function() {
	};

	this.FormatterTest.prototype.tearDown = function() {
	};

	this.FormatterTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/formatter","antie/class"], function(Formatter, Class) {

			assertEquals('Formatter should be a function', 'function', typeof Formatter);
			assert('Formatter should extend from Class', new Formatter() instanceof Class);

		});
	};

	this.FormatterTest.prototype.testConstructorAcceptsEmptyArguments = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/formatter"], function(Formatter) {
			assertNoException(function() { new Formatter(); });
		});
	};

	this.FormatterTest.prototype.testNonOverriddenFormatThrowsException = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/formatter"], function(Formatter) {
			assertException(function() { new Formatter().format(); });
		});
	};

})();

/*
// Example using sinon.testCase
(function() {
	// Before loading tests
	// this - global object in global scope
	// true - map names to include the assert prefix
	sinon.assert.expose(this, true);

	AsyncTestCase("Formatter", sinon.testCase({

	  "test interface": function (queue, stub, mock) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/formatter","antie/class"], function(Formatter, Class) {

			assertEquals('Formatter should be a function', 'function', typeof Formatter);
			assert('Formatter should extend from Class', new Formatter() instanceof Class);

		});

	  }
	}));
})();
*/