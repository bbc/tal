/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {
    this.BasePgHandlerTest = AsyncTestCase('Base PG Handler');

    this.BasePgHandlerTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.BasePgHandlerTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.BasePgHandlerTest.prototype.testIsChallengeActiveThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/parentalguidance/basepghandler'],
            function(application, BasePgHandler) {
                var basePgHandler = new BasePgHandler();
                assertException(function () {
                    basePgHandler.isChallengeActive();
                }, 'Error');
            });
    };

    this.BasePgHandlerTest.prototype.testShowChallengeThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/parentalguidance/basepghandler'],
            function(application, BasePgHandler) {
                var basePgHandler = new BasePgHandler();
                assertException(function () {
                    basePgHandler.showChallenge();
                }, 'Error');
            });
    };

    this.BasePgHandlerTest.prototype.testSupportsMessageThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/parentalguidance/basepghandler'],
            function(application, BasePgHandler) {
                var basePgHandler = new BasePgHandler();
                assertException(function () {
                    basePgHandler.supportsMessage();
                }, 'Error');
            });
    };

    this.BasePgHandlerTest.prototype.testIsConfigurableThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/parentalguidance/basepghandler'],
            function(application, BasePgHandler) {
                var basePgHandler = new BasePgHandler();
                assertException(function () {
                    basePgHandler.isConfigurable();
                }, 'Error');
            });
    };

})();
