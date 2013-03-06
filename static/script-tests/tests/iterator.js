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
	this.IteratorTest = AsyncTestCase("Iterator");

	this.IteratorTest.prototype.setUp = function() {
	};

	this.IteratorTest.prototype.tearDown = function() {
	};

	this.IteratorTest.prototype.testClassDefinition = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/iterator","antie/class"], function(Iterator, Class) {

			assertEquals('Iterator should be a function', 'function', typeof Iterator);
			assert('Iterator should extend from Class', new Iterator() instanceof Class);

		});
	};
	this.IteratorTest.prototype.testConstructionWithArray = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/iterator"], function(Iterator) {

			var itemArray = ["A", "B", "C"];
			var iterator = new Iterator(itemArray);
			assertEquals("Iterator has expected length", itemArray.length, iterator.getLength());

		});
	};
	this.IteratorTest.prototype.testConstructionWithArrayNoArray = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/iterator"], function(Iterator) {

			var iterator = new Iterator();
			assertEquals("Iterator constructed without an array has zero length", 0, iterator.getLength());

		});
	};
	this.IteratorTest.prototype.testNextReturnsExpectedItems = function(queue) {
		expectAsserts(3);

		queuedRequire(queue, ["antie/iterator"], function(Iterator) {

			var itemArray = ["A", "B", "C"];
			var iterator = new Iterator(itemArray);
			assertEquals("First item is as expected", iterator.next(), itemArray[0]);
			assertEquals("Second item is as expected", iterator.next(),  itemArray[1]);
			assertEquals("Third item is as expected", iterator.next(),  itemArray[2]);

		});
	};
	this.IteratorTest.prototype.testIsEmptyReturnsFalseWhenIteratorHasFurtherItems = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/iterator"], function(Iterator) {

			var itemArray = ["A"];
			var iterator = new Iterator(itemArray);
			assertFalse("isEmpty returns false when iterator has items", iterator.isEmpty());

		});
	};
	this.IteratorTest.prototype.testIsEmptyReturnsTrueWhenIteratorIsEmpty = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/iterator"], function(Iterator) {

			var itemArray = ["A"];
			var iterator = new Iterator(itemArray);
			iterator.next();
			assertFalse("isEmpty returns true when iterator has no further items", iterator.isEmpty());

		});
	};
	this.IteratorTest.prototype.testNextReturnsUndefinedWhenEmpty = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/iterator"], function(Iterator) {

			var itemArray = ["A"];
			var iterator = new Iterator(itemArray);
			assertEquals("First item is as expected", itemArray[0], iterator.next());
			assertUndefined("Next returns undefined when iterator is empty", iterator.next());

		});
	};

	this.IteratorTest.prototype.testGetPointer = function(queue) {
		expectAsserts(2);

		queuedRequire(queue, ["antie/iterator"], function(Iterator) {

			var itemArray = ["A"];
			var iterator = new Iterator(itemArray);
			assertEquals("Pointer is initially at zero", 0, iterator.getPointer());
			iterator.next();
			assertEquals("Pointer is incremented as next is called", 1, iterator.getPointer());

		});
	};

	this.IteratorTest.prototype.testReset = function(queue) {
		expectAsserts(3);

		queuedRequire(queue, ["antie/iterator"], function(Iterator) {

			var itemArray = ["A"];
			var iterator = new Iterator(itemArray);
			assertEquals("Pointer is initially at zero", 0, iterator.getPointer());
			iterator.next();
			assertEquals("Pointer is incremented as next is called", 1, iterator.getPointer());
			iterator.reset();
			assertEquals("Pointer returns to zero after iterator is reset", 0, iterator.getPointer());

		});
	};

})();
