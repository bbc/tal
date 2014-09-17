/**
 * @preserve Copyright (c) 2014 British Broadcasting Corporation
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

(function () {
    this.AppDefaultPgHandlerTest = AsyncTestCase("App Default PG Handler");

    this.AppDefaultPgHandlerTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.AppDefaultPgHandlerTest.prototype.tearDown = function () {
        this.sandbox.restore();

    };

    this.AppDefaultPgHandlerTest.prototype.testAppDefaultPgHandlerExtendsBasePgHandler = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/basepghandler", "antie/devices/parentalguidance/appdefaultpghandler"],
            function (application, BasePgHandler, AppDefaultPgHandler) {

                var device = application.getDevice();

                assertInstanceOf(BasePgHandler, device.parentalGuidanceHelper);
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatRegisterAppPgHandlerAddsCorrectObjectToDevice = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/appdefaultpghandler"],
            function (application, AppDefaultPgHandler) {

                var device = application.getDevice();
                var appHandler = {foo: "bar"};
                device.registerAppPgHandler(appHandler);

                assertSame(appHandler, device.parentalGuidanceHelper._appHandler);
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatIsConfigurableReturnsTrue = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/appdefaultpghandler"],
            function (application, AppDefaultPgHandler) {

                var device = application.getDevice();

                assertTrue(device.parentalGuidanceHelper.isConfigurable());
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatSupportsMessageReturnsTrue = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/appdefaultpghandler"],
            function (application, AppDefaultPgHandler) {

                var device = application.getDevice();

                assertTrue(device.parentalGuidanceHelper.supportsMessage());
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatShowChallengeThrowsErrorWhenAppHandlerIsUndefined = function (queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/appdefaultpghandler"],
            function (application, AppDefaultPgHandler) {

                var device = application.getDevice();

                assertUndefined(device.parentalGuidanceHelper._appHandler);

                assertException(function () {
                    device.parentalGuidanceHelper.showChallenge();
                }, 'Error');
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatShowChallengeThrowsExceptionWhenCallBackObjectDoesNotContrainOnGuidanceChallengeResponse = function (queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/appdefaultpghandler"],
            function (application, AppDefaultPgHandler) {

                var device = application.getDevice();
                var showChallengeStub = this.sandbox.stub();
                var guidanceChallengeResponseCallBack = {};

                var appHandler = {
                    showChallenge: showChallengeStub
                }

                device.registerAppPgHandler(appHandler);

                assertNotUndefined(device.parentalGuidanceHelper._appHandler);
                assertException(function() {
                    device.parentalGuidanceHelper.showChallenge("Test message", guidanceChallengeResponseCallBack)
                }, 'Error');
            })
    };

    this.AppDefaultPgHandlerTest.prototype.testThatShowChallengeThrowsExceptionWhenOnGuidanceChallengeResponseIsNotAFunction = function (queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/appdefaultpghandler"],
            function (application, AppDefaultPgHandler) {

                var device = application.getDevice();
                var showChallengeStub = this.sandbox.stub();
                var guidanceChallengeResponseCallBack = {
                    onGuidanceChallengeResponse: "foo"
                };

                var appHandler = {
                    showChallenge: showChallengeStub
                }

                device.registerAppPgHandler(appHandler);

                assertNotUndefined(device.parentalGuidanceHelper._appHandler);
                assertException(function() {
                    device.parentalGuidanceHelper.showChallenge("Test message", guidanceChallengeResponseCallBack)
                }, 'Error');
            })
    };

    this.AppDefaultPgHandlerTest.prototype.testThatShowChallengeCallsAppHandlerWithCorrectArguments = function (queue) {
        expectAsserts(3);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/appdefaultpghandler"],
            function (application, AppDefaultPgHandler) {

                var device = application.getDevice();
                var showChallengeStub = this.sandbox.stub();
                var onGuidanceChallengeResponseCallBackStub = this.sandbox.stub();
                var guidanceChallengeResponseCallBack = {
                    onGuidanceChallengeResponse: onGuidanceChallengeResponseCallBackStub
                }

                var appHandler = {
                    showChallenge: showChallengeStub
                }

                device.registerAppPgHandler(appHandler);

                assertNotUndefined(device.parentalGuidanceHelper._appHandler);
                assertNoException(function() {
                    device.parentalGuidanceHelper.showChallenge("Test message", guidanceChallengeResponseCallBack)
                });
                assertTrue(showChallengeStub.calledWith("Test message", guidanceChallengeResponseCallBack));
            })
    };

    this.AppDefaultPgHandlerTest.prototype.testThatShowChallengeReturnsValue = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/appdefaultpghandler"],
            function (application, AppDefaultPgHandler) {

                var device = application.getDevice();
                var showChallengeStub = this.sandbox.stub().returns('foo');
                var onGuidanceChallengeResponseCallBackStub = this.sandbox.stub();
                var guidanceChallengeResponseCallBack = {
                    onGuidanceChallengeResponse: onGuidanceChallengeResponseCallBackStub
                }

                var appHandler = {
                    showChallenge: showChallengeStub
                }

                device.registerAppPgHandler(appHandler);
                var returnValue = device.parentalGuidanceHelper.showChallenge('testing', guidanceChallengeResponseCallBack);

                assertEquals('foo', returnValue);
            })
    };

    this.AppDefaultPgHandlerTest.prototype.testThatIsChallengeActiveThrowsErrorWhenAppHandlerIsUndefined = function (queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/appdefaultpghandler"],
            function (application, AppDefaultPgHandler) {

                var device = application.getDevice();

                assertUndefined(device.parentalGuidanceHelper._appHandler);

                assertException(function () {
                    device.parentalGuidanceHelper.isChallengeActive();
                }, 'Error');
            });
    };

    this.AppDefaultPgHandlerTest.prototype.testThatIsChallengeActiveeCallsAppHandlerIsChallengeActive = function (queue) {
        expectAsserts(3);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/appdefaultpghandler"],
            function (application, AppDefaultPgHandler) {

                var device = application.getDevice();
                var isChallengeActiveStub = this.sandbox.stub();

                var appHandler = {
                    isChallengeActive: isChallengeActiveStub
                }

                device.registerAppPgHandler(appHandler);

                assertNotUndefined(device.parentalGuidanceHelper._appHandler);
                assertNoException(function() {
                    device.parentalGuidanceHelper.isChallengeActive();
                });
                assertTrue(isChallengeActiveStub.calledOnce);
            })
    };

    this.AppDefaultPgHandlerTest.prototype.testThatIsChallengeActiveReturnsTrueOnlyWhenAppHandlerReturnsTrue = function (queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/appdefaultpghandler"],
            function (application, AppDefaultPgHandler) {

                var device = application.getDevice();
                var isChallengeActiveStub = this.sandbox.stub().returns(true);

                var appHandler = {
                    isChallengeActive: isChallengeActiveStub
                }

                device.registerAppPgHandler(appHandler);

                assertTrue(device.parentalGuidanceHelper.isChallengeActive());

                isChallengeActiveStub.returns(false);

                assertFalse(device.parentalGuidanceHelper.isChallengeActive());
            })
    };

})();
