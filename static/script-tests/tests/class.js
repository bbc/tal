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
	this.ClassTest = AsyncTestCase("Class");

	this.ClassTest.prototype.setUp = function() {
	};

	this.ClassTest.prototype.tearDown = function() {
	};

	this.ClassTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/class"], function(Class) {

			assertEquals('Class should be a function', 'function', typeof Class);
			assertEquals('Class should have an extend static method', 'function', typeof Class.extend);

		});
	};

	this.ClassTest.prototype.testExtend = function(queue) {
		expectAsserts(4);

		queuedRequire(queue, ["antie/class"], function(Class) {

			var ExtendedClass = Class.extend({
				init: function(value) {
					this._variable = value;
				},
				returnMethodString: function() {
					return "method";
				},
				overridableFunction: function() {
					return "base";
				},
				pie: 3.1415
			});

			var obj = new ExtendedClass("value");
			assert('Object should be an instance of ExtendedClass', obj instanceof ExtendedClass);
			assert('Object should be an instance of Class', obj instanceof Class);

			assertEquals("Example method returns expected value", "method", obj.returnMethodString());
			assertEquals("Constructor sets expected value", "value", obj._variable);

			var ExtendedTwiceClass = ExtendedClass.extend({
				overridableFunction: function() {
					return "subclass";
				}
			});
		});
	};

	this.ClassTest.prototype.testDoubleExtend = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/class"], function(Class) {

			var ExtendedClass = Class.extend({
				init: function(value) {
					this._variable = value;
				},
				returnMethodString: function() {
					return "method";
				},
				overridableFunction: function() {
					return "base";
				},
				pie: 3.1415
			});
			var ExtendedTwiceClass = ExtendedClass.extend({
				overridableFunction: function() {
					return "subclass";
				}
			});

			var obj2 = new ExtendedTwiceClass();

			assertEquals("Instance of subclass calls non-overridden method in base class", "method", obj2.returnMethodString());
			assertEquals("Instance of subclass calls overridden method in subclass", "subclass", obj2.overridableFunction());

		});
	};

	this.ClassTest.prototype.testTripleExtend = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/class"], function(Class) {

			var ExtendedClass = Class.extend({
				init: function(value) {
					this._variable = value;
				},
				returnMethodString: function() {
					return "method";
				},
				overridableFunction: function() {
					return "base";
				},
				pie: 3.1415
			});
			var ExtendedTwiceClass = ExtendedClass.extend({
				overridableFunction: function() {
					return "subclass";
				}
			});
			var ExtendedThriceClass = ExtendedTwiceClass.extend({
				overridableFunction: function() {
					return this._super();
				}
			});

			var obj3 = new ExtendedThriceClass();

			assertEquals("_super() method executes overridden method in super class", "subclass", obj3.overridableFunction());
		});
	};

})();