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
    this.YouViewPgHandlerTest = AsyncTestCase('YouView PG Handler');

    this.YouViewPgHandlerTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();

        this.pinPromptResponseValues = {
            CORRECT: 'correct',
            INCORRECT: 'incorrect',
            CANCELLED_BY_USER: 'cancelled'
        };

        this.parentalGuidanceEnabled = true;
        this.parentalGuidanceResponse = this.pinPromptResponseValues.CORRECT;

        var self = this;

        window.youview = {
            parentalControls: {
                getParentalControlSettings: function() {
                    return mockSettingsPromise;
                },
                showPinPrompt: function() {
                    return mockChallengePromise;
                },
                PinPromptResponseValue: self.pinPromptResponseValues
            }
        };

        var mockSettingsPromise = {
            then: function(onFulfilled /* onRejected */) {
                onFulfilled({parentalControlsEnabled: self.parentalGuidanceEnabled});
            }
        };

        var mockChallengePromise = {
            then: function(onFulfilled /* onRejected */) {
                onFulfilled(self.parentalGuidanceResponse);
            }
        };

    };

    this.YouViewPgHandlerTest.prototype.tearDown = function () {
        this.sandbox.restore();

    };

    var config = {'modules':{'base':'antie\/devices\/browserdevice','modifiers':['antie/devices/parentalguidance/youviewpghandler']},'layouts':[{'width':999999,'height':999999,'module':'fixtures/layouts/toobig','classes':['toobig']},{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}]};

    this.YouViewPgHandlerTest.prototype.testYouViewPgHandlerExtendsBasePgHandler = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/parentalguidance/basepghandler'],
            function (application, BasePgHandler) {

                var device = application.getDevice();

                assertInstanceOf(BasePgHandler, device.parentalGuidanceHelper);
            }, config);
    };

    this.YouViewPgHandlerTest.prototype.testThatRegisterAppPgHandlerDoesNotAddAnAppHandlerToDevice = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();
                var appHandler = {foo: 'bar'};
                device.registerAppPgHandler(appHandler);

                assertUndefined(device.parentalGuidanceHelper._appHandler);
            }, config);
    };

    this.YouViewPgHandlerTest.prototype.testThatIsConfigurableReturnsFalse = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();

                assertFalse(device.parentalGuidanceHelper.isConfigurable());
            }, config);
    };

    this.YouViewPgHandlerTest.prototype.testThatSupportsMessageReturnsFalse = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();

                assertFalse(device.parentalGuidanceHelper.supportsMessage());
            }, config);
    };

    this.YouViewPgHandlerTest.prototype.testThatIsChallengeActiveReturnsTrueWhenYouViewParentalControlsAreEnabled = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();

                assertTrue(device.parentalGuidanceHelper.isChallengeActive());
            }, config);
    };

    this.YouViewPgHandlerTest.prototype.testThatIsChallengeActiveReturnsFalseWhenYouViewParentalControlsAreDisabled = function (queue) {
        expectAsserts(1);

        this.parentalGuidanceEnabled = false;

        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function (application) {

                var device = application.getDevice();

                assertFalse(device.parentalGuidanceHelper.isChallengeActive());
            }, config);
    };

    this.YouViewPgHandlerTest.prototype.testThatShowChallengeCallsBackWithAuthorisedIfYouViewCallsBackWithCorrect = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/parentalguidance/pgchallengeresponse'],
            function (application, PgChallengeResponse) {

                var device = application.getDevice();
                var onGuidanceChallengeResponseCallBackStub = this.sandbox.stub();
                var guidanceChallengeResponseCallBack = {
                    onGuidanceChallengeResponse: onGuidanceChallengeResponseCallBackStub
                };

                device.parentalGuidanceHelper.showChallenge('Test message', guidanceChallengeResponseCallBack);

                assertTrue(onGuidanceChallengeResponseCallBackStub.calledWith(PgChallengeResponse.AUTHORISED));
            }, config);
    };

    this.YouViewPgHandlerTest.prototype.testThatShowChallengeCallsBackWithNotAuthorisedIfYouViewCallsBackWithIncorrect = function (queue) {
        expectAsserts(1);

        this.parentalGuidanceResponse = this.pinPromptResponseValues.INCORRECT;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/parentalguidance/pgchallengeresponse'],
            function (application, PgChallengeResponse) {

                var device = application.getDevice();
                var onGuidanceChallengeResponseCallBackStub = this.sandbox.stub();
                var guidanceChallengeResponseCallBack = {
                    onGuidanceChallengeResponse: onGuidanceChallengeResponseCallBackStub
                };

                device.parentalGuidanceHelper.showChallenge('Test message', guidanceChallengeResponseCallBack);

                assertTrue(onGuidanceChallengeResponseCallBackStub.calledWith(PgChallengeResponse.NOT_AUTHORISED));
            }, config);
    };

    this.YouViewPgHandlerTest.prototype.testThatShowChallengeCallsBackWithErrorIfYouViewCallsBackWithUnrecognisedResponseCode = function (queue) {
        expectAsserts(1);

        this.parentalGuidanceResponse = 'other';

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/parentalguidance/pgchallengeresponse'],
            function (application, PgChallengeResponse) {

                var device = application.getDevice();
                var onGuidanceChallengeResponseCallBackStub = this.sandbox.stub();
                var guidanceChallengeResponseCallBack = {
                    onGuidanceChallengeResponse: onGuidanceChallengeResponseCallBackStub
                };

                device.parentalGuidanceHelper.showChallenge('Test message', guidanceChallengeResponseCallBack);

                assertTrue(onGuidanceChallengeResponseCallBackStub.calledWith(PgChallengeResponse.ERROR));
            }, config);
    };

    this.YouViewPgHandlerTest.prototype.testThatShowChallengeCallsBackWithNotAuthorisedIfYouViewCallsBackWithCancelledByUser = function (queue) {
        expectAsserts(1);

        this.parentalGuidanceResponse = this.pinPromptResponseValues.CANCELLED_BY_USER;

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/parentalguidance/pgchallengeresponse'],
            function (application, PgChallengeResponse) {

                var device = application.getDevice();
                var onGuidanceChallengeResponseCallBackStub = this.sandbox.stub();
                var guidanceChallengeResponseCallBack = {
                    onGuidanceChallengeResponse: onGuidanceChallengeResponseCallBackStub
                };

                device.parentalGuidanceHelper.showChallenge('Test message', guidanceChallengeResponseCallBack);

                assertTrue(onGuidanceChallengeResponseCallBackStub.calledWith(PgChallengeResponse.NOT_AUTHORISED));
            }, config);
    };

    this.YouViewPgHandlerTest.prototype.testThatShowChallengeCallsBackWithErrorIfYouViewCallsOnRejectedCallback = function (queue) {
        expectAsserts(1);

        var mockChallengePromise = {
            then: function(onFulfilled, onRejected) {
                onRejected();
            }
        };

        window.youview.parentalControls.showPinPrompt = function() {
            return mockChallengePromise;
        };

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/parentalguidance/pgchallengeresponse'],
            function (application, PgChallengeResponse) {

                var device = application.getDevice();
                var onGuidanceChallengeResponseCallBackStub = this.sandbox.stub();
                var guidanceChallengeResponseCallBack = {
                    onGuidanceChallengeResponse: onGuidanceChallengeResponseCallBackStub
                };

                device.parentalGuidanceHelper.showChallenge('Test message', guidanceChallengeResponseCallBack);

                assertTrue(onGuidanceChallengeResponseCallBackStub.calledWith(PgChallengeResponse.ERROR));
            }, config);
    };

})();
