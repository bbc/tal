/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {
    this.AppDefaultPgHandlerTest = AsyncTestCase('App Default PG Handler');

    this.AppDefaultPgHandlerTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.AppDefaultPgHandlerTest.prototype.tearDown = function () {
        this.sandbox.restore();

    };

    this.AppDefaultPgHandlerTest.prototype.testAppDefaultPgHandlerExtendsBasePgHandler = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/parentalguidance/basepghandler'],
            function (application, BasePgHandler) {

                var device = application.getDevice();

                assertInstanceOf(BasePgHandler, device.parentalGuidanceHelper);
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatRegisterAppPgHandlerAddsCorrectObjectToDevice = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();
                var appHandler = {foo: 'bar'};
                device.registerAppPgHandler(appHandler);

                assertSame(appHandler, device.parentalGuidanceHelper._appHandler);
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatIsConfigurableReturnsTrue = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();

                assertTrue(device.parentalGuidanceHelper.isConfigurable());
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatSupportsMessageReturnsTrue = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();

                assertTrue(device.parentalGuidanceHelper.supportsMessage());
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatShowChallengeThrowsErrorWhenAppHandlerIsUndefined = function (queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();

                assertUndefined(device.parentalGuidanceHelper._appHandler);

                assertException(function () {
                    device.parentalGuidanceHelper.showChallenge();
                }, 'Error');
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatShowChallengeThrowsExceptionWhenCallBackObjectDoesNotContrainOnGuidanceChallengeResponse = function (queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();
                var showChallengeStub = this.sandbox.stub();
                var guidanceChallengeResponseCallBack = {};

                var appHandler = {
                    showChallenge: showChallengeStub
                };

                device.registerAppPgHandler(appHandler);

                assertNotUndefined(device.parentalGuidanceHelper._appHandler);
                assertException(function() {
                    device.parentalGuidanceHelper.showChallenge('Test message', guidanceChallengeResponseCallBack);
                }, 'Error');
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatShowChallengeThrowsExceptionWhenOnGuidanceChallengeResponseIsNotAFunction = function (queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();
                var showChallengeStub = this.sandbox.stub();
                var guidanceChallengeResponseCallBack = {
                    onGuidanceChallengeResponse: 'foo'
                };

                var appHandler = {
                    showChallenge: showChallengeStub
                };

                device.registerAppPgHandler(appHandler);

                assertNotUndefined(device.parentalGuidanceHelper._appHandler);
                assertException(function() {
                    device.parentalGuidanceHelper.showChallenge('Test message', guidanceChallengeResponseCallBack);
                }, 'Error');
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatShowChallengeCallsAppHandlerWithCorrectArguments = function (queue) {
        expectAsserts(3);

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();
                var showChallengeStub = this.sandbox.stub();
                var onGuidanceChallengeResponseCallBackStub = this.sandbox.stub();
                var guidanceChallengeResponseCallBack = {
                    onGuidanceChallengeResponse: onGuidanceChallengeResponseCallBackStub
                };

                var appHandler = {
                    showChallenge: showChallengeStub
                };

                device.registerAppPgHandler(appHandler);

                assertNotUndefined(device.parentalGuidanceHelper._appHandler);
                assertNoException(function() {
                    device.parentalGuidanceHelper.showChallenge('Test message', guidanceChallengeResponseCallBack);
                });
                assertTrue(showChallengeStub.calledWith('Test message', guidanceChallengeResponseCallBack));
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatShowChallengeReturnsValue = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();
                var showChallengeStub = this.sandbox.stub().returns('foo');
                var onGuidanceChallengeResponseCallBackStub = this.sandbox.stub();
                var guidanceChallengeResponseCallBack = {
                    onGuidanceChallengeResponse: onGuidanceChallengeResponseCallBackStub
                };

                var appHandler = {
                    showChallenge: showChallengeStub
                };

                device.registerAppPgHandler(appHandler);
                var returnValue = device.parentalGuidanceHelper.showChallenge('testing', guidanceChallengeResponseCallBack);

                assertEquals('foo', returnValue);
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatIsChallengeActiveThrowsErrorWhenAppHandlerIsUndefined = function (queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();

                assertUndefined(device.parentalGuidanceHelper._appHandler);

                assertException(function () {
                    device.parentalGuidanceHelper.isChallengeActive();
                }, 'Error');
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatIsChallengeActiveeCallsAppHandlerIsChallengeActive = function (queue) {
        expectAsserts(3);

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();
                var isChallengeActiveStub = this.sandbox.stub();

                var appHandler = {
                    isChallengeActive: isChallengeActiveStub
                };

                device.registerAppPgHandler(appHandler);

                assertNotUndefined(device.parentalGuidanceHelper._appHandler);
                assertNoException(function() {
                    device.parentalGuidanceHelper.isChallengeActive();
                });
                assertTrue(isChallengeActiveStub.calledOnce);
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatIsChallengeActiveReturnsTrueOnlyWhenAppHandlerReturnsTrue = function (queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();
                var isChallengeActiveStub = this.sandbox.stub().returns(true);

                var appHandler = {
                    isChallengeActive: isChallengeActiveStub
                };

                device.registerAppPgHandler(appHandler);

                assertTrue(device.parentalGuidanceHelper.isChallengeActive());

                isChallengeActiveStub.returns(false);

                assertFalse(device.parentalGuidanceHelper.isChallengeActive());
            });
    };

})();
