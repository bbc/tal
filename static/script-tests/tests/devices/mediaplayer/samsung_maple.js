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
    // jshint newcap: false
    this.SamsungMapleMediaPlayerTests = AsyncTestCase("SamsungMapleMediaPlayer");

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/samsung_maple"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};
    var screenSize = {};
    var playerPlugin = null;

    // Setup device specific mocking
    var deviceMockingHooks = {
        setup: function(/*sandbox, application*/) {

            // Override ResumePlay to update the time for the common tests only - although the Samsung specific tests
            // do use these mocking hooks, they do not call setup.
            playerPlugin.ResumePlay = function (source, seconds) {
                window.SamsungMapleOnCurrentPlayTime(seconds * 1000);
            };
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
        finishBuffering: function(/*mediaPlayer*/) {
            if (window.SamsungMapleOnBufferingComplete) {
                // Make sure we have the event listener before calling it (we may have torn down during onError)
                window.SamsungMapleOnBufferingComplete();
            }
        },
        emitPlaybackError: function(/*mediaPlayer*/) {
            window.SamsungMapleOnRenderError();
        },
        reachEndOfMedia: function(mediaPlayer) {
            window.SamsungMapleOnCurrentPlayTime(mediaPlayer.getSeekableRange().end * 1000);
            window.SamsungMapleOnRenderingComplete();
        },
        startBuffering: function(/*mediaPlayer*/) {
            window.SamsungMapleOnBufferingStart();
        },
        mockTime: function(/*mediaplayer*/) {
        },
        makeOneSecondPass: function(mediaplayer) {
            window.SamsungMapleOnCurrentPlayTime((mediaplayer.getCurrentTime() + 1) * 1000);
        },
        unmockTime: function(/*mediaplayer*/) {
        }
    };

    this.SamsungMapleMediaPlayerTests.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();

        playerPlugin = {
            JumpBackward: this.sandbox.stub(),
            JumpForward: this.sandbox.stub(),
            Pause: this.sandbox.stub(),
            ResumePlay: this.sandbox.stub(),
            Play: this.sandbox.stub(),
            Resume: this.sandbox.stub(),
            Stop: this.sandbox.stub(),
            SetDisplayArea: this.sandbox.stub()
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
    };

    this.SamsungMapleMediaPlayerTests.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    var runMediaPlayerTest = function (self, queue, action) {
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/samsung_maple", "antie/devices/mediaplayer/mediaplayer"],
            function(application, MediaPlayerImpl, MediaPlayer) {
                self._device = application.getDevice();
                self.sandbox.stub(self._device, 'getScreenSize').returns(screenSize);
                self._errorLog = self.sandbox.stub(self._device.getLogger(), "error");
                self._mediaPlayer = self._device.getMediaPlayer();
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

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

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionsRemovedOnTransitionToErrorState = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var i;
            var func;

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertFunction("Expecting " + func + " to be a function", window[func]);
            }

            try {
                this._mediaPlayer.pause();
            } catch (e) {}

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertUndefined("Expecting " + func + " to be undefined", window[func]);
            }
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionsRemovedOnReset = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

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

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionReferencesOnObjectRemovedOnTransiitonToErrorState = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var i;
            var func;
            var hook;

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring("SamsungMaple".length);
                assertEquals(func, playerPlugin[hook]);
            }

            try {
                this._mediaPlayer.pause();
            } catch (e) {}

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring("SamsungMaple".length);
                assertUndefined(playerPlugin[hook]);
            }

        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionReferencesOnObjectRemovedOnReset = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assert(playerPlugin.ResumePlay.notCalled);
            this._mediaPlayer.playFrom(0);
            assert(playerPlugin.ResumePlay.calledWith('testURL', 0));
            assert(playerPlugin.ResumePlay.calledOnce);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayCalledOnDeviceWhenBeginPlaybackCalledInStoppedState = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assert(playerPlugin.Play.notCalled);
            this._mediaPlayer.beginPlayback();
            assert(playerPlugin.Play.calledWith('testURL'));
            assert(playerPlugin.Play.calledOnce);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testResumePlayCalledWithTimePassedIntoPlayingFrom = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

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
        doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromNearAfterCurrentTimeInPlayingStateBuffersThenPlays = function(queue) {
        var initialTimeMs = 30000;
        var targetTimeSecs = 32.5;
        doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromNearBeforeCurrentTimeInPlayingStateBuffersThenPlays = function(queue) {
        var initialTimeMs = 30000;
        var targetTimeSecs = 27.500;
        doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    var doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays = function(self, queue, initialTimeMs, targetTimeSecs) {
        expectAsserts(3);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            window.SamsungMapleOnCurrentPlayTime(initialTimeMs);

            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);

            self._mediaPlayer.playFrom(targetTimeSecs);
            assert(eventHandler.calledTwice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.args[1][0].type);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromDifferentTimeWhenPlayingBuffersAndSeeks = function(queue) {
        expectAsserts(8);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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

    var doTestPlayFromNearCurrentTimeWhenPausedBuffersThenPlays = function(self, queue, initialTimeMs, targetTimeSecs) {
        expectAsserts(5);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            window.SamsungMapleOnCurrentPlayTime(initialTimeMs);
            self._mediaPlayer.pause();

            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);

            assert(playerPlugin.Resume.notCalled);
            self._mediaPlayer.playFrom(targetTimeSecs);
            assert(playerPlugin.Resume.calledOnce);
            assert(eventHandler.calledTwice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.args[1][0].type);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromCurrentTimeWhenPausedBuffersThenPlays = function(queue) {
        var initialTimeMs = 50000;
        var targetTimeSecs = 50;
        doTestPlayFromNearCurrentTimeWhenPausedBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromNearAfterCurrentTimeWhenPausedBuffersThenPlays = function(queue) {
        var initialTimeMs = 50000;
        var targetTimeSecs = 52.5;
        doTestPlayFromNearCurrentTimeWhenPausedBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromNearBeforeCurrentTimeWhenPausedBuffersThenPlays = function(queue) {
        var initialTimeMs = 50000;
        var targetTimeSecs = 47.5;
        doTestPlayFromNearCurrentTimeWhenPausedBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromDifferentTimeWhenPausedBuffersAndSeeks = function(queue) {
        expectAsserts(8);
        var self = this;
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);
            self._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, self._mediaPlayer.getState());

            assert(playerPlugin.JumpForward.notCalled);
            assert(playerPlugin.ResumePlay.calledOnce);

            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);

            self._mediaPlayer.playFrom(50);
            assert(eventHandler.calledOnce);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);

            assert(playerPlugin.ResumePlay.calledOnce);
            assert(playerPlugin.JumpForward.calledOnce);
            assert(playerPlugin.JumpForward.calledWith(50));
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromDifferentTimeWhenPausedResumesAfterJump = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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

    this.SamsungMapleMediaPlayerTests.prototype.testMediaStoppedOnTransitionToErrorState = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.Stop.notCalled);

            try {
                this._mediaPlayer.beginPlayback();
            } catch (e) {}

            assert(playerPlugin.Stop.calledOnce);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testOnRenderErrorCausesErrorEvent = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            assert(playerPlugin.JumpForward.notCalled);

            this._mediaPlayer.playFrom(100);

            assert(playerPlugin.JumpForward.calledOnce);
            assert(playerPlugin.JumpForward.calledWith(58.9));
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstMidStreamBufferingClampsToJustBeforeEnd = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
            assertEquals(58.9, playerPlugin.JumpForward.args[0][0]);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstInitialBufferingClampsToJustBeforeEnd = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);

            assert(playerPlugin.JumpForward.notCalled);

            this._mediaPlayer.playFrom(100);

            assert(playerPlugin.JumpForward.notCalled);

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            assert(playerPlugin.JumpForward.calledOnce);
            assertEquals(58.9, playerPlugin.JumpForward.args[0][0]);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstPausedClampsToJustBeforeEnd = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);
            this._mediaPlayer.pause();

            assert(playerPlugin.JumpForward.notCalled);

            this._mediaPlayer.playFrom(100);

            assert(playerPlugin.JumpForward.calledOnce);
            assert(playerPlugin.JumpForward.calledWith(58.9));
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstCompleteClampsToJustBeforeEnd = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);
            this._mediaPlayer.playFrom(100);

            assert(playerPlugin.ResumePlay.calledTwice);
            assertEquals(58.9, playerPlugin.ResumePlay.args[1][1]);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromAfterMediaCompletedCallsStopBeforeResumePlay = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);

            assert(playerPlugin.Stop.notCalled);
            playerPlugin.ResumePlay.reset();

            this._mediaPlayer.playFrom(0);

            assert(playerPlugin.Stop.calledOnce);
            assert(playerPlugin.ResumePlay.calledOnce);
            assert(playerPlugin.Stop.calledBefore(playerPlugin.ResumePlay));
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromWhileAtNonZeroTimeGCausesRelativeJump = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            this._mediaPlayer.pause();

            playerPlugin.Pause.returns(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFailsReturningZero = function(queue) {
        var pauseReturnCode = 0;
        doTestPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFails(this, queue, pauseReturnCode);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFailsReturningMinusOne = function(queue) {
        var pauseReturnCode = -1;
        doTestPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFails(this, queue, pauseReturnCode);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFailsReturningFalse = function(queue) {
        var pauseReturnCode = false;
        doTestPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFails(this, queue, pauseReturnCode);
    };

    var doTestPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFails = function(self, queue, pauseReturnCode) {
        expectAsserts(2);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            self._mediaPlayer.playFrom(0);
            self._mediaPlayer.pause();

            playerPlugin.Pause.returns(pauseReturnCode);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assert(playerPlugin.Pause.calledOnce);

            deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
            assert(playerPlugin.Pause.calledTwice);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsThenResumingWhileAttemptingToPauseResultsInPlayingState = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var addStub = this.sandbox.stub(window, "addEventListener");

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.beginPlayback();

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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var addStub = this.sandbox.stub(window, "addEventListener");

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.beginPlayback();

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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

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
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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

    this.SamsungMapleMediaPlayerTests.prototype.testFailedJumpReturningZeroWhilePlayingReturnsToPlayingState = function(queue) {
        var jumpReturnCode = 0;
        doTestFailedJumpWhilePlayingReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testFailedJumpReturningMinusOneWhilePlayingReturnsToPlayingState = function(queue) {
        var jumpReturnCode = -1;
        doTestFailedJumpWhilePlayingReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testFailedJumpReturningFalseWhilePlayingReturnsToPlayingState = function(queue) {
        var jumpReturnCode = false;
        doTestFailedJumpWhilePlayingReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    var doTestFailedJumpWhilePlayingReturnsToPlayingState = function(self, queue, jumpReturnCode) {
        expectAsserts(5);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            assertEquals(MediaPlayer.STATE.PLAYING, self._mediaPlayer.getState());

            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);
            playerPlugin.JumpForward.returns(jumpReturnCode);

            self._mediaPlayer.playFrom(30);

            assert(eventHandler.calledTwice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.firstCall.args[0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.lastCall.args[0].type);
            assertEquals(MediaPlayer.STATE.PLAYING, self._mediaPlayer.getState());
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testFailedJumpReturningZeroWhilePausedGoesToPlayingState = function(queue) {
        var jumpReturnCode = 0;
        doTestFailedJumpWhilePausedReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testFailedJumpReturningMinusOneWhilePausedGoesToPlayingState = function(queue) {
        var jumpReturnCode = -1;
        doTestFailedJumpWhilePausedReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testFailedJumpReturningFalseWhilePausedGoesToPlayingState = function(queue) {
        var jumpReturnCode = false;
        doTestFailedJumpWhilePausedReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    var doTestFailedJumpWhilePausedReturnsToPlayingState = function(self, queue, jumpReturnCode) {
        expectAsserts(5);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            self._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, self._mediaPlayer.getState());

            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);
            playerPlugin.JumpForward.returns(jumpReturnCode);

            self._mediaPlayer.playFrom(30);

            assert(eventHandler.calledTwice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.firstCall.args[0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.lastCall.args[0].type);
            assertEquals(MediaPlayer.STATE.PLAYING, self._mediaPlayer.getState());
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testFailedDeferredJumpRemainsInBufferingState = function(queue) {
        expectAsserts(5);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testFailedDeferredJumpResultsInRepeatedAttemptsToJumpUntilSuccess = function(queue) {
        expectAsserts(8);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
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

            window.SamsungMapleOnCurrentPlayTime(1);
            assert(playerPlugin.JumpForward.calledTwice);

            playerPlugin.JumpForward.returns(1);
            window.SamsungMapleOnCurrentPlayTime(2);
            assert(playerPlugin.JumpForward.calledThrice);

            window.SamsungMapleOnCurrentPlayTime(3);
            assert(playerPlugin.JumpForward.calledThrice);

            // No additional events - we remain in BUFFERING
            assert(eventHandler.notCalled);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testDeferredJumpsDoNotReenterBufferingState = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            this._mediaPlayer.playFrom(30);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);
            playerPlugin.JumpForward.returns(0);

            assert(eventHandler.notCalled);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            window.SamsungMapleOnCurrentPlayTime(0);
            window.SamsungMapleOnCurrentPlayTime(1);
            window.SamsungMapleOnCurrentPlayTime(2);

            assert(eventHandler.withArgs(sinon.match({ type: MediaPlayer.EVENT.BUFFERING })).notCalled);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testDeferredSeekIsCancelledWhenTargetIsCurrentTime = function(queue) {
        var targetTime = 30;
        doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime(this, queue, targetTime);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testDeferredSeekIsCancelledWhenTargetIsNearAfterCurrentTime = function(queue) {
        var targetTime = 32.5;
        doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime(this, queue, targetTime);
    };

    this.SamsungMapleMediaPlayerTests.prototype.testDeferredSeekIsCancelledWhenTargetIsNearBeforeCurrentTime = function(queue) {
        var targetTime = 27.5;
        doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime(this, queue, targetTime);
    };

    var doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime = function(self, queue, targetTime) {
        expectAsserts(4);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            self._mediaPlayer.playFrom(30);

            assertEquals(MediaPlayer.STATE.BUFFERING, self._mediaPlayer.getState());

            self._mediaPlayer.playFrom(50);
            self._mediaPlayer.playFrom(targetTime);

            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);

            deviceMockingHooks.sendMetadata(self._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            var deviceSeeksToKeyFrameAtPosition = 30000;
            window.SamsungMapleOnCurrentPlayTime(deviceSeeksToKeyFrameAtPosition);

            assert(playerPlugin.JumpForward.notCalled);
            assert(playerPlugin.JumpBackward.notCalled);
            assertEquals(MediaPlayer.STATE.PLAYING, self._mediaPlayer.getState());
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testDisplayAreaSetOnPlayFromForVideo = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            screenSize.width = 987;
            screenSize.height = 654;

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assert(playerPlugin.SetDisplayArea.notCalled);
            this._mediaPlayer.playFrom(0);
            assert(playerPlugin.SetDisplayArea.calledWith(0, 0, 987, 654));
            assert(playerPlugin.SetDisplayArea.calledOnce);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testDisplayAreaSetOnPlayFromForVideoWhenCalledAfterMediaCompleted = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            screenSize.width = 987;
            screenSize.height = 654;

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            this._mediaPlayer.playFrom(0);

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);
            playerPlugin.SetDisplayArea.reset();

            this._mediaPlayer.playFrom(0);

            assert(playerPlugin.SetDisplayArea.calledWith(0, 0, 987, 654));
            assert(playerPlugin.SetDisplayArea.calledOnce);
            assert(playerPlugin.SetDisplayArea.calledAfter(playerPlugin.Stop));
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testDisplayAreaNotSetOnPlayFromForAudioWhenCalledAfterMediaCompleted = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.AUDIO, 'testURL', 'audio/mp4');
            this._mediaPlayer.playFrom(0);

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);
            playerPlugin.SetDisplayArea.reset();

            this._mediaPlayer.playFrom(0);

            assert(playerPlugin.SetDisplayArea.notCalled);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromAndPauseBeforeMetaDataLoadsResultsInSeekFirstThenPauseWithCurrentTime = function(queue) {
        expectAsserts(5);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            this._mediaPlayer.playFrom(30);
            this._mediaPlayer.pause();

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            // Remains in buffering state because we need to seek
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            assert(playerPlugin.JumpForward.calledOnce);

            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.Pause.calledOnce);
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assertEquals(30, this._mediaPlayer.getCurrentTime());
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testDeferredSeekDoesNotPersistAfterReset = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            this._mediaPlayer.playFrom(50);

            this._mediaPlayer.stop();
            this._mediaPlayer.reset();

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            assert(playerPlugin.JumpForward.notCalled);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testDeferredPauseDoesNotPersistAfterReset = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            this._mediaPlayer.pause();

            playerPlugin.Pause.returns(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.Pause.calledOnce);

            this._mediaPlayer.stop();
            this._mediaPlayer.reset();

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            assert(playerPlugin.Pause.calledOnce);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testMediaUrlGetsSpecialHlsFragmentAppended = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "test/url", "application/vnd.apple.mpegurl");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assert(playerPlugin.ResumePlay.calledWith("test/url|COMPONENT=HLS", 0));
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testMediaUrlGetsSpecialHlsFragmentAppendedWithXMpegUrl = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "test/url", "application/x-mpegURL");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assert(playerPlugin.ResumePlay.calledWith("test/url|COMPONENT=HLS", 0));
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testGetSourceDoesNotHaveSpecialHlsFragmentAppended = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "test/url", "application/vnd.apple.mpegurl");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assert(this._mediaPlayer.getSource().indexOf("|COMPONENT=HLS") === -1);
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testCallingStopFromStoppedStateDoesNotCallDeviceStop = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            playerPlugin.Stop.reset();

            this._mediaPlayer.stop();
            assert(playerPlugin.Stop.notCalled);
        });
    };



    // **** WARNING **** WARNING **** WARNING: These TODOs are NOT complete/exhaustive
    // TODO: Investigate if we should keep a reference to the original player plugin and restore on tear-down in the same way media/samsung_maple modifier
    // -- This appears to only be the tvmwPlugin - if we don't need it then we shouldn't modify it.
    // -- UPDATE: I haven't seen any ill effects on the 2013 FoxP from not using tvmwPlugin - needs further
    //    investigation on other devices.

    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all MediaPlayer implementations (last, so it can detect conflicts)
    window.commonTests.mediaPlayer.all.mixinTests(this.SamsungMapleMediaPlayerTests, "antie/devices/mediaplayer/samsung_maple", config, deviceMockingHooks);

})();
