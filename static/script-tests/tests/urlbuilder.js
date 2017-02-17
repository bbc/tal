/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.URLBuilderTest = AsyncTestCase('URLBuilder');

    this.URLBuilderTest.prototype.setUp = function() {
    };

    this.URLBuilderTest.prototype.tearDown = function() {
    };

    this.URLBuilderTest.prototype.testInterface = function(queue) {
        expectAsserts(2);

        queuedRequire(queue, ['antie/urlbuilder','antie/class'], function(URLBuilder, Class) {

            assertEquals('URLBuilder should be a function', 'function', typeof URLBuilder);
            assert('URLBuilder should extend from Class', new URLBuilder() instanceof Class);

        });
    };

    this.URLBuilderTest.prototype.testGetURLNoTags = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ['antie/urlbuilder'], function(URLBuilder) {
            var template = 'http://example.com/';
            var href = 'http://endpoint.invalid/';
            var tags = {};
            assertEquals('http://example.com/', new URLBuilder(template).getURL(href, tags));
        });
    };
    this.URLBuilderTest.prototype.testGetURLHREFOnly = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ['antie/urlbuilder'], function(URLBuilder) {
            var template = '%href%';
            var href = 'http://endpoint.invalid/';
            var tags = {
            };
            assertEquals('http://endpoint.invalid/', new URLBuilder(template).getURL(href, tags));
        });
    };
    this.URLBuilderTest.prototype.testGetURLHREFAndTags = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ['antie/urlbuilder'], function(URLBuilder) {
            var template = '%a%%b%%c%';
            var href = 'http://endpoint.invalid/';
            var tags = {
                '%a%':'AAA',
                '%c%':'-C-'
            };
            assertEquals('AAA%25b%25-C-', new URLBuilder(template).getURL(href, tags));
        });
    };
    this.URLBuilderTest.prototype.testGetURLApostrophesAreEncoded = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ['antie/urlbuilder'], function(URLBuilder) {
            var template = '%href%\'\'%a%';
            var href = '\'';
            var tags = {
                '%a%':'\''
            };
            assertEquals('%27%27%27%27', new URLBuilder(template).getURL(href, tags));
        });
    };
})();
