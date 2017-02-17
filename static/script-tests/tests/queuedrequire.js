/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.QueuedRequireTest = AsyncTestCase('QueuedRequire Unit Testing Utilities');

    this.QueuedRequireTest.prototype.setUp = function() {
    };

    this.QueuedRequireTest.prototype.tearDown = function() {
    };

    this.QueuedRequireTest.prototype.testQueuedRequire = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ['fixtures/requiremodule'], function(module) {
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
