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

jstestdriver.console.warn("devices/media/cehtml.js poorly tested!");


(function() {

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/cehtml"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    this.CEHTMLTest = AsyncTestCase("CEHTML Media Device Modifier");

    this.CEHTMLTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.CEHTMLTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.CEHTMLTest.prototype.testCreateMediaInterfaceReturnsCEHTMLPlayerWhenCEHTMLDeviceModifierUsed = function (queue) {
        expectAsserts(1);

        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml"],
            function(application, CEHTMLPlayer) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();
                var result = device.createMediaInterface("id", "video", callbackStub);

                assertInstanceOf(CEHTMLPlayer, result);
            }, config);
    };

    this.CEHTMLTest.prototype.testCreateMediaInterfacePassesArgumentsThroughToCEHTMLPlayerConstructorWhenCEHTMLDeviceModifierUsed = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml"],
            function(application, CEHTMLPlayer) {

                var spy = self.sandbox.spy(CEHTMLPlayer.prototype, "init");
                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();
                device.createMediaInterface("id", "video", callbackStub);

                assertTrue(spy.calledOnce);
                assertTrue(spy.calledWith("id", "video", callbackStub));
            }, config);
    };

})();
