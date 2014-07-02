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

    this.CEHTMLTest.prototype.testSetSourcesCausesCanPlayEventCallback = function (queue) {
        expectAsserts(3);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaevent"],
            function(application, CEHTMLPlayer, MediaEvent) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertTrue(callbackStub.calledOnce);
                assertInstanceOf(MediaEvent, callbackStub.args[0][0]);
                assertEquals("canplay", callbackStub.args[0][0].type);

            }, config);
    };

    this.CEHTMLTest.prototype.testSetSourcesAddsOnPlayStateChangeFunctionToMediaElement = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml"],
            function(application, CEHTMLPlayer) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaElement = document.createElement("object");

                this.sandbox.stub(device, "_createElement").returns(mediaElement);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                assertUndefined(mediaElement.onPlayStateChange);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(mediaElement.onPlayStateChange);


            }, config);
    };

    this.CEHTMLTest.prototype.testOnPlayStateChangeFunctionPassesErrorsToEventHandlingCallback = function (queue) {
        expectAsserts(5);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaerrorevent", "antie/devices/media/mediainterface"],
            function(application, CEHTMLPlayer, MediaErrorEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaElement = document.createElement("object");

                this.sandbox.stub(device, "_createElement").returns(mediaElement);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(mediaElement.onPlayStateChange);
                assertTrue(callbackStub.calledOnce); // "canplay" from setSources

                mediaElement.playState = 6;
                mediaElement.onPlayStateChange();

                assertTrue(callbackStub.calledTwice);
                assertInstanceOf(MediaErrorEvent, callbackStub.args[1][0]);
                assertEquals(0, callbackStub.args[1][0].code);

            }, config);
    };


    this.CEHTMLTest.prototype.testMediaElementHasCorrectStyleSet = function (queue) {
        expectAsserts(4);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml"],
            function(application, CEHTMLPlayer) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                var mediaElement = document.createElement("object");

                this.sandbox.stub(device, "_createElement").returns(mediaElement);

                device.createMediaInterface("id", "video", callbackStub);

                assertEquals("100%", mediaElement.style.width);
                assertEquals("100%", mediaElement.style.height);
                assertEquals("absolute", mediaElement.style.position);
                assertEquals("-1", mediaElement.style.zIndex);
            }, config);
    };
})();
