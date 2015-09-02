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
	this.URLBuilderTest = AsyncTestCase("URLBuilder");

	this.URLBuilderTest.prototype.setUp = function() {
	};

	this.URLBuilderTest.prototype.tearDown = function() {
	};

	this.URLBuilderTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/urlbuilder","antie/class"], function(URLBuilder, Class) {

			assertEquals('URLBuilder should be a function', 'function', typeof URLBuilder);
			assert('URLBuilder should extend from Class', new URLBuilder() instanceof Class);

		});
	};

	this.URLBuilderTest.prototype.testGetURLNoTags = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/urlbuilder"], function(URLBuilder) {
			var template = "http://example.com/";
			var href = "http://endpoint.invalid/";
			var tags = {};
			assertEquals("http://example.com/", new URLBuilder(template).getURL(href, tags));
		});
	};
	this.URLBuilderTest.prototype.testGetURLHREFOnly = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/urlbuilder"], function(URLBuilder) {
			var template = "%href%";
			var href = "http://endpoint.invalid/";
			var tags = {
			};
			assertEquals("http://endpoint.invalid/", new URLBuilder(template).getURL(href, tags));
		});
	};
	this.URLBuilderTest.prototype.testGetURLHREFAndTags = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/urlbuilder"], function(URLBuilder) {
			var template = "%a%%b%%c%";
			var href = "http://endpoint.invalid/";
			var tags = {
				"%a%":"AAA",
				"%c%":"-C-"
			};
			assertEquals("AAA%25b%25-C-", new URLBuilder(template).getURL(href, tags));
		});
	};
	this.URLBuilderTest.prototype.testGetURLApostrophesAreEncoded = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/urlbuilder"], function(URLBuilder) {
			var template = "%href%''%a%";
			var href = "'";
			var tags = {
				"%a%":"'"
			};
			assertEquals("%27%27%27%27", new URLBuilder(template).getURL(href, tags));
		});
	};
})();
