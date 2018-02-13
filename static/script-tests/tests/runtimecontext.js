/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.RuntimeContextTest = AsyncTestCase('RuntimeContext');

    this.RuntimeContextTest.prototype.testGetApplicationWhenNoApplicationIsSet = function(queue) {
        expectAsserts(1);
        doTest(queue, function(RuntimeContext) {
            assertEquals(undefined, RuntimeContext.getCurrentApplication());
        });
    };

    this.RuntimeContextTest.prototype.testSetApplication = function(queue) {
        expectAsserts(1);
        doTest(queue, function(RuntimeContext) {
            var mockApplication = {};
            RuntimeContext.setCurrentApplication(mockApplication);
            assertEquals(mockApplication, RuntimeContext.getCurrentApplication());
        });
    };

    this.RuntimeContextTest.prototype.testSetApplicationTwiceCausesError = function(queue) {
        expectAsserts(1);
        doTest(queue, function(RuntimeContext) {
            RuntimeContext.setCurrentApplication({});
            assertException(function () {
                RuntimeContext.setCurrentApplication({});
            }, 'Error');

        });
    };

    this.RuntimeContextTest.prototype.testClearApplication = function(queue) {
        expectAsserts(1);
        doTest(queue, function(RuntimeContext) {
            RuntimeContext.setCurrentApplication({});
            RuntimeContext.clearCurrentApplication();
            assertEquals(undefined, RuntimeContext.getCurrentApplication());
        });
    };

    this.RuntimeContextTest.prototype.testGetDevice = function(queue) {
        expectAsserts(1);
        doTest(queue, function(RuntimeContext) {
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
    function doTest (queue, test) {
        queuedRequire(queue, ['antie/runtimecontext'], function(RuntimeContext) { // Make sure the class under test is available
            var original = RuntimeContext.getCurrentApplication();
            RuntimeContext.clearCurrentApplication(); // Start from scratch each time
            test(RuntimeContext); // Run the actual test code
            // tear down
            RuntimeContext.clearCurrentApplication();
            RuntimeContext.setCurrentApplication(original);
        });
    }
})();
