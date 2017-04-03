/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.SamsungMaple2015MediaPlayerTests = AsyncTestCase('SamsungMapleMediaPlayer2015LiveSeek');

    var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/mediaplayer/samsung_maple_ls']}, 'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};
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
            playerPlugin.GetLiveDuration.returns(range.start + "|" + range.end);
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
    
    
//    for (var test in this.SamsungMapleMediaPlayerTests.prototype) {
//            this.SamsungMaple2015MediaPlayerTests.prototype[test] = this.SamsungMapleMediaPlayerTests.prototype[test];
//    }

    this.SamsungMaple2015MediaPlayerTests.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();    
    
        //Event handlers are not removed after last test from SamsungMapleMediaPlayerTests
        //Check if handler is undefined before running tests and remove if necessary
        for (var i = 0; i < listenerFunctions.length; i++){
            delete window[listenerFunctions[i]];
        }

        playerPlugin = {
            self: this,
            _range: {
                start: 0,
                end: 100
            },
            JumpBackward: this.sandbox.stub(),
            JumpForward: this.sandbox.stub(),
            Pause: this.sandbox.stub(),
            ResumePlay: this.sandbox.stub(),
            Play: this.sandbox.stub(),
            Resume: this.sandbox.stub(),
            Stop: this.sandbox.stub(),
            SetDisplayArea: this.sandbox.stub(),
            GetLiveDuration: this.sandbox.stub()
        };

        playerPlugin.Pause.returns(1);
        playerPlugin.JumpBackward.returns(1);
        playerPlugin.JumpForward.returns(1);

        var originalGetElementById = document.getElementById;
        this.sandbox.stub(document, 'getElementById', function(id) {
            switch(id) {
            case 'playerPlugin':
                return playerPlugin;
            default:
                return originalGetElementById.call(document, id);
            }
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    var runMediaPlayerTest = function (self, queue, action) {
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/samsung_maple_ls', 'antie/devices/mediaplayer/mediaplayer'],
                              function(application, MediaPlayerImpl, MediaPlayer) {
                                  self._device = application.getDevice();
                                  self.sandbox.stub(self._device, 'getScreenSize').returns(screenSize);
                                  self._errorLog = self.sandbox.stub(self._device.getLogger(), 'error');
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testSamsungMapleListenerFunctionsAddedDuringSetSource = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var i;
            var func;

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertUndefined('Expecting ' + func + ' to be undefined', window[func]);
            }

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertFunction('Expecting ' + func + ' to be a function', window[func]);
            }
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testSamsungMapleListenerFunctionsRemovedOnTransitionToErrorState = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var i;
            var func;

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertFunction('Expecting ' + func + ' to be a function', window[func]);
            }

            try {
                this._mediaPlayer.pause();
            } catch (e) {}

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertUndefined('Expecting ' + func + ' to be undefined', window[func]);
            }
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testSamsungMapleListenerFunctionsRemovedOnReset = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var i;
            var func;

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertFunction('Expecting ' + func + ' to be a function', window[func]);
            }

            this._mediaPlayer.reset();

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertUndefined('Expecting ' + func + ' to be undefined', window[func]);
            }
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testSamsungMapleListenerFunctionsReferencedOnObjectDuringSetSource = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var i;
            var func;
            var hook;

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring('SamsungMaple'.length);
                assertUndefined(playerPlugin[hook]);
            }

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring('SamsungMaple'.length);
                assertEquals(func, playerPlugin[hook]);
            }
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testSamsungMapleListenerFunctionReferencesOnObjectRemovedOnTransiitonToErrorState = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var i;
            var func;
            var hook;

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring('SamsungMaple'.length);
                assertEquals(func, playerPlugin[hook]);
            }

            try {
                this._mediaPlayer.pause();
            } catch (e) {}

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring('SamsungMaple'.length);
                assertUndefined(playerPlugin[hook]);
            }

        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testSamsungMapleListenerFunctionReferencesOnObjectRemovedOnReset = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var i;
            var func;
            var hook;

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring('SamsungMaple'.length);
                assertEquals(func, playerPlugin[hook]);
            }

            this._mediaPlayer.reset();

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring('SamsungMaple'.length);
                assertUndefined(playerPlugin[hook]);
            }

        });
    };
    
    /*HLS live specific tests START*/
    this.SamsungMaple2015MediaPlayerTests.prototype.testHlsGetLiveDurationCalledForHlsLive = function (queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlayback();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);
            
            assert(playerPlugin.Play.calledOnce);
            assert(playerPlugin.GetLiveDuration.calledOnce);
        });
    };
    
    this.SamsungMaple2015MediaPlayerTests.prototype.testHlsGetLiveDurationUpdateCalledBeforeJumpForward = function (queue) {
        expectAsserts(6);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);
            this._mediaPlayer._updatingTime = false;
            
            assert(playerPlugin.ResumePlay.calledOnce);
            assert(playerPlugin.GetLiveDuration.calledOnce);
            
            playerPlugin._range = {
                start: 24,
                end: 124
            };
            window.SamsungMapleOnCurrentPlayTime(22 * 1000);
            
            assert(playerPlugin.JumpForward.notCalled);
            this._mediaPlayer.playFrom(50);
            assertEquals(this._mediaPlayer_range, playerPlugin.GetLiveDuration.args[1][0]);
            assert(playerPlugin.GetLiveDuration.calledTwice);
            assert(playerPlugin.JumpForward.calledOnce);
        });
    };
    
    this.SamsungMaple2015MediaPlayerTests.prototype.testHlsGetLiveDurationUpdateCalledBeforeJumpBackward = function (queue) {
        expectAsserts(6);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlayback();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 100, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(90 * 1000);
            this._mediaPlayer._updatingTime = false;
            
            assert(playerPlugin.Play.calledOnce);
            assert(playerPlugin.GetLiveDuration.calledOnce);
            
            playerPlugin._range = {
                start: 24,
                end: 124
            };
            window.SamsungMapleOnCurrentPlayTime(122 * 1000);
            
            assert(playerPlugin.JumpBackward.notCalled);
            this._mediaPlayer.playFrom(10);
            assertEquals(this._mediaPlayer_range, playerPlugin.GetLiveDuration.args[1][0]);
            assert(playerPlugin.GetLiveDuration.calledTwice);
            assert(playerPlugin.JumpBackward.calledOnce);
        });
    };
    
    this.SamsungMaple2015MediaPlayerTests.prototype.testHlsGetLiveDurationUpdateNotCalledWhileInRangeTolerance = function (queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Play.notCalled);
            this._mediaPlayer.setSource(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlayback();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 100, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(100 * 1000);
            
            assert(playerPlugin.Play.calledOnce);
            
            this._mediaPlayer.playFrom(10);
            assert(playerPlugin.GetLiveDuration.calledOnce);
            
            this._mediaPlayer._updatingTime = false;
            this._mediaPlayer.playFrom(20);
            assert(playerPlugin.GetLiveDuration.calledTwice);
        });
    };
    
    this.SamsungMaple2015MediaPlayerTests.prototype.testHlsGetLiveDurationUpdateOnCurrentTimeGreaterThanEndRangeTolerance = function (queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlayback();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 100, { start: 0, end: 100 });
            window.SamsungMapleOnCurrentPlayTime(100 * 1000);
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            
            assert(playerPlugin.GetLiveDuration.calledOnce);
            this._mediaPlayer._updatingTime = false;
            
            this._mediaPlayer._range = {
                start: 24,
                end: 124
            };
            window.SamsungMapleOnCurrentPlayTime(133 * 1000);
            
            assertEquals(this._mediaPlayer_range, playerPlugin.GetLiveDuration.args[1][0]);
            assert(playerPlugin.GetLiveDuration.calledTwice);
        });
    };
    
    this.SamsungMaple2015MediaPlayerTests.prototype.testHlsGetLiveDurationUpdateOnCurrentTimeLowerThanStartRangeTolerance = function (queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(this._mediaPlayer.CLAMP_OFFSET_FROM_END_OF_RANGE * 1000);
            
            assert(playerPlugin.GetLiveDuration.calledOnce);
            this._mediaPlayer._updatingTime = false;
            
            this._mediaPlayer._range = {
                start: 24,
                end: 124
            };
            window.SamsungMapleOnCurrentPlayTime(15 * 1000);
            
            assertEquals(this._mediaPlayer_range, playerPlugin.GetLiveDuration.args[1][0]);
            assert(playerPlugin.GetLiveDuration.calledTwice);
        });
    };
    /*HLS live specific tests END*/

    this.SamsungMaple2015MediaPlayerTests.prototype.testResumePlayCalledOnDeviceWhenBeginPlaybackFromCalledInStoppedState = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assert(playerPlugin.ResumePlay.notCalled);
            this._mediaPlayer.beginPlaybackFrom(0);
            assert(playerPlugin.ResumePlay.calledWith('testURL', 0));
            assert(playerPlugin.ResumePlay.calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayCalledOnDeviceWhenBeginPlaybackCalledInStoppedState = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assert(playerPlugin.Play.notCalled);
            this._mediaPlayer.beginPlayback();
            assert(playerPlugin.Play.calledWith('testURL'));
            assert(playerPlugin.Play.calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testBeginPlaybackFromSetsCurrentTimeAndCallsPlayOnMediaElementWhenInStoppedState = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            this._mediaPlayer.beginPlaybackFrom(10);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(10000);

            assert(playerPlugin.ResumePlay.calledOnce);
            assert(playerPlugin.ResumePlay.calledWith('testURL', 10));
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testResumePlayCalledWithTimePassedIntoBeginPlaybackFrom = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assert(playerPlugin.ResumePlay.notCalled);
            this._mediaPlayer.beginPlaybackFrom(19);
            assert(playerPlugin.ResumePlay.calledWith('testURL', 19));
            assert(playerPlugin.ResumePlay.calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromWhileBufferingDefersJumpUntilPlaying = function(queue) {
        // Samsung advice to block seeking while buffering:
        // http://www.samsungdforum.com/Guide/tec00118/index.html
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testJumpOnDeviceWhenPlayFromCalledInInitialBufferingState = function(queue) {
        expectAsserts(7);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testNoSecondBufferingEventWhenPlayingFromABufferingState = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            this._mediaPlayer.beginPlaybackFrom(0);
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
    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromCurrentTimeInPlayingStateBuffersThenPlays = function(queue) {
        var initialTimeMs = 30000;
        var targetTimeSecs = 30;
        doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromNearAfterCurrentTimeInPlayingStateBuffersThenPlays = function(queue) {
        var initialTimeMs = 30000;
        var targetTimeSecs = 32.5;
        doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromNearBeforeCurrentTimeInPlayingStateBuffersThenPlays = function(queue) {
        var initialTimeMs = 30000;
        var targetTimeSecs = 27.500;
        doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    var doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays = function(self, queue, initialTimeMs, targetTimeSecs) {
        expectAsserts(3);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            self._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromDifferentTimeWhenPlayingBuffersAndSeeks = function(queue) {
        expectAsserts(8);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromEarlierTimeWhenPlayingBuffersAndSeeks = function(queue) {
        expectAsserts(9);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(50);
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
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            self._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromCurrentTimeWhenPausedBuffersThenPlays = function(queue) {
        var initialTimeMs = 50000;
        var targetTimeSecs = 50;
        doTestPlayFromNearCurrentTimeWhenPausedBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromNearAfterCurrentTimeWhenPausedBuffersThenPlays = function(queue) {
        var initialTimeMs = 50000;
        var targetTimeSecs = 52.5;
        doTestPlayFromNearCurrentTimeWhenPausedBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromNearBeforeCurrentTimeWhenPausedBuffersThenPlays = function(queue) {
        var initialTimeMs = 50000;
        var targetTimeSecs = 47.5;
        doTestPlayFromNearCurrentTimeWhenPausedBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromDifferentTimeWhenPausedBuffersAndSeeks = function(queue) {
        expectAsserts(8);
        var self = this;
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            self._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromDifferentTimeWhenPausedResumesAfterJump = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromEarlierTimeWhenPausedBuffersAndSeeks = function(queue) {
        expectAsserts(9);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(50);
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



    this.SamsungMaple2015MediaPlayerTests.prototype.testResumeWhenPausedCallsResume = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            this._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());

            assert(playerPlugin.Resume.notCalled);

            this._mediaPlayer.resume();

            assert(playerPlugin.Resume.calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPauseCallsPauseWhenPlaying = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.Pause.notCalled);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());

            this._mediaPlayer.pause();

            assert(playerPlugin.Pause.calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testStopCallsStopWhenPlaying = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.Stop.notCalled);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());

            this._mediaPlayer.stop();

            assert(playerPlugin.Stop.calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testMediaStoppedOnTransitionToErrorState = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.Stop.notCalled);

            try {
                this._mediaPlayer.beginPlayback();
            } catch (e) {}

            assert(playerPlugin.Stop.calledOnce);
        });
    };

    function assert_x3_matchErrorEvent(eventHandler, expectedErrorType, expectedErrorMessage) {
        var actualEventArgs = eventHandler.args[0][0];

        assert(eventHandler.calledOnce);
        assertEquals(expectedErrorType, actualEventArgs.type);
        assertEquals(expectedErrorMessage, actualEventArgs.errorMessage);
    }

    this.SamsungMaple2015MediaPlayerTests.prototype.testOnRenderErrorCausesErrorEvent = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            window.SamsungMapleOnRenderError();

            var expectedError = 'Media element emitted OnRenderError';
            assert_x3_matchErrorEvent(eventHandler, MediaPlayer.EVENT.ERROR, expectedError);

            assert(this._errorLog.withArgs(expectedError).calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testOnConnectionFailedCausesErrorEvent = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            window.SamsungMapleOnConnectionFailed();

            var expectedError = 'Media element emitted OnConnectionFailed';
            assert_x3_matchErrorEvent(eventHandler, MediaPlayer.EVENT.ERROR, expectedError);

            assert(this._errorLog.withArgs(expectedError).calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testOnNetworkDisconnectedCausesErrorEvent = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            window.SamsungMapleOnNetworkDisconnected();

            var expectedError = 'Media element emitted OnNetworkDisconnected';
            assert_x3_matchErrorEvent(eventHandler, MediaPlayer.EVENT.ERROR, expectedError);

            assert(this._errorLog.withArgs(expectedError).calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testOnStreamNotFoundCausesErrorEvent = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            window.SamsungMapleOnStreamNotFound();

            var expectedError = 'Media element emitted OnStreamNotFound';
            assert_x3_matchErrorEvent(eventHandler, MediaPlayer.EVENT.ERROR, expectedError);

            assert(this._errorLog.withArgs(expectedError).calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testOnAuthenticationFailedCausesErrorEvent = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            window.SamsungMapleOnAuthenticationFailed();

            var expectedError = 'Media element emitted OnAuthenticationFailed';
            assert_x3_matchErrorEvent(eventHandler, MediaPlayer.EVENT.ERROR, expectedError);

            assert(this._errorLog.withArgs(expectedError).calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstPlayingClampsToJustBeforeEnd = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            assert(playerPlugin.JumpForward.notCalled);

            this._mediaPlayer.playFrom(100);

            assert(playerPlugin.JumpForward.calledOnce);
            assert(playerPlugin.JumpForward.calledWith(58.9));
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstMidStreamBufferingClampsToJustBeforeEnd = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstInitialBufferingClampsToJustBeforeEnd = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);

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

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstPausedClampsToJustBeforeEnd = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstCompleteClampsToJustBeforeEnd = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);
            this._mediaPlayer.playFrom(100);

            assert(playerPlugin.ResumePlay.calledTwice);
            assertEquals(58.9, playerPlugin.ResumePlay.args[1][1]);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromAfterMediaCompletedCallsStopBeforeResumePlay = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromWhileAtNonZeroTimeGCausesRelativeJump = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testStatusMessageIncludesUpdatedTime = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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


    this.SamsungMaple2015MediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInPausedStateWhenDeviceIsAbleToPauseAfterBuffering = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            this._mediaPlayer.pause();

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assert(playerPlugin.Pause.calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsRemainsInBufferingStateWhenDeviceIsUnableToPauseAfterBuffering = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            this._mediaPlayer.pause();

            playerPlugin.Pause.returns(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFailsReturningZero = function(queue) {
        var pauseReturnCode = 0;
        doTestPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFails(this, queue, pauseReturnCode);
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFailsReturningMinusOne = function(queue) {
        var pauseReturnCode = -1;
        doTestPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFails(this, queue, pauseReturnCode);
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFailsReturningFalse = function(queue) {
        var pauseReturnCode = false;
        doTestPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFails(this, queue, pauseReturnCode);
    };

    var doTestPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFails = function(self, queue, pauseReturnCode) {
        expectAsserts(2);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            self._mediaPlayer.beginPlaybackFrom(0);
            self._mediaPlayer.pause();

            playerPlugin.Pause.returns(pauseReturnCode);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assert(playerPlugin.Pause.calledOnce);

            deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
            assert(playerPlugin.Pause.calledTwice);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsThenResumingWhileAttemptingToPauseResultsInPlayingState = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInPausedStateWhenPausedAfterMultipleAttempts = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testStatusEventsOnlyEmittedInPlayingState = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            this._mediaPlayer.pause();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            var callback = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, callback);

            window.SamsungMapleOnCurrentPlayTime(10000);

            assert(callback.notCalled);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromWhilePlayingBeforeFirstStatusEventDefersJumpAndJumpsByCorrectAmount = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(30);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromWhilePausedBeforeFirstStatusEventDefersJumpAndJumpsByCorrectAmount = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(30);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testMediaPlayerIsStoppedOnAppHide = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var addStub = this.sandbox.stub(window, 'addEventListener');

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlayback();

            var filtered = addStub.withArgs('hide', sinon.match.func, false);
            assert(filtered.calledOnce);
            var addedCallback = filtered.args[0][1];

            assert(playerPlugin.Stop.notCalled);

            addedCallback(new CustomEvent('hide') );

            assert(playerPlugin.Stop.calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testWindowHideEventListenerIsTornDownOnReset = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var addStub = this.sandbox.stub(window, 'addEventListener');
            var removeStub = this.sandbox.stub(window, 'removeEventListener');

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');

            var filteredAdd = addStub.withArgs('hide', sinon.match.func, false);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testMediaPlayerIsStoppedOnAppUnload = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var addStub = this.sandbox.stub(window, 'addEventListener');

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlayback();

            var filtered = addStub.withArgs('unload', sinon.match.func, false);
            assert(filtered.calledOnce);
            var addedCallback = filtered.args[0][1];

            assert(playerPlugin.Stop.notCalled);

            addedCallback(new CustomEvent('unload'));

            assert(playerPlugin.Stop.calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testWindowUnloadEventListenerIsTornDownOnReset = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var addStub = this.sandbox.stub(window, 'addEventListener');
            var removeStub = this.sandbox.stub(window, 'removeEventListener');

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');

            var filteredAdd = addStub.withArgs('unload', sinon.match.func, false);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testCurrentTimeIsUpdatedByOnCurrentPlayTimeEvents = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testFailedJumpReturningZeroWhilePlayingReturnsToPlayingState = function(queue) {
        var jumpReturnCode = 0;
        doTestFailedJumpWhilePlayingReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testFailedJumpReturningMinusOneWhilePlayingReturnsToPlayingState = function(queue) {
        var jumpReturnCode = -1;
        doTestFailedJumpWhilePlayingReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testFailedJumpReturningFalseWhilePlayingReturnsToPlayingState = function(queue) {
        var jumpReturnCode = false;
        doTestFailedJumpWhilePlayingReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    var doTestFailedJumpWhilePlayingReturnsToPlayingState = function(self, queue, jumpReturnCode) {
        expectAsserts(5);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            self._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testFailedJumpReturningZeroWhilePausedGoesToPlayingState = function(queue) {
        var jumpReturnCode = 0;
        doTestFailedJumpWhilePausedReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testFailedJumpReturningMinusOneWhilePausedGoesToPlayingState = function(queue) {
        var jumpReturnCode = -1;
        doTestFailedJumpWhilePausedReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testFailedJumpReturningFalseWhilePausedGoesToPlayingState = function(queue) {
        var jumpReturnCode = false;
        doTestFailedJumpWhilePausedReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    var doTestFailedJumpWhilePausedReturnsToPlayingState = function(self, queue, jumpReturnCode) {
        expectAsserts(5);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            self._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testFailedDeferredJumpRemainsInBufferingState = function(queue) {
        expectAsserts(5);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testFailedDeferredJumpResultsInRepeatedAttemptsToJumpUntilSuccess = function(queue) {
        expectAsserts(8);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testDeferredJumpsDoNotReenterBufferingState = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testDeferredSeekIsCancelledWhenTargetIsCurrentTime = function(queue) {
        var targetTime = 30;
        doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime(this, queue, targetTime);
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testDeferredSeekIsCancelledWhenTargetIsNearAfterCurrentTime = function(queue) {
        var targetTime = 32.5;
        doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime(this, queue, targetTime);
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testDeferredSeekIsCancelledWhenTargetIsNearBeforeCurrentTime = function(queue) {
        var targetTime = 27.5;
        doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime(this, queue, targetTime);
    };

    var doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime = function(self, queue, targetTime) {
        expectAsserts(4);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            self._mediaPlayer.beginPlaybackFrom(30);

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

    this.SamsungMaple2015MediaPlayerTests.prototype.testDisplayAreaSetOnPlayFromForVideo = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            screenSize.width = 987;
            screenSize.height = 654;

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assert(playerPlugin.SetDisplayArea.notCalled);
            this._mediaPlayer.beginPlaybackFrom(0);
            assert(playerPlugin.SetDisplayArea.calledWith(0, 0, 987, 654));
            assert(playerPlugin.SetDisplayArea.calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testDisplayAreaSetOnPlayFromForVideoWhenCalledAfterMediaCompleted = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            screenSize.width = 987;
            screenSize.height = 654;

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            this._mediaPlayer.beginPlaybackFrom(0);

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

    this.SamsungMaple2015MediaPlayerTests.prototype.testDisplayAreaNotSetOnPlayFromForAudioWhenCalledAfterMediaCompleted = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.AUDIO, 'testURL', 'audio/mp4');
            this._mediaPlayer.beginPlaybackFrom(0);

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);
            playerPlugin.SetDisplayArea.reset();

            this._mediaPlayer.playFrom(0);

            assert(playerPlugin.SetDisplayArea.notCalled);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testPlayFromAndPauseBeforeMetaDataLoadsResultsInSeekFirstThenPauseWithCurrentTime = function(queue) {
        expectAsserts(5);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
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

    this.SamsungMaple2015MediaPlayerTests.prototype.testDeferredSeekDoesNotPersistAfterReset = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            this._mediaPlayer.playFrom(50);

            this._mediaPlayer.stop();
            this._mediaPlayer.reset();

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            assert(playerPlugin.JumpForward.notCalled);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testDeferredPauseDoesNotPersistAfterReset = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            this._mediaPlayer.pause();

            playerPlugin.Pause.returns(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin.Pause.calledOnce);

            this._mediaPlayer.stop();
            this._mediaPlayer.reset();

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            window.SamsungMapleOnCurrentPlayTime(0);

            assert(playerPlugin.Pause.calledOnce);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testMediaUrlGetsSpecialHlsFragmentAppended = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'test/url', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assert(playerPlugin.ResumePlay.calledWith('test/url|COMPONENT=HLS', 0));
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testMediaUrlGetsSpecialHlsFragmentAppendedWithXMpegUrl = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'test/url', 'application/x-mpegURL');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assert(playerPlugin.ResumePlay.calledWith('test/url|COMPONENT=HLS', 0));
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testGetSourceDoesNotHaveSpecialHlsFragmentAppended = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'test/url', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assert(this._mediaPlayer.getSource().indexOf('|COMPONENT=HLS') === -1);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testCallingStopFromStoppedStateDoesNotCallDeviceStop = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            playerPlugin.Stop.reset();

            this._mediaPlayer.stop();
            assert(playerPlugin.Stop.notCalled);
        });
    };

    this.SamsungMaple2015MediaPlayerTests.prototype.testGetPlayerElement = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assertEquals(playerPlugin, this._mediaPlayer.getPlayerElement());
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
    window.commonTests.mediaPlayer.all.mixinTests(this.SamsungMaple2015MediaPlayerTests, 'antie/devices/mediaplayer/samsung_maple_ls', config, deviceMockingHooks);

})();
