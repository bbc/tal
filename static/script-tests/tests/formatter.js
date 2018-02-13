/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.FormatterTest = AsyncTestCase('Formatter');

    this.FormatterTest.prototype.setUp = function() {
    };

    this.FormatterTest.prototype.tearDown = function() {
    };

    this.FormatterTest.prototype.testInterface = function(queue) {
        expectAsserts(2);

        queuedRequire(queue, ['antie/formatter','antie/class'], function(Formatter, Class) {

            assertEquals('Formatter should be a function', 'function', typeof Formatter);
            assert('Formatter should extend from Class', new Formatter() instanceof Class);

        });
    };

    this.FormatterTest.prototype.testNonOverriddenFormatThrowsException = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ['antie/formatter'], function(Formatter) {
            assertException(function() {
                new Formatter().format();
            });
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

 AsyncTestCase('Formatter', sinon.testCase({

 'test interface': function (queue, stub, mock) {
 expectAsserts(2);

 queuedRequire(queue, ['antie/formatter','antie/class'], function(Formatter, Class) {

 assertEquals('Formatter should be a function', 'function', typeof Formatter);
 assert('Formatter should extend from Class', new Formatter() instanceof Class);

 });

 }
 }));
 })();
 */
