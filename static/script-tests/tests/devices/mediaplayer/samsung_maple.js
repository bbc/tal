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
    this.SamsungMapleMediaPlayerTests = AsyncTestCase("SamsungMapleMediaPlayer");

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/samsung_maple"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    var playerPlugin = null;

    // Setup device specific mocking
    var deviceMockingHooks = {
        setup: function(sandbox, application) {

            // Override ResumePlay to update the time for the common tests only - although the Samsung specific tests
            // do use these mocking hooks, they do not call setup.
            playerPlugin.ResumePlay = function (source, seconds) {
                window.SamsungMapleOnCurrentPlayTime(seconds * 1000);
            }
        },
        sendMetadata: function(mediaPlayer, currentTime, range) {
            playerPlugin.GetDuration = function() {
                return range.end * 1000;
            };
            if (window.SamsungMapleOnStreamInfoReady) {
                // Make sure we have the event listeners before calling them (we may have torn down during onError)
                window.SamsungMapleOnStreamInfoReady();
            }
        },
        finishBuffering: function(mediaPlayer) {
            if (window.SamsungMapleOnBufferingComplete) {
                // Make sure we have the event listener before calling it (we may have torn down during onError)
                window.SamsungMapleOnBufferingComplete();
            }
        },
        emitPlaybackError: function(mediaPlayer) {
            window.SamsungMapleOnRenderError();
        },
        reachEndOfMedia: function(mediaPlayer) {
            window.SamsungMapleOnRenderingComplete();
        },
        startBuffering: function(mediaPlayer) {
            window.SamsungMapleOnBufferingStart();
        },
        mockTime: function(mediaplayer) {

        },
        makeOneSecondPass: function(mediaplayer) {
            window.SamsungMapleOnCurrentPlayTime((mediaplayer.getCurrentTime() + 1) * 1000);
        },
        unmockTime: function(mediaplayer) {

        }
    };

    this.SamsungMapleMediaPlayerTests.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();

        playerPlugin = {
            JumpBackward: this.sandbox.stub(),
            JumpForward: this.sandbox.stub(),
            Pause: this.sandbox.stub(),
            ResumePlay: this.sandbox.stub(),
            Resume: this.sandbox.stub(),
            Stop: this.sandbox.stub()
        };

        var originalGetElementById = document.getElementById;
        this.sandbox.stub(document, "getElementById", function(id) {
           switch(id) {
               case "playerPlugin":
                   return playerPlugin;
               default:
                   return originalGetElementById.call(document, id);
           }
        });

    };

    this.SamsungMapleMediaPlayerTests.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.SamsungMapleMediaPlayerTests.prototype.runMediaPlayerTest = function (queue, action) {
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/samsung_maple", "antie/devices/mediaplayer/mediaplayer"],
            function(application, MediaPlayerImpl, MediaPlayer) {
                this._device = application.getDevice();
                this._errorLog = this.sandbox.stub(this._device.getLogger(), "error");
                self._mediaPlayer = this._device.getMediaPlayer();
                action.call(self, MediaPlayer);
            }, config);
    };

    //---------------------
    // Samsung Maple specific tests
    //---------------------

    var listenerFunctions = [
        'SamsungMapleOnRenderError',
        'SamsungMapleOnRenderingComplete',
        'SamsungMapleOnBufferingStart',
        'SamsungMapleOnBufferingComplete',
        'SamsungMapleOnStreamInfoReady',
        'SamsungMapleOnCurrentPlayTime',
        'SamsungMapleOnConnectionFailed',
        'SamsungMapleOnNetworkDisconnected',
        'SamsungMapleOnStreamNotFound',
        'SamsungMapleOnAuthenticationFailed'
    ];

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionsAddedDuringSetSource = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            var i;
            var func;

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertUndefined("Expecting " + func + " to be undefined", window[func]);
            }

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertFunction("Expecting " + func + " to be a function", window[func]);
            }
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionsRemovedOnError = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var i;
            var func;

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertFunction("Expecting " + func + " to be a function", window[func]);
            }

            deviceMockingHooks.emitPlaybackError(this._mediaPlayer);

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertUndefined("Expecting " + func + " to be undefined", window[func]);
            }
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionsRemovedOnReset = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var i;
            var func;

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertFunction("Expecting " + func + " to be a function", window[func]);
            }

            this._mediaPlayer.reset();

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertUndefined("Expecting " + func + " to be undefined", window[func]);
            }
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionsReferencedOnObjectDuringSetSource = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            var i;
            var func;
            var hook;

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring("SamsungMaple".length);
                assertUndefined(playerPlugin[hook]);
            }

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring("SamsungMaple".length);
                assertEquals(func, playerPlugin[hook]);
            }
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionReferencesOnObjectRemovedOnError= function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            var i;
            var func;
            var hook;

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring("SamsungMaple".length);
                assertEquals(func, playerPlugin[hook]);
            }

            deviceMockingHooks.emitPlaybackError(this._mediaPlayer);

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring("SamsungMaple".length);
                assertUndefined(playerPlugin[hook]);
            }

        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionReferencesOnObjectRemovedOnReset = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            var i;
            var func;
            var hook;

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring("SamsungMaple".length);
                assertEquals(func, playerPlugin[hook]);
            }

            this._mediaPlayer.reset();

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring("SamsungMaple".length);
                assertUndefined(playerPlugin[hook]);
            }

        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testResumePlayCalledOnDeviceWhenPlayFromCalledInStoppedState = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assert(playerPlugin.ResumePlay.notCalled);
            this._mediaPlayer.playFrom(0);
            assert(playerPlugin.ResumePlay.calledWith('testURL', 0));
            assert(playerPlugin.ResumePlay.calledOnce);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testResumePlayCalledWithTimePassedIntoPlayingFrom = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assert(playerPlugin.ResumePlay.notCalled);
            this._mediaPlayer.playFrom(19);
            assert(playerPlugin.ResumePlay.calledWith('testURL', 19));
            assert(playerPlugin.ResumePlay.calledOnce);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testResumePlayCalledOnDeviceWhenPlayFromCalledInBufferingState = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            assert(playerPlugin.ResumePlay.calledWith('testUrl', 0));
            assert(playerPlugin.ResumePlay.calledOnce);
            this._mediaPlayer.playFrom(50);
            assert(playerPlugin.ResumePlay.calledWith('testUrl', 50));
            assert(playerPlugin.ResumePlay.calledTwice);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testNoSecondBufferingEventWhenPlayingFromABufferingState = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            var numEvents = eventHandler.callCount;
            this._mediaPlayer.playFrom(10);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            assertEquals(numEvents, eventHandler.callCount);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromCurrentTimeInPlayingStateBuffersThenPlays = function(queue) {
        expectAsserts(5);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            window.SamsungMapleOnCurrentPlayTime(50000);
            assertEquals(50, this._mediaPlayer.getCurrentTime());

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            this._mediaPlayer.playFrom(50);
            assert(eventHandler.calledTwice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.args[1][0].type);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromDifferentTimeWhenPlayingBuffersAndSeeks = function(queue) {
        expectAsserts(8);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            assert(playerPlugin.ResumePlay.calledOnce);
            assert(playerPlugin.JumpForward.notCalled);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            this._mediaPlayer.playFrom(50);
            assert(eventHandler.calledOnce);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);

            assert(playerPlugin.ResumePlay.calledOnce);
            assert(playerPlugin.JumpForward.calledOnce);
            assert(playerPlugin.JumpForward.calledWith(50));
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromEarlierTimeWhenPlayingBuffersAndSeeks = function(queue) {
        expectAsserts(9);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(50);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 50, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(50000);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            assert(playerPlugin.ResumePlay.calledOnce);
            assert(playerPlugin.JumpBackward.notCalled);
            assertEquals(50, this._mediaPlayer.getCurrentTime());

            this._mediaPlayer.playFrom(20);

            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            assert(playerPlugin.ResumePlay.calledOnce);
            assert(playerPlugin.JumpForward.notCalled);
            assert(playerPlugin.JumpBackward.calledOnce);
            assert(playerPlugin.JumpBackward.calledWith(30));
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromCurrentTimeInPausedStateBuffersThenPlays = function(queue) {
        expectAsserts(7);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            window.SamsungMapleOnCurrentPlayTime(50000);
            this._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assertEquals(50, this._mediaPlayer.getCurrentTime());

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            assert(playerPlugin.Resume.notCalled);
            this._mediaPlayer.playFrom(50);
            assert(playerPlugin.Resume.calledOnce);
            assert(eventHandler.calledTwice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.args[1][0].type);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromDifferentTimeWhenPausedBuffersAndSeeks = function(queue) {
        expectAsserts(8);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            this._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());

            assert(playerPlugin.JumpForward.notCalled);
            assert(playerPlugin.ResumePlay.calledOnce);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            this._mediaPlayer.playFrom(50);
            assert(eventHandler.calledOnce);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);

            assert(playerPlugin.ResumePlay.calledOnce);
            assert(playerPlugin.JumpForward.calledOnce);
            assert(playerPlugin.JumpForward.calledWith(50));
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromEarlierTimeWhenPausedBuffersAndSeeks = function(queue) {
        expectAsserts(9);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(50);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 50, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(50000);
            this._mediaPlayer.pause();

            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assert(playerPlugin.ResumePlay.calledOnce);
            assert(playerPlugin.JumpBackward.notCalled);
            assertEquals(50, this._mediaPlayer.getCurrentTime());

            this._mediaPlayer.playFrom(20);

            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            assert(playerPlugin.ResumePlay.calledOnce);
            assert(playerPlugin.JumpForward.notCalled);
            assert(playerPlugin.JumpBackward.calledOnce);
            assert(playerPlugin.JumpBackward.calledWith(30));
        });
    };



    this.SamsungMapleMediaPlayerTests.prototype.testResumeWhenPausedCallsResume = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            this._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());

            assert(playerPlugin.Resume.notCalled);

            this._mediaPlayer.resume();

            assert(playerPlugin.Resume.calledOnce);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPauseCallsPauseWhenPlaying = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.Pause.notCalled);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());

            this._mediaPlayer.pause();

            assert(playerPlugin.Pause.calledOnce);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testStopCallsStopWhenPlaying = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.Stop.notCalled);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());

            this._mediaPlayer.stop();

            assert(playerPlugin.Stop.calledOnce);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testMediaStoppedOnError = function(queue) {
        expectAsserts(2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.Stop.notCalled);

            deviceMockingHooks.emitPlaybackError(this._mediaPlayer);

            assert(playerPlugin.Stop.calledOnce);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testOnRenderErrorCausesErrorEvent = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            window.SamsungMapleOnRenderError();

            assert(eventHandler.calledOnce);
            assertEquals(MediaPlayer.EVENT.ERROR, eventHandler.args[0][0].type);
            assert(this._errorLog.calledOnce);
            assert(this._errorLog.calledWith("Media element emitted OnRenderError"));

        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testOnConnectionFailedCausesErrorEvent = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            window.SamsungMapleOnConnectionFailed();

            assert(eventHandler.calledOnce);
            assertEquals(MediaPlayer.EVENT.ERROR, eventHandler.args[0][0].type);
            assert(this._errorLog.calledOnce);
            assert(this._errorLog.calledWith("Media element emitted OnConnectionFailed"));

        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testOnNetworkDisconnectedCausesErrorEvent = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            window.SamsungMapleOnNetworkDisconnected();

            assert(eventHandler.calledOnce);
            assertEquals(MediaPlayer.EVENT.ERROR, eventHandler.args[0][0].type);
            assert(this._errorLog.calledOnce);
            assert(this._errorLog.calledWith("Media element emitted OnNetworkDisconnected"));

        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testOnStreamNotFoundCausesErrorEvent = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            window.SamsungMapleOnStreamNotFound();

            assert(eventHandler.calledOnce);
            assertEquals(MediaPlayer.EVENT.ERROR, eventHandler.args[0][0].type);
            assert(this._errorLog.calledOnce);
            assert(this._errorLog.calledWith("Media element emitted OnStreamNotFound"));

        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testOnAuthenticationFailedCausesErrorEvent = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            window.SamsungMapleOnAuthenticationFailed();

            assert(eventHandler.calledOnce);
            assertEquals(MediaPlayer.EVENT.ERROR, eventHandler.args[0][0].type);
            assert(this._errorLog.calledOnce);
            assert(this._errorLog.calledWith("Media element emitted OnAuthenticationFailed"));

        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstPlayingClampsToJustBeforeEnd = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.JumpForward.notCalled);

            this._mediaPlayer.playFrom(100);

            assert(playerPlugin.JumpForward.calledOnce);
            assert(playerPlugin.JumpForward.calledWith(59.9));
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstBufferingClampsToJustBeforeEnd = function(queue) {
        expectAsserts(2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            this._mediaPlayer.playFrom(100);

            assert(playerPlugin.ResumePlay.calledTwice);
            assertEquals(59.9, playerPlugin.ResumePlay.args[1][1]);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstPausedClampsToJustBeforeEnd = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            this._mediaPlayer.pause();

            assert(playerPlugin.JumpForward.notCalled);

            this._mediaPlayer.playFrom(100);

            assert(playerPlugin.JumpForward.calledOnce);
            assert(playerPlugin.JumpForward.calledWith(59.9));
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstCompleteClampsToJustBeforeEnd = function(queue) {
        expectAsserts(2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);
            this._mediaPlayer.playFrom(100);

            assert(playerPlugin.ResumePlay.calledTwice);
            assertEquals(59.9, playerPlugin.ResumePlay.args[1][1]);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationBeforeMetaDataClampsAfterMetadata = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(100);

            assert(playerPlugin.ResumePlay.calledOnce);

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });

            assert(playerPlugin.ResumePlay.calledTwice);
            assertEquals(59.9, playerPlugin.ResumePlay.args[1][1]);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testStopIsCalledWhenMediaCompletes = function(queue) {
        expectAsserts(2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.Stop.notCalled);

            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);

            assert(playerPlugin.Stop.calledOnce);
        });
    };

    // **** WARNING **** WARNING **** WARNING: These TODOs are NOT complete/exhaustive
    // TODO: Check if we should comment in implementation that only one video component can be added to the design at a time - http://www.samsungdforum.com/Guide/tut00078/index.html
    // -- Not clear at time of writing if the tutorial is limiting it based on some sort of SDK/WYSIWYG restriction, or a Samsung Maple restriction
    // TODO: See if all three plugins required by the media/samsung_maple modifier are required
    // TODO: Investigate if we should keep a reference to the original player plugin and restore on tear-down in the same way media/samsung_maple modifier
    // -- This appears to only be the tvmwPlugin - if we don't need it then we shouldn't modify it.
    // TODO: Investigate if we should do the teardown in window.hide that is done in the media/samsung_maple modifier
    // -- "hide" is needed for newer devices
    // -- "unload" is needed for older devices - media/samsung_maple_unload
    // TODO: Determine if we need to call our own time update method - media/samsung_maple calls it in a couple of places (onRenderingComplete and onCurrentPlayTime)
    // -- Should time only be updated by the device? Should playFrom be setting the time?
    // TODO: Add test that the current time reported is updated by the update events. (Done as a side effect of another test, but should have it's own test really)
    // TODO: Determine if we should be disabling the screen saver (this is commented out in media/samsung_maple and the associated URL now 404s.
    // TODO: Determine if calls (e.g. JumpForward) are blocking
    // BE AWARE: JumpForward does not work consistently between either different points in the playback cycle, or depending on the age of the device: see media/samsung_maple:279-281
    // TODO: Investigate when millisenconds should be used
    // TODO: Ensure all TODOs and FIXMEs in this file are resolved
    //  -- JumpForward / JumpBackward
    // TODO: Following the completion of buffering, if we last called playFrom or resume then play and enter the playing state, if we last called pause then pause and enter the paused state.
    // TODO: Investigate how we should handle any errors from device APIs return values (e.g. Stop(), Pause() etc.)
    // TODO: Determine whether we need to call Stop() onRenderingComplete.
    // TODO: PlayFrom Stopped should call ResumePlay (currently does this - make sure we do not change this).
    // TODO: PlayFrom Complete should call ????
    // TODO: PlayFrom Buffering should call Jump
    // TODO: Stop jumping forward as if we are always at 0

    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all MediaPlayer implementations (last, so it can detect conflicts)
    MixinCommonMediaTests(this.SamsungMapleMediaPlayerTests, "antie/devices/mediaplayer/samsung_maple", config, deviceMockingHooks);

})();
