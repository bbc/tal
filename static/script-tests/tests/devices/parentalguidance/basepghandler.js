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
    this.BasePgHandlerTest = AsyncTestCase("Base PG Handler");

    this.BasePgHandlerTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.BasePgHandlerTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.BasePgHandlerTest.prototype.testIsChallengeActiveThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/basepghandler"],
            function(application, BasePgHandler) {
                var basePgHandler = new BasePgHandler;
                assertException(function () {
                    basePgHandler.isChallengeActive()
                }, 'Error');
            });
    };

    this.BasePgHandlerTest.prototype.testShowChallengeThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/basepghandler"],
            function(application, BasePgHandler) {
                var basePgHandler = new BasePgHandler;
                assertException(function () {
                    basePgHandler.showChallenge()
                }, 'Error');
            });
    };

    this.BasePgHandlerTest.prototype.testSupportsMessageThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/basepghandler"],
            function(application, BasePgHandler) {
                var basePgHandler = new BasePgHandler;
                assertException(function () {
                    basePgHandler.supportsMessage()
                }, 'Error');
            });
    };

    this.BasePgHandlerTest.prototype.testIsConfigurableThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/parentalguidance/basepghandler"],
            function(application, BasePgHandler) {
                var basePgHandler = new BasePgHandler;
                assertException(function () {
                    basePgHandler.isConfigurable()
                }, 'Error');
            });
    };

})();