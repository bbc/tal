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

(function() {

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/cehtml"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    var stubCreateElement = function (self, device) {

        self.mediaElement = document.createElement("object");
        self.mediaElement.stop = self.sandbox.stub();

        self.mediaElement2 = document.createElement("object");
        self.mediaElement2.stop = self.sandbox.stub();

        self.outputElement = document.createElement("div")

        var useMediaElementOne = true;

        // Can't use calls(0) or onFirstCall - they're Sinon 1.8 and we're on 1.7
        self.sandbox.stub(device, "_createElement", function (type, id) {
            if (type === "div") {
                return self.outputElement;
            } else if (type === "object") {
                if (useMediaElementOne) {
                    useMediaElementOne = false;
                    return self.mediaElement;
                } else {
                    return self.mediaElement2;
                }
            }
        });

    }

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

                stubCreateElement(self,device);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                assertUndefined(self.mediaElement.onPlayStateChange);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(self.mediaElement.onPlayStateChange);


            }, config);
    };

    this.CEHTMLTest.prototype.testOnPlayStateChangeFunctionPassesErrorsToEventHandlingCallback = function (queue) {
        expectAsserts(5);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaerrorevent", "antie/devices/media/mediainterface"],
            function(application, CEHTMLPlayer, MediaErrorEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                stubCreateElement(self,device);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(self.mediaElement.onPlayStateChange);
                assertTrue(callbackStub.calledOnce); // "canplay" from setSources

                self.mediaElement.playState = 6;
                self.mediaElement.onPlayStateChange();

                assertTrue(callbackStub.calledTwice);
                assertInstanceOf(MediaErrorEvent, callbackStub.args[1][0]);
                assertEquals(0, callbackStub.args[1][0].code);

            }, config);
    };

    this.CEHTMLTest.prototype.testOnPlayStateChangeFunctionPassesEndedMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(5);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaevent", "antie/devices/media/mediainterface"],
            function(application, CEHTMLPlayer, MediaEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                stubCreateElement(self,device);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(self.mediaElement.onPlayStateChange);
                assertTrue(callbackStub.calledOnce); // "canplay" from setSources

                self.mediaElement.playState = 5;
                self.mediaElement.onPlayStateChange();

                assertTrue(callbackStub.calledTwice);
                assertInstanceOf(MediaEvent, callbackStub.args[1][0]);
                assertEquals('ended', callbackStub.args[1][0].type);

            }, config);
    };

    this.CEHTMLTest.prototype.testOnPlayStateChangeFunctionPassesWaitingMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(5);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaevent", "antie/devices/media/mediainterface"],
            function(application, CEHTMLPlayer, MediaEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                stubCreateElement(self,device);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(self.mediaElement.onPlayStateChange);
                assertTrue(callbackStub.calledOnce); // "canplay" from setSources

                self.mediaElement.playState = 4;
                self.mediaElement.onPlayStateChange();

                assertTrue(callbackStub.calledTwice);
                assertInstanceOf(MediaEvent, callbackStub.args[1][0]);
                assertEquals('waiting', callbackStub.args[1][0].type);

            }, config);
    };

    this.CEHTMLTest.prototype.testOnPlayStateChangeFunctionPassesLoadStartMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(5);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaevent", "antie/devices/media/mediainterface"],
            function(application, CEHTMLPlayer, MediaEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                stubCreateElement(self,device);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(self.mediaElement.onPlayStateChange);
                assertTrue(callbackStub.calledOnce); // "canplay" from setSources

                self.mediaElement.playState = 3;
                self.mediaElement.onPlayStateChange();

                assertTrue(callbackStub.calledTwice);
                assertInstanceOf(MediaEvent, callbackStub.args[1][0]);
                assertEquals('loadstart', callbackStub.args[1][0].type);

            }, config);
    };

    this.CEHTMLTest.prototype.testOnPlayStateChangeFunctionPassesPauseMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(5);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaevent", "antie/devices/media/mediainterface"],
            function(application, CEHTMLPlayer, MediaEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                stubCreateElement(self,device);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(self.mediaElement.onPlayStateChange);
                assertTrue(callbackStub.calledOnce); // "canplay" from setSources

                self.mediaElement.playState = 2;
                self.mediaElement.onPlayStateChange();

                assertTrue(callbackStub.calledTwice);
                assertInstanceOf(MediaEvent, callbackStub.args[1][0]);
                assertEquals('pause', callbackStub.args[1][0].type);

            }, config);
    };

    this.CEHTMLTest.prototype.testOnPlayStateChangeFunctionPassesPlayLifecycleMediaEventsToEventHandlingCallback = function (queue) {
        expectAsserts(11);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaevent", "antie/devices/media/mediainterface"],
            function(application, CEHTMLPlayer, MediaEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                stubCreateElement(self,device);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(self.mediaElement.onPlayStateChange);
                assertTrue(callbackStub.calledOnce); // "canplay" from setSources

                self.mediaElement.playState = 1;
                self.mediaElement.onPlayStateChange();

                assertEquals(5, callbackStub.callCount);
                assertInstanceOf(MediaEvent, callbackStub.args[1][0]);
                assertEquals('loadedmetadata', callbackStub.args[1][0].type);

                assertInstanceOf(MediaEvent, callbackStub.args[2][0]);
                assertEquals('canplaythrough', callbackStub.args[2][0].type);

                assertInstanceOf(MediaEvent, callbackStub.args[3][0]);
                assertEquals('play', callbackStub.args[3][0].type);

                assertInstanceOf(MediaEvent, callbackStub.args[4][0]);
                assertEquals('playing', callbackStub.args[4][0].type);

                // Clean up to stop launched timer...
                mediaInterface.stop();

            }, config);
    };

	this.CEHTMLTest.prototype.testDoesNotSendTimeupdateWhenVideoIsNotPlaying = function (queue) {
		expectAsserts(3);
		var self = this;
		queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaevent", "antie/devices/media/mediainterface"],
			function(application, CEHTMLPlayer) {

				var callbackStub = self.sandbox.stub();

				var device = application.getDevice();

				stubCreateElement(self,device);
				self.mediaElement.stop = self.sandbox.stub();

				var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

				mediaInterface.setSources(
					[
						{
							getURL : function() { return "url"; },
							getContentType : function() { return "video/mp4"; }
						}
					], { });

				var clock = sinon.useFakeTimers();

				self.mediaElement.playState = CEHTMLPlayer.PLAY_STATE_PLAYING;
				self.mediaElement.onPlayStateChange();
				clock.tick(901);
				assertEquals(6, callbackStub.callCount);

				self.mediaElement.playState = CEHTMLPlayer.PLAY_STATE_BUFFERING; // anything other than playing
				self.mediaElement.onPlayStateChange();
				assertEquals(7, callbackStub.callCount);
				clock.tick(900001);
				assertEquals(7, callbackStub.callCount);

				clock.restore();

				mediaInterface.stop();
			}, config);
	};


	this.CEHTMLTest.prototype.testOnPlayStateChangeFunctionPassesTimeUpdateMediaEventsToEventHandlingCallbackEvery900MillisecondsAfterPlayEvent = function (queue) {
        expectAsserts(6);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml", "antie/events/mediaevent", "antie/devices/media/mediainterface"],
            function(application, CEHTMLPlayer, MediaEvent, MediaInterface) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                stubCreateElement(self,device);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "video/mp4"; }
                        }
                    ], { });

                assertFunction(self.mediaElement.onPlayStateChange);

                var clock = sinon.useFakeTimers();
                // t = 0

                self.mediaElement.playState = 1;
                self.mediaElement.onPlayStateChange();

                assertEquals(5, callbackStub.callCount);

                clock.tick(899);
                // t = 899;

                assertEquals(5, callbackStub.callCount);

                clock.tick(2);
                // t = 901;

                assertEquals(6, callbackStub.callCount);

                assertInstanceOf(MediaEvent, callbackStub.args[5][0]);
                assertEquals('timeupdate', callbackStub.args[5][0].type);

                clock.restore();

                // Clean up to stop launched timer...
                mediaInterface.stop();


            }, config);
    };


    this.CEHTMLTest.prototype.testMediaElementHasCorrectStyleSet = function (queue) {
        expectAsserts(4);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml"],
            function(application, CEHTMLPlayer) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                stubCreateElement(self,device);

                device.createMediaInterface("id", "video", callbackStub);

                assertEquals("100%", self.mediaElement.style.width);
                assertEquals("100%", self.mediaElement.style.height);
                assertEquals("absolute", self.mediaElement.style.position);
                assertEquals("-1", self.mediaElement.style.zIndex);
            }, config);
    };

    this.CEHTMLTest.prototype.testSeekStateIsCalledWithEventHandlingCallbackWhenCreateMediaInterfaceIsCalled = function(queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/seekstate", "antie/devices/media/cehtml"],
            function(application, SeekState, CEHTML) {

                var eventHandlingCallbackStub = self.sandbox.stub();
                var seekStateSpy = self.sandbox.spy(SeekState.prototype, "init");

                application.getDevice().createMediaInterface("id", "video", eventHandlingCallbackStub);

                assertTrue(seekStateSpy.calledOnce);
                assertSame(eventHandlingCallbackStub, seekStateSpy.args[0][0]);

            }, config);
    };

    this.CEHTMLTest.prototype.testSeekStateIsCalledWithEventHandlingCallbackWhenSetSourcesIsCalled = function(queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/seekstate", "antie/devices/media/cehtml"],
            function(application, SeekState) {

                var eventHandlingCallbackStub = self.sandbox.stub();
                var seekStateSpy = self.sandbox.spy(SeekState.prototype, "init");

                var mediaInterface = application.getDevice().createMediaInterface("id", "video", eventHandlingCallbackStub);
                mediaInterface.setSources([
                    {
                        getURL : function() { return "url"; },
                        getContentType : function() { return "video/mp4"; }
                    }
                ], { });

                assertTrue(seekStateSpy.calledTwice);
                assertSame(eventHandlingCallbackStub, seekStateSpy.args[1][0]);

            }, config);
    };

    this.CEHTMLTest.prototype.testMediaElementIsWrappedInADivWhenRendered = function(queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtml"],
            function(application, CEHTML) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                stubCreateElement(self,device);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                var outputElement = mediaInterface.render();

                assertSame(self.outputElement, outputElement);
                assertSame(self.outputElement, self.mediaElement.parentNode);
            }, config);
    };

    this.CEHTMLTest.prototype.testOutputElementDoesNotChangeWhenMediaElementDoesWhenUsingMediaTypeFix = function(queue) {
        expectAsserts(4);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/cehtmlmediatypefix"],
            function(application, CEHTML) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();

                stubCreateElement(self,device);

                var mediaInterface = device.createMediaInterface("id", "video", callbackStub);

                var outputElement = mediaInterface.render();

                mediaInterface.setSources(
                    [
                        {
                            getURL : function() { return "url"; },
                            getContentType : function() { return "some/type"; }
                        }
                    ], { });

                var outputElement2 = mediaInterface.render();

                assertSame(outputElement, outputElement2);
                assertSame(self.outputElement, outputElement);
                assertSame(self.outputElement, self.mediaElement2.parentNode);
                assertEquals(1, self.outputElement.childNodes.length);

            }, config);
    };


})();
