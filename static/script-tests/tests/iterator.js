/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.IteratorTest = AsyncTestCase('Iterator');

    this.IteratorTest.prototype.setUp = function() {
    };

    this.IteratorTest.prototype.tearDown = function() {
    };

    this.IteratorTest.prototype.testClassDefinition = function(queue) {
        expectAsserts(2);

        queuedRequire(queue, ['antie/iterator','antie/class'], function(Iterator, Class) {

            assertEquals('Iterator should be a function', 'function', typeof Iterator);
            assert('Iterator should extend from Class', new Iterator() instanceof Class);

        });
    };
    this.IteratorTest.prototype.testConstructionWithArray = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ['antie/iterator'], function(Iterator) {

            var itemArray = ['A', 'B', 'C'];
            var iterator = new Iterator(itemArray);
            assertEquals('Iterator has expected length', itemArray.length, iterator.getLength());

        });
    };
    this.IteratorTest.prototype.testConstructionWithArrayNoArray = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ['antie/iterator'], function(Iterator) {

            var iterator = new Iterator();
            assertEquals('Iterator constructed without an array has zero length', 0, iterator.getLength());

        });
    };
    this.IteratorTest.prototype.testNextReturnsExpectedItems = function(queue) {
        expectAsserts(3);

        queuedRequire(queue, ['antie/iterator'], function(Iterator) {

            var itemArray = ['A', 'B', 'C'];
            var iterator = new Iterator(itemArray);
            assertEquals('First item is as expected', iterator.next(), itemArray[0]);
            assertEquals('Second item is as expected', iterator.next(),  itemArray[1]);
            assertEquals('Third item is as expected', iterator.next(),  itemArray[2]);

        });
    };
    this.IteratorTest.prototype.testIsEmptyReturnsFalseWhenIteratorHasFurtherItems = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ['antie/iterator'], function(Iterator) {

            var itemArray = ['A'];
            var iterator = new Iterator(itemArray);
            assertFalse('isEmpty returns false when iterator has items', iterator.isEmpty());

        });
    };
    this.IteratorTest.prototype.testIsEmptyReturnsTrueWhenIteratorIsEmpty = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ['antie/iterator'], function(Iterator) {

            var itemArray = ['A'];
            var iterator = new Iterator(itemArray);
            iterator.next();
            assertFalse('isEmpty returns true when iterator has no further items', iterator.isEmpty());

        });
    };
    this.IteratorTest.prototype.testNextReturnsUndefinedWhenEmpty = function(queue) {
        expectAsserts(2);

        queuedRequire(queue, ['antie/iterator'], function(Iterator) {

            var itemArray = ['A'];
            var iterator = new Iterator(itemArray);
            assertEquals('First item is as expected', itemArray[0], iterator.next());
            assertUndefined('Next returns undefined when iterator is empty', iterator.next());

        });
    };

    this.IteratorTest.prototype.testGetPointer = function(queue) {
        expectAsserts(2);

        queuedRequire(queue, ['antie/iterator'], function(Iterator) {

            var itemArray = ['A'];
            var iterator = new Iterator(itemArray);
            assertEquals('Pointer is initially at zero', 0, iterator.getPointer());
            iterator.next();
            assertEquals('Pointer is incremented as next is called', 1, iterator.getPointer());

        });
    };

    this.IteratorTest.prototype.testReset = function(queue) {
        expectAsserts(3);

        queuedRequire(queue, ['antie/iterator'], function(Iterator) {

            var itemArray = ['A'];
            var iterator = new Iterator(itemArray);
            assertEquals('Pointer is initially at zero', 0, iterator.getPointer());
            iterator.next();
            assertEquals('Pointer is incremented as next is called', 1, iterator.getPointer());
            iterator.reset();
            assertEquals('Pointer returns to zero after iterator is reset', 0, iterator.getPointer());

        });
    };

})();
