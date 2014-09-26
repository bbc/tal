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

    var config = null;
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

        playerPlugin.Pause.returns(1);
        playerPlugin.JumpBackward.returns(1);
        playerPlugin.JumpForward.returns(1);

        var originalGetElementById = document.getElementById;
        this.sandbox.stub(document, "getElementById", function(id) {
           switch(id) {
               case "playerPlugin":
                   return playerPlugin;
               default:
                   return originalGetElementById.call(document, id);
           }
        });

        config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/samsung_maple"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};
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

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromWhileBufferingDefersJumpUntilPlaying = function(queue) {
        // Samsung advice to block seeking while buffering:
        // http://www.samsungdforum.com/Guide/tec00118/index.html
        expectAsserts(2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            deviceMockingHooks.startBuffering(this._mediaPlayer);

            this._mediaPlayer.playFrom(50);
            assert(playerPlugin.JumpForward.notCalled);

            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            assert(playerPlugin.JumpForward.calledOnce);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testJumpOnDeviceWhenPlayFromCalledInInitialBufferingState = function(queue) {
        expectAsserts(7);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            assert(playerPlugin.ResumePlay.calledOnce);
            assert(playerPlugin.ResumePlay.calledWith('testUrl', 0));
            assert(playerPlugin.JumpForward.notCalled);
            this._mediaPlayer.playFrom(50);

            assert(playerPlugin.ResumePlay.calledOnce);
            assert(playerPlugin.JumpForward.notCalled);

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            assert(playerPlugin.JumpForward.calledOnce);
            assert(playerPlugin.JumpForward.calledWith(50));
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

    // We ignore attempts to seek near the current time because in this situation, JumpForward() and JumpBackward()
    // can return 1 (success) and then continue playing without a jump occurring. This leaves us in the BUFFERING state,
    // because we wait for an OnBufferingStart/OnBufferingComplete pair. This is distinct from other tests below where
    // JumpForward() and JumpBackward() return 0 (failure), in which case we are able to transition back to
    // PLAYING in response.
    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromCurrentTimeInPlayingStateBuffersThenPlays = function(queue) {
        var initialTimeMs = 30000;
        var targetTimeSecs = 30;
        this.doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays(queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromNearAfterCurrentTimeInPlayingStateBuffersThenPlays = function(queue) {
        var initialTimeMs = 30000;
        var targetTimeSecs = 32.5;
        this.doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays(queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromNearBeforeCurrentTimeInPlayingStateBuffersThenPlays = function(queue) {
        var initialTimeMs = 30000;
        var targetTimeSecs = 27.500;
        this.doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays(queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMapleMediaPlayerTests.prototype.doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays = function(queue, initialTimeMs, targetTimeSecs) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            window.SamsungMapleOnCurrentPlayTime(initialTimeMs);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            this._mediaPlayer.playFrom(targetTimeSecs);
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
            window.SamsungMapleOnCurrentPlayTime(0);

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

    this.SamsungMapleMediaPlayerTests.prototype.doTestPlayFromNearCurrentTimeWhenPausedBuffersThenPlays = function(queue, initialTimeMs, targetTimeSecs) {
        expectAsserts(5);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            window.SamsungMapleOnCurrentPlayTime(initialTimeMs);
            this._mediaPlayer.pause();

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            assert(playerPlugin.Resume.notCalled);
            this._mediaPlayer.playFrom(targetTimeSecs);
            assert(playerPlugin.Resume.calledOnce);
            assert(eventHandler.calledTwice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.args[1][0].type);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromCurrentTimeWhenPausedBuffersThenPlays = function(queue) {
        var initialTimeMs = 50000;
        var targetTimeSecs = 50;
        this.doTestPlayFromNearCurrentTimeWhenPausedBuffersThenPlays(queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromNearAfterCurrentTimeWhenPausedBuffersThenPlays = function(queue) {
        var initialTimeMs = 50000;
        var targetTimeSecs = 52.5;
        this.doTestPlayFromNearCurrentTimeWhenPausedBuffersThenPlays(queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromNearBeforeCurrentTimeWhenPausedBuffersThenPlays = function(queue) {
        var initialTimeMs = 50000;
        var targetTimeSecs = 47.5;
        this.doTestPlayFromNearCurrentTimeWhenPausedBuffersThenPlays(queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromDifferentTimeWhenPausedBuffersAndSeeks = function(queue) {
        expectAsserts(8);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);
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

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromDifferentTimeWhenPausedResumesAfterJump = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            this._mediaPlayer.pause();
            assert(playerPlugin.Resume.notCalled);

            this._mediaPlayer.playFrom(50);
            assert(playerPlugin.Resume.calledOnce);
            // Call Resume() after JumpForward() to avoid a single frame being played before the jump (D8000).
            assert(playerPlugin.Resume.calledAfter(playerPlugin.JumpForward));
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
            window.SamsungMapleOnCurrentPlayTime(0);

            assert(playerPlugin.JumpForward.notCalled);

            this._mediaPlayer.playFrom(100);

            assert(playerPlugin.JumpForward.calledOnce);
            assert(playerPlugin.JumpForward.calledWith(59.9));
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationClampsToClampOffsetInConfiguration = function(queue) {
        config.streaming = {
            overrides: {
                clampOffsetFromEndOfRange: 10
            }
        };

        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            assert(playerPlugin.JumpForward.notCalled);

            this._mediaPlayer.playFrom(100);

            assert(playerPlugin.JumpForward.calledOnce);
            assert(playerPlugin.JumpForward.calledWith(50));
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstMidStreamBufferingClampsToJustBeforeEnd = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);
            deviceMockingHooks.startBuffering(this._mediaPlayer);

            assert(playerPlugin.JumpForward.notCalled);

            this._mediaPlayer.playFrom(100);
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            assert(playerPlugin.JumpForward.calledOnce);
            assertEquals(59.9, playerPlugin.JumpForward.args[0][0]);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstInitialBufferingClampsToJustBeforeEnd = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);

            assert(playerPlugin.JumpForward.notCalled);

            this._mediaPlayer.playFrom(100);

            assert(playerPlugin.JumpForward.notCalled);

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            assert(playerPlugin.JumpForward.calledOnce);
            assertEquals(59.9, playerPlugin.JumpForward.args[0][0]);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstPausedClampsToJustBeforeEnd = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);
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

    this.SamsungMapleMediaPlayerTests.prototype.testBufferingStartDeviceEventWhenAlreadyBufferingDoesNotCauseSecondEvent = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            deviceMockingHooks.startBuffering(this._mediaPlayer);

            assert(eventHandler.notCalled);
        });

    };
    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromWhileAtNonZeroTimeGCausesRelativeJump = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            window.SamsungMapleOnCurrentPlayTime(10000);

            assertEquals(10, this._mediaPlayer.getCurrentTime());
            assert(playerPlugin.JumpForward.notCalled);

            this._mediaPlayer.playFrom(30);

            assert(playerPlugin.JumpForward.calledOnce);
            assert(playerPlugin.JumpForward.calledWith(20));
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testStatusMessageIncludesUpdatedTime = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            var callback = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, callback);

            window.SamsungMapleOnCurrentPlayTime(10000);

            assert(callback.calledOnce);
            assertEquals(10, callback.args[0][0].currentTime);

            window.SamsungMapleOnCurrentPlayTime(20000);

            assert(callback.calledTwice);
            assertEquals(20, callback.args[1][0].currentTime);


        });
    };


    this.SamsungMapleMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInPausedStateWhenDeviceIsAbleToPauseAfterBuffering = function(queue) {
        expectAsserts(2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            this._mediaPlayer.pause();

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assert(playerPlugin.Pause.calledOnce);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsRemainsInBufferingStateWhenDeviceIsUnableToPauseAfterBuffering = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            this._mediaPlayer.pause();

            playerPlugin.Pause.returns(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBuffering = function(queue) {
        expectAsserts(2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            this._mediaPlayer.pause();

            playerPlugin.Pause.returns(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.Pause.calledOnce);

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            assert(playerPlugin.Pause.calledTwice);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsThenResumingWhileAttemptingToPauseResultsInPlayingState = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            this._mediaPlayer.pause();

            playerPlugin.Pause.returns(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            this._mediaPlayer.resume();
            playerPlugin.Pause.returns(1);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInPausedStateWhenPausedAfterMultipleAttempts = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            this._mediaPlayer.pause();

            playerPlugin.Pause.returns(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.Pause.calledOnce);

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            assert(playerPlugin.Pause.calledTwice);

            playerPlugin.Pause.returns(1);

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            assert(playerPlugin.Pause.calledThrice);
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testStatusEventsOnlyEmittedInPlayingState = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            this._mediaPlayer.pause();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            var callback = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, callback);

            window.SamsungMapleOnCurrentPlayTime(10000);

            assert(callback.notCalled);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromWhilePlayingBeforeFirstStatusEventDefersJumpAndJumpsByCorrectAmount = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(30);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.JumpForward.notCalled);
            this._mediaPlayer.playFrom(50);

            assert(playerPlugin.JumpForward.notCalled);

            // Device may not start playback from exactly the position requested, e.g. it may go to a keyframe
            var positionCloseToRequestedPosition = 32000;
            window.SamsungMapleOnCurrentPlayTime(positionCloseToRequestedPosition);

            assert(playerPlugin.JumpForward.calledOnce);
            assertEquals(18, playerPlugin.JumpForward.args[0][0]);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromWhilePausedBeforeFirstStatusEventDefersJumpAndJumpsByCorrectAmount = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(30);
            this._mediaPlayer.pause();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.JumpForward.notCalled);

            this._mediaPlayer.playFrom(50);

            assert(playerPlugin.JumpForward.notCalled);

            // Device may not start playback from exactly the position requested, e.g. it may go to a keyframe
            var positionCloseToRequestedPosition = 32000;
            window.SamsungMapleOnCurrentPlayTime(positionCloseToRequestedPosition);

            assert(playerPlugin.JumpForward.calledOnce);
            assertEquals(18, playerPlugin.JumpForward.args[0][0]);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testMediaPlayerIsStoppedOnAppHide = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            var addStub = this.sandbox.stub(window, "addEventListener");

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");

            var filtered = addStub.withArgs("hide", sinon.match.func, false);
            assert(filtered.calledOnce);
            var addedCallback = filtered.args[0][1];

            assert(playerPlugin.Stop.notCalled);

            addedCallback(new CustomEvent('hide') );

            assert(playerPlugin.Stop.calledOnce);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testWindowHideEventListenerIsTornDownOnReset = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            var addStub = this.sandbox.stub(window, "addEventListener");
            var removeStub = this.sandbox.stub(window, "removeEventListener");

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");

            var filteredAdd = addStub.withArgs("hide", sinon.match.func, false);
            assert(filteredAdd.calledOnce);
            var addedCallback = filteredAdd.args[0][1];

            assert(removeStub.notCalled);

            this._mediaPlayer.reset();

            var filteredRemove = removeStub.withArgs('hide', sinon.match.func, false);
            assert(filteredRemove.calledOnce);
            var removedCallback = filteredRemove.args[0][1];
            assertSame(addedCallback, removedCallback);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testMediaPlayerIsStoppedOnAppUnload = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            var addStub = this.sandbox.stub(window, "addEventListener");

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");

            var filtered = addStub.withArgs("unload", sinon.match.func, false);
            assert(filtered.calledOnce);
            var addedCallback = filtered.args[0][1];

            assert(playerPlugin.Stop.notCalled);

            addedCallback(new CustomEvent('unload'));

            assert(playerPlugin.Stop.calledOnce);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testWindowUnloadEventListenerIsTornDownOnReset = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            var addStub = this.sandbox.stub(window, "addEventListener");
            var removeStub = this.sandbox.stub(window, "removeEventListener");

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");

            var filteredAdd = addStub.withArgs("unload", sinon.match.func, false);
            assert(filteredAdd.calledOnce);
            var addedCallback = filteredAdd.args[0][1];

            assert(removeStub.notCalled);

            this._mediaPlayer.reset();

            var filteredRemove = removeStub.withArgs('unload', sinon.match.func, false);
            assert(filteredRemove.calledOnce);
            var removedCallback = filteredRemove.args[0][1];
            assertSame(addedCallback, removedCallback);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testCurrentTimeIsUpdatedByOnCurrentPlayTimeEvents = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());

            assertEquals(0, this._mediaPlayer.getCurrentTime());

            window.SamsungMapleOnCurrentPlayTime(10000);

            assertEquals(10, this._mediaPlayer.getCurrentTime());

            window.SamsungMapleOnCurrentPlayTime(20000);

            assertEquals(20, this._mediaPlayer.getCurrentTime());
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testFailedJumpReturnsToPlayingState = function(queue) {
        expectAsserts(5);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);
            playerPlugin.JumpForward.returns(0);

            this._mediaPlayer.playFrom(30);

            assert(eventHandler.calledTwice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.firstCall.args[0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.secondCall.args[0].type);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testFailedDeferredJumpReturnsToPlayingState = function(queue) {
        expectAsserts(6);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            this._mediaPlayer.playFrom(30);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);
            playerPlugin.JumpForward.returns(0);

            assert(eventHandler.notCalled);
            assert(playerPlugin.JumpForward.notCalled);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            assert(playerPlugin.JumpForward.calledOnce);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.lastCall.args[0].type);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testDeferredSeekIsCancelledWhenTargetIsCurrentTime = function(queue) {
        var targetTime = 30;
        this.doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime(queue, targetTime);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testDeferredSeekIsCancelledWhenTargetIsNearAfterCurrentTime = function(queue) {
        var targetTime = 32.5;
        this.doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime(queue, targetTime);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testDeferredSeekIsCancelledWhenTargetIsNearBeforeCurrentTime = function(queue) {
        var targetTime = 27.5;
        this.doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime(queue, targetTime);
    };

    this.SamsungMapleMediaPlayerTests.prototype.doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime = function(queue, targetTime) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(30);

            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());

            this._mediaPlayer.playFrom(50);
            this._mediaPlayer.playFrom(targetTime);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            var deviceSeeksToKeyFrameAtPosition = 30000;
            window.SamsungMapleOnCurrentPlayTime(deviceSeeksToKeyFrameAtPosition);

            assert(playerPlugin.JumpForward.notCalled);
            assert(playerPlugin.JumpBackward.notCalled);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
        });
    };

    // **** WARNING **** WARNING **** WARNING: These TODOs are NOT complete/exhaustive
    // TODO: Investigate if we should keep a reference to the original player plugin and restore on tear-down in the same way media/samsung_maple modifier
    // -- This appears to only be the tvmwPlugin - if we don't need it then we shouldn't modify it.
    // -- UPDATE: I haven't seen any ill effects on the 2013 FoxP from not using tvmwPlugin - needs further
    //    investigation on other devices.
    // TODO: Handle any errors from device APIs return values (e.g. Stop(), Pause() etc.)
    // TODO: 'Seek to End' is super unrelaible on Samsung D8000. Do we need to clamp to the end -10 seconds (seems to be the
    //       amount of time required to ensure 'Seek to End' works)? Or do we use a more cleverer workaround e.g. detect
    //       failure to seek and try a different seek time?
    //          - Defer seeking to the next clock tick so we jump forward by the right amount? Current time ticks every
    //            half-second (ish) so we may be trying to request going up to half a second beyond the end of the media
    // TODO: Determine if we need to set the window size - the Samsung 2010 apparentlyh starts video playback in a small window by default (see media/samsung_maple.js:394)
    // TODO: Test to ensure we able to set a clampOffsetFromEndOfRange override of zero (0) in config (will currently use default?)

    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all MediaPlayer implementations (last, so it can detect conflicts)
    MixinCommonMediaTests(this.SamsungMapleMediaPlayerTests, "antie/devices/mediaplayer/samsung_maple", config, deviceMockingHooks);

})();
