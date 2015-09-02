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

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/samsung_maple"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    this.SamsungMapleTest = AsyncTestCase("SamsungMapleTest");

    this.SamsungMapleTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();

        // If we don't have a TVMW plugin create it...
        this.createdTVMPlugin = false;
        this.tvmwPlugin = document.getElementById('pluginObjectTVMW');
        if (!this.tvmwPlugin) {
            this.tvmwPlugin = document.createElement('object');
            this.tvmwPlugin.id = 'pluginObjectTVMW';
            document.body.appendChild(this.tvmwPlugin);
            this.createdTVMPlugin = true;

            this.tvmwPlugin.GetSource = this.sandbox.stub();
            this.tvmwPlugin.SetSource = this.sandbox.stub();
            this.tvmwPlugin.SetMediaSource = this.sandbox.stub();

        } else {
            this.sandbox.stub(this.tvmwPlugin, "GetSource");
            this.sandbox.stub(this.tvmwPlugin, "SetSource");
        }

        // If we don't have a Player plugin create it...
        this.createdPlayerPlugin = false;
        this.playerPlugin = document.getElementById('playerPlugin');
        if (!this.playerPlugin) {
            this.playerPlugin = document.createElement('object');
            this.playerPlugin.id = 'playerPlugin';
            document.body.appendChild(this.playerPlugin);
            this.createdPlayerPlugin = true;

            this.playerPlugin.GetDuration = this.sandbox.stub();
            this.playerPlugin.Stop = this.sandbox.stub();
            this.playerPlugin.Pause = this.sandbox.stub();
            this.playerPlugin.Resume = this.sandbox.stub();
            this.playerPlugin.SetDisplayArea = this.sandbox.stub();
            this.playerPlugin.JumpForward = this.sandbox.stub();
        }
    };

    this.SamsungMapleTest.prototype.tearDown = function() {
        this.sandbox.restore();

        // Get rid of the TVMW plugin if we've created it.
        if (this.createdTVMPlugin) {
            document.body.removeChild(this.tvmwPlugin);
            this.tvmwPlugin = null;
        }

        // Get rid of the Player plugin if we've created it.
        if (this.createdPlayerPlugin) {
            document.body.removeChild(this.playerPlugin);
            this.playerPlugin = null;
        }

        // Get rid of event handling that Samsung litters the window with.
        window.SamsungMapleOnBufferingStart = undefined;
        window.SamsungMapleOnBufferingComplete = undefined;
        window.SamsungMapleOnConnectionFailed = undefined;
        window.SamsungMapleOnNetworkDisconnected = undefined;
        window.SamsungMapleOnRenderError = undefined;
        window.SamsungMapleOnStreamNotFound = undefined;
        window.SamsungMapleOnRenderingComplete = undefined;
        window.SamsungMapleOnStreamInfoReady = undefined;
        window.SamsungMapleOnCurrentPlayTime = undefined;
        window.SamsungMapleOnTimeUpdate = undefined;
    };

    this.SamsungMapleTest.prototype.testCreateMediaInterfaceReturnsSamsungMaplePlayerWhenSamsungMapleDeviceModifierUsed = function (queue) {
        expectAsserts(1);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple"],
            function(application, SamsungMaplePlayer) {

                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();
                var result = device.createMediaInterface("id", "video", callbackStub);

                assertInstanceOf(SamsungMaplePlayer, result);
            }, config);
    };

    this.SamsungMapleTest.prototype.testCreateMediaInterfacePassesArgumentsThroughToSamsungMaplePlayerConstructorWhenSamsungMapleDeviceModifierUsed = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple"],
            function(application, SamsungPlayer) {

                var spy = self.sandbox.spy(SamsungPlayer.prototype, "init");
                var callbackStub = self.sandbox.stub();

                var device = application.getDevice();
                device.createMediaInterface("id", "video", callbackStub);

                assertTrue(spy.calledOnce);
                assertTrue(spy.calledWith("id", "video", callbackStub));
            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnBufferingStartPassesWaitingMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple", "antie/events/mediaevent"],
            function(application, SamsungPlayer,  MediaEvent) {

                var callbackStub = self.sandbox.stub();
                application.getDevice().createMediaInterface("id", "video", callbackStub);

                window.SamsungMapleOnBufferingStart();

                assertInstanceOf(MediaEvent, callbackStub.args[0][0]);
                assertEquals('waiting', callbackStub.args[0][0].type);

            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnBufferingCompletePassesPlayingMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple", "antie/events/mediaevent"],
            function(application, SamsungPlayer,  MediaEvent) {

                var callbackStub = self.sandbox.stub();
                application.getDevice().createMediaInterface("id", "video", callbackStub);

                window.SamsungMapleOnBufferingComplete();

                assertInstanceOf(MediaEvent, callbackStub.args[0][0]);
                assertEquals('playing', callbackStub.args[0][0].type);

            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnConnectionFailedPassesConnectionFailedMediaErrorEventToEventHandlingCallback = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple", "antie/events/mediaerrorevent"],
            function(application, SamsungPlayer,  MediaErrorEvent) {

                var callbackStub = self.sandbox.stub();
                application.getDevice().createMediaInterface("id", "video", callbackStub);

                window.SamsungMapleOnConnectionFailed();

                assertInstanceOf(MediaErrorEvent, callbackStub.args[0][0]);
                assertEquals('Connection failed', callbackStub.args[0][0].code);

            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnNetworkDisconnectedPassesNetworkDisconnectedMediaErrorEventToEventHandlingCallback = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple", "antie/events/mediaerrorevent"],
            function(application, SamsungPlayer,  MediaErrorEvent) {

                var callbackStub = self.sandbox.stub();
                application.getDevice().createMediaInterface("id", "video", callbackStub);

                window.SamsungMapleOnNetworkDisconnected();

                assertInstanceOf(MediaErrorEvent, callbackStub.args[0][0]);
                assertEquals('Network disconnected', callbackStub.args[0][0].code);

            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnRenderErrorPassesRenderErrorMediaErrorEventToEventHandlingCallback = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple", "antie/events/mediaerrorevent"],
            function(application, SamsungPlayer, MediaErrorEvent) {

                var callbackStub = self.sandbox.stub();
                application.getDevice().createMediaInterface("id", "video", callbackStub);

                window.SamsungMapleOnRenderError();

                assertInstanceOf(MediaErrorEvent, callbackStub.args[0][0]);
                assertEquals('Render error', callbackStub.args[0][0].code);

            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnStreamNotFoundPassesStreamNotFoundMediaErrorEventToEventHandlingCallback = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple", "antie/events/mediaerrorevent"],
            function(application, SamsungPlayer, MediaErrorEvent) {

                var callbackStub = self.sandbox.stub();
                application.getDevice().createMediaInterface("id", "video", callbackStub);

                window.SamsungMapleOnStreamNotFound();

                assertInstanceOf(MediaErrorEvent, callbackStub.args[0][0]);
                assertEquals('Stream not found', callbackStub.args[0][0].code);

            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnRenderingCompletePassesEndedMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple", "antie/events/mediaevent"],
            function(application, SamsungPlayer, MediaEvent) {

                var callbackStub = self.sandbox.stub();
                application.getDevice().createMediaInterface("id", "video", callbackStub);

                window.SamsungMapleOnRenderingComplete();

                // SamsungMapleOnRenderingComplete calls SamsungMapleOnTimeUpdate first so will be the second call.
                assertInstanceOf(MediaEvent, callbackStub.args[1][0]);
                assertEquals('ended', callbackStub.args[1][0].type);

            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnTimeUpdatePassesTimeUpdateMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(2);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple", "antie/events/mediaevent"],
            function(application, SamsungPlayer, MediaEvent) {

                var callbackStub = self.sandbox.stub();
                application.getDevice().createMediaInterface("id", "video", callbackStub);

                window.SamsungMapleOnTimeUpdate();

                assertInstanceOf(MediaEvent, callbackStub.args[0][0]);
                assertEquals('timeupdate', callbackStub.args[0][0].type);

            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnStreamInfoReadyPassesFourMediaEventsToEventHandlingCallback = function (queue) {
        expectAsserts(8);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple", "antie/events/mediaevent"],
            function(application, SamsungPlayer, MediaEvent) {

                var callbackStub = self.sandbox.stub();
                application.getDevice().createMediaInterface("id", "video", callbackStub);

                window.SamsungMapleOnStreamInfoReady();

                // loadedmetadata
                assertInstanceOf(MediaEvent, callbackStub.args[0][0]);
                assertEquals('loadedmetadata', callbackStub.args[0][0].type);

                // durationchange
                assertInstanceOf(MediaEvent, callbackStub.args[1][0]);
                assertEquals('durationchange', callbackStub.args[1][0].type);

                // canplay
                assertInstanceOf(MediaEvent, callbackStub.args[2][0]);
                assertEquals('canplay', callbackStub.args[2][0].type);

                // canplaythrough
                assertInstanceOf(MediaEvent, callbackStub.args[3][0]);
                assertEquals('canplaythrough', callbackStub.args[3][0].type);

            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnCurrentPlayTimePassesPlayAndPlayingMediaEventsToEventHandlingCallbackWhenNotAlreadyPlaying = function (queue) {
        expectAsserts(6);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple", "antie/events/mediaevent"],
            function(application, SamsungPlayer, MediaEvent) {

                var callbackStub = self.sandbox.stub();
                var mediaInterface = application.getDevice().createMediaInterface("id", "video", callbackStub);

                var source = {
                    getURL: function() { return "url"; },
                    isLiveStream: function() { return false; }
                };

                mediaInterface.setSources([ source ], { });

                self.playerPlugin.GetDuration.returns(10000);
                window.SamsungMapleOnStreamInfoReady();

                // Set-up complete. Confirm state before proceeding.
                assertEquals(4, callbackStub.callCount);

                window.SamsungMapleOnCurrentPlayTime(1000);

                assertEquals(6, callbackStub.callCount);

                assertInstanceOf(MediaEvent, callbackStub.args[4][0]);
                assertEquals('play', callbackStub.args[4][0].type);

                assertInstanceOf(MediaEvent, callbackStub.args[5][0]);
                assertEquals('playing', callbackStub.args[5][0].type);

            }, config);
    };

    this.SamsungMapleTest.prototype.testSetCurrentTimePassesSeekingMediaEventsToEventHandlingCallbackWhenSettingCurrentTime = function (queue) {
        expectAsserts(4);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple", "antie/events/mediaevent"],
            function(application, SamsungPlayer, MediaEvent) {

                var callbackStub = self.sandbox.stub();
                var mediaInterface = application.getDevice().createMediaInterface("id", "video", callbackStub);

                var source = {
                    getURL: function() { return "url"; },
                    isLiveStream: function() { return false; }
                };

                mediaInterface.setSources([ source ], { });

                self.playerPlugin.GetDuration.returns(10000);
                window.SamsungMapleOnStreamInfoReady();

                window.SamsungMapleOnCurrentPlayTime(1000);

                // Set-up complete. Confirm state before proceeding.
                assertEquals(6, callbackStub.callCount);

                mediaInterface.setCurrentTime(2000);

                assertEquals(7, callbackStub.callCount);

                assertInstanceOf(MediaEvent, callbackStub.args[6][0]);
                assertEquals('seeking', callbackStub.args[6][0].type);


            }, config);
    };

    this.SamsungMapleTest.prototype.testSamsungMapleOnCurrentPlayTimePassesSeekedMediaEventsToEventHandlingCallbackWhenSeeking = function (queue) {
        expectAsserts(4);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple", "antie/events/mediaevent"],
            function(application, SamsungPlayer, MediaEvent) {

                var callbackStub = self.sandbox.stub();
                var mediaInterface = application.getDevice().createMediaInterface("id", "video", callbackStub);

                var source = {
                    getURL: function() { return "url"; },
                    isLiveStream: function() { return false; }
                };

                mediaInterface.setSources([ source ], { });

                self.playerPlugin.GetDuration.returns(10000);
                window.SamsungMapleOnStreamInfoReady();

                window.SamsungMapleOnCurrentPlayTime(1000);

                mediaInterface.setCurrentTime(2000);

                // Set-up complete. Confirm state before proceeding.
                assertEquals(7, callbackStub.callCount);

                window.SamsungMapleOnCurrentPlayTime(2000);

                // 9, rather than 8, as we'll also get a time update event.
                assertEquals(9, callbackStub.callCount);

                assertInstanceOf(MediaEvent, callbackStub.args[7][0]);
                assertEquals('seeked', callbackStub.args[7][0].type);


            }, config);
    };

    this.SamsungMapleTest.prototype.testPausingPassesPauseMediaEventToEventHandlingCallback = function (queue) {
        expectAsserts(3);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple", "antie/events/mediaevent"],
            function(application, SamsungPlayer, MediaEvent) {

                var callbackStub = self.sandbox.stub();
                var mediaInterface = application.getDevice().createMediaInterface("id", "video", callbackStub);

                var clock = sinon.useFakeTimers();

                mediaInterface.pause();

                // For some reason the event is emmitted in a setTimeout(...,0) block - we need to tick so it is called.
                clock.tick(1);

                assertTrue(callbackStub.calledOnce);
                assertInstanceOf(MediaEvent, callbackStub.args[0][0]);
                assertEquals('pause', callbackStub.args[0][0].type);

                clock.restore();

            }, config);
    };

    this.SamsungMapleTest.prototype.testPlayingWhenPausedPassesMediaEventsToEventHandlingCallback = function (queue) {
        expectAsserts(6);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple", "antie/events/mediaevent"],
            function(application, SamsungPlayer, MediaEvent) {

                var callbackStub = self.sandbox.stub();
                var mediaInterface = application.getDevice().createMediaInterface("id", "video", callbackStub);

                var clock = sinon.useFakeTimers();

                mediaInterface.pause();

                // For some reason the paused event is emmitted in a setTimeout(...,0) block - we need to tick so it is called.
                clock.tick(1);

                // Ensure state before we start our test.
                assertTrue(callbackStub.calledOnce);

                mediaInterface.play();

                assertTrue(callbackStub.calledThrice);

                assertInstanceOf(MediaEvent, callbackStub.args[1][0]);
                assertEquals('play', callbackStub.args[1][0].type);

                assertInstanceOf(MediaEvent, callbackStub.args[2][0]);
                assertEquals('playing', callbackStub.args[2][0].type);

                clock.restore();

            }, config);
    };

    this.SamsungMapleTest.prototype.testThatStopIsCalledOnThePlayerPluginWhenAHideEventIsFired = function (queue) {
      expectAsserts(1);
      var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple", "antie/events/mediaevent"],
            function(application, SamsungPlayer,  MediaErrorEvent) {

              var callbackStub = self.sandbox.stub();
              var mediaInterface = application.getDevice().createMediaInterface("id", "video", callbackStub);

              var event = new CustomEvent('hide');
              window.dispatchEvent(event);
              assertTrue(this.playerPlugin.Stop.calledOnce);
            }, config);
    };
})();
