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

jstestdriver.console.warn("devices/media/html5.js is poorly tested!");

(function() {

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    this.HTML5Test = AsyncTestCase("HTML5 Media Device Modifier");

    this.HTML5Test.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.HTML5Test.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.HTML5Test.prototype.testCreateMediaInterfaceReturnsHTML5PlayerWhenHTML5DeviceModifierUsed = function (queue) {
        expectAsserts(1);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/html5"],
            function(application, HTML5Player) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();
                var result = device.createMediaInterface("id", "video", callbackStub);

                assertInstanceOf(HTML5Player, result);
            }, config);
    };

    this.HTML5Test.prototype.testCreateMediaInterfacePassesArgumentsThroughToHTML5PlayerConstructorWhenHTML5DeviceModifierUsed = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/html5"],
            function(application, HTML5Player) {

                var spy = self.sandbox.spy(HTML5Player.prototype, "init");
                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();
                device.createMediaInterface("id", "video", callbackStub);

                assertTrue(spy.calledOnce);
                assertTrue(spy.calledWith("id", "video", callbackStub));
            }, config);
    };


    this.HTML5Test.prototype.testRenderCausesErrorEventToBeAdded = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/html5"],
            function(application, HTML5Player) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaElement = document.createElement("div");
                var addEventListenerCounts = { };
                mediaElement.addEventListener = function (type, callback) {
                    if (!addEventListenerCounts[type]) {
                        addEventListenerCounts[type] = 1;
                    } else {
                        addEventListenerCounts[type] += 1;
                    }
                };

                this.sandbox.stub(device, "_createElement").returns(mediaElement);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                assertUndefined(addEventListenerCounts.error);

                mediaInterface.render(device);

                assertEquals(1, addEventListenerCounts.error);
            }, config);
    };

    this.HTML5Test.prototype.testRenderCausesErrorEventListenerCallsbackWithAnErrorEventWithAvailableErrorCode = function (queue) {
        expectAsserts(4);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/html5", "antie/events/mediaerrorevent"],
            function(application, HTML5Player, MediaErrorEvent) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaElement = document.createElement("div");
                var eventListeners = { };
                mediaElement.addEventListener = function (type, callback) {
                    eventListeners[type] = callback;
                };

                this.sandbox.stub(device, "_createElement").returns(mediaElement);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.render(device);

                assertFunction(eventListeners.error);

                var errorCode = { };
                mediaElement.error = { code: errorCode };

                eventListeners.error("error");

                assertTrue(callbackStub.calledOnce);
                assertInstanceOf(MediaErrorEvent, callbackStub.args[0][0]);
                assertSame(errorCode, callbackStub.args[0][0].code);

            }, config);
    };

    this.HTML5Test.prototype.testRenderCausesErrorEventListenerCallsbackWithAnErrorEventWithoutErrorCodeIfUnavailable = function (queue) {
        expectAsserts(4);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/html5", "antie/events/mediaerrorevent", "antie/devices/media/mediainterface"],
            function(application, HTML5Player, MediaErrorEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaElement = document.createElement("div");
                var eventListeners = { };
                mediaElement.addEventListener = function (type, callback) {
                    eventListeners[type] = callback;
                };

                this.sandbox.stub(device, "_createElement").returns(mediaElement);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.render(device);

                assertFunction(eventListeners.error);

                eventListeners.error("error");

                assertTrue(callbackStub.calledOnce);
                assertInstanceOf(MediaErrorEvent, callbackStub.args[0][0]);
                assertSame(MediaInterface.MEDIA_ERR_UNKNOWN, callbackStub.args[0][0].code);

            }, config);
    };

})();
