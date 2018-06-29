/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.SamsungStreamingMediaPlayerTests = AsyncTestCase('SamsungStreamingMediaPlayer');

    var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/mediaplayer/samsung_streaming']}, 'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};
    var screenSize = {};
    var playerPlugin = null;

    // Setup device specific mocking
    var deviceMockingHooks = {
        setup: function(/*sandbox, application*/) {

            // Override StartPlayback to update the time for the common tests only - although the Samsung specific tests
            // do use these mocking hooks, they do not call setup.
            playerPlugin._methods.StartPlayback = function (seconds) {
                this.parent._methods.GetDuration = function () {
                    return this.parent._range.end * 1000;
                };
                this.parent.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, seconds * 1000);
            };
        },
        sendMetadata: function(mediaPlayer, currentTime, range) {
            if (range !== undefined) {
                playerPlugin._range = range;
            }
            if (playerPlugin.OnEvent) {
                playerPlugin.OnEvent(listenerEventCodes.STREAM_INFO_READY);
            }
        },
        finishBuffering: function(/*mediaPlayer*/) {
            if (playerPlugin.OnEvent) {
                playerPlugin.OnEvent(listenerEventCodes.BUFFERING_COMPLETE);
            }
        },
        emitPlaybackError: function(/*mediaPlayer*/) {
            playerPlugin.OnEvent(listenerEventCodes.RENDER_ERROR);
        },
        reachEndOfMedia: function(mediaPlayer) {
            if (playerPlugin.OnEvent) {
                playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, mediaPlayer.getSeekableRange().end * 1000);
                playerPlugin.OnEvent(listenerEventCodes.RENDERING_COMPLETE);
            }
        },
        startBuffering: function(/*mediaPlayer*/) {
            playerPlugin.OnEvent(listenerEventCodes.BUFFERING_START);
            playerPlugin.OnEvent(listenerEventCodes.BUFFERING_PROGRESS);
        },
        mockTime: function(/*mediaplayer*/) {
        },
        makeOneSecondPass: function(mediaplayer) {
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, (mediaplayer.getCurrentTime() + 1) * 1000);
        },
        unmockTime: function(/*mediaplayer*/) {
        }
    };

    this.SamsungStreamingMediaPlayerTests.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();

        playerPlugin = {
            self: this,
            _range: {
                start: 0,
                end: 100
            },
            init : function() {
                this._methods.parent = this;
                delete this.init;
                return this;
            },
            Open: this.sandbox.stub(),
            Execute: function(command) {
                switch (command) {
                case 'InitPlayer':
                    return this._methods.InitPlayer(arguments[1]);
                case 'StartPlayback':
                    return this._methods.StartPlayback(arguments[1]);
                case 'JumpForward':
                    return this._methods.JumpForward(arguments[1]);
                case 'JumpBackward':
                    return this._methods.JumpBackward(arguments[1]);
                case 'Pause':
                    return this._methods.Pause();
                case 'Resume':
                    return this._methods.Resume();
                case 'Stop':
                    return this._methods.Stop();
                case 'GetDuration':
                    return this._methods.GetDuration();
                case 'GetPlayingRange':
                    return this._methods.GetPlayingRange();
                default:
                    return -1;
                }
            },
            Close: this.sandbox.stub(),
            OnEvent: undefined,
            _methods: {
                InitPlayer: this.sandbox.stub(),
                StartPlayback: this.sandbox.stub(),
                JumpForward: this.sandbox.stub(),
                JumpBackward: this.sandbox.stub(),
                Pause: this.sandbox.stub(),
                Resume: this.sandbox.stub(),
                Stop: this.sandbox.stub(),
                GetPlayingRange: this.sandbox.stub(),
                GetDuration: this.sandbox.stub()
            }
        }.init();

        playerPlugin.Open.returns(1);
        playerPlugin.Close.returns(1);
        playerPlugin._methods.InitPlayer.returns(1);
        playerPlugin._methods.StartPlayback.returns(1);
        playerPlugin._methods.JumpForward.returns(1);
        playerPlugin._methods.JumpBackward.returns(1);
        playerPlugin._methods.Pause.returns(1);
        playerPlugin._methods.Resume.returns(1);
        playerPlugin._methods.Stop.returns(1);
        playerPlugin._methods.GetPlayingRange.returns(playerPlugin._range.start + '-' + playerPlugin._range.end);
        playerPlugin._methods.GetDuration.returns(playerPlugin._range.end * 1000);

        var originalGetElementById = document.getElementById;
        this.sandbox.stub(document, 'getElementById', function(id) {
            switch(id) {
            case 'sefPlayer':
                return playerPlugin;
            default:
                return originalGetElementById.call(document, id);
            }
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    var runMediaPlayerTest = function (self, queue, action) {
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/samsung_streaming', 'antie/devices/mediaplayer/mediaplayer'],
                              function(application, MediaPlayerImpl, MediaPlayer) {
                                  self._device = application.getDevice();
                                  self.sandbox.stub(self._device, 'getScreenSize').returns(screenSize);
                                  self._errorLog = self.sandbox.stub(self._device.getLogger(), 'error');
                                  self._mediaPlayer = self._device.getMediaPlayer();

                                  action.call(self, MediaPlayer);
                              }, config);
    };

    //---------------------
    // Samsung Streaming specific tests
    //---------------------

    var listenerEventCodes = {
        CONNECTION_FAILED : 1,
        AUTHENTICATION_FAILED : 2,
        STREAM_NOT_FOUND : 3,
        NETWORK_DISCONNECTED : 4,
        RENDER_ERROR : 6,
        RENDERING_START : 7,
        RENDERING_COMPLETE : 8,
        STREAM_INFO_READY : 9,
        DECODING_COMPLETE : 10,
        BUFFERING_START : 11,
        BUFFERING_COMPLETE : 12,
        BUFFERING_PROGRESS : 13,
        CURRENT_PLAYBACK_TIME : 14
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testSamsungMapleListenerFunctionsAddedDuringInitialiseMedia = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            assertUndefined('Expecting playerPlaugin.OnEvent to be undefined', playerPlugin.OnEvent);

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            assertFunction('Expecting playerPlaugin.OnEvent to be function', playerPlugin.OnEvent);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testSamsungMapleListenerFunctionsRemovedOnTransitionToErrorState = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            assertFunction('Expecting playerPlaugin.OnEvent to be function', playerPlugin.OnEvent);

            try {
                this._mediaPlayer.pause();
            } catch (e) {}

            assertUndefined('Expecting playerPlaugin.OnEvent to be undefined', playerPlugin.OnEvent);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testSamsungMapleListenerFunctionsRemovedOnReset = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            assertFunction('Expecting playerPlaugin.OnEvent to be function', playerPlugin.OnEvent);

            this._mediaPlayer.reset();

            assertUndefined('Expecting playerPlaugin.OnEvent to be undefined', playerPlugin.OnEvent);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testSamsungMapleListenerFunctionsReferencedOnObjectDuringInitialiseMedia = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            assertUndefined(playerPlugin['OnEvent']);

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            assertFunction(playerPlugin['OnEvent']);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testSamsungMapleListenerFunctionReferencesOnObjectRemovedOnTransiitonToErrorState = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            assertFunction(playerPlugin['OnEvent']);

            try {
                this._mediaPlayer.pause();
            } catch (e) {}

            assertUndefined(playerPlugin['OnEvent']);

        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testSamsungMapleListenerFunctionReferencesOnObjectRemovedOnReset = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            assertFunction(playerPlugin['OnEvent']);

            this._mediaPlayer.reset();

            assertUndefined(playerPlugin['OnEvent']);

        });
    };


    /*HLS specific tests START*/
    this.SamsungStreamingMediaPlayerTests.prototype.testPlayerOpenPluginThenHlsStartPlaybackCalledOnDeviceWhenBeginPlaybackFromCalledInStoppedState = function(queue) {
        expectAsserts(9);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            assert(playerPlugin.Open.calledWith('StreamingPlayer', '1.0', 'StreamingPlayer'));
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL|COMPONENT=HLS'));
            assert(playerPlugin._methods.InitPlayer.calledOnce);

            assert(playerPlugin._methods.StartPlayback.notCalled);
            this._mediaPlayer.beginPlaybackFrom(0);
            assert(playerPlugin._methods.StartPlayback.calledWith(0));
            assert(playerPlugin._methods.StartPlayback.calledOnce);
        });
    };
    this.SamsungStreamingMediaPlayerTests.prototype.testPlayerOpenPluginThenHlsPlayCalledOnDeviceWhenBeginPlaybackFromCalledInStoppedState = function(queue) {
        expectAsserts(8);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            assert(playerPlugin.Open.calledWith('StreamingPlayer', '1.0', 'StreamingPlayer'));
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL|COMPONENT=HLS'));
            assert(playerPlugin._methods.InitPlayer.calledOnce);

            assert(playerPlugin._methods.StartPlayback.notCalled);
            this._mediaPlayer.beginPlayback();
            assert(playerPlugin._methods.StartPlayback.calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testStreamingPLayerOpenPluginThenHlsLiveStartPlaybackCalledOnDeviceWhenBeginPlaybackFromCalledInStoppedState = function(queue) {
        expectAsserts(8);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            assert(playerPlugin.Open.calledWith('StreamingPlayer', '1.0', 'StreamingPlayer'));
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL|HLSSLIDING|COMPONENT=HLS'));
            assert(playerPlugin._methods.InitPlayer.calledOnce);

            assert(playerPlugin._methods.StartPlayback.notCalled);
            this._mediaPlayer.beginPlaybackFrom(0);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
        });
    };
    this.SamsungStreamingMediaPlayerTests.prototype.testStreamingPLayerOpenPluginThenHlsLivePlayCalledOnDeviceWhenBeginPlaybackFromCalledInStoppedState = function(queue) {
        expectAsserts(8);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            assert(playerPlugin.Open.calledWith('StreamingPlayer', '1.0', 'StreamingPlayer'));
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL|HLSSLIDING|COMPONENT=HLS'));
            assert(playerPlugin._methods.InitPlayer.calledOnce);

            assert(playerPlugin._methods.StartPlayback.notCalled);
            this._mediaPlayer.beginPlayback();
            assert(playerPlugin._methods.StartPlayback.calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testHlsLiveStartPlaybackFromBeginingCalledOnDeviceWhenBeginPlaybackFromCalledInStoppedState = function(queue) {
        expectAsserts(9);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            assert(playerPlugin.Open.calledWith('StreamingPlayer', '1.0', 'StreamingPlayer'));
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL|HLSSLIDING|COMPONENT=HLS'));
            assert(playerPlugin._methods.InitPlayer.calledOnce);

            assert(playerPlugin._methods.StartPlayback.notCalled);
            this._mediaPlayer.beginPlaybackFrom(0);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            //live playback started from 0 position causes spoiler defect
            assertEquals(this._mediaPlayer.CLAMP_OFFSET_FROM_START_OF_RANGE, playerPlugin._methods.StartPlayback.args[0][0]);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testHlsLiveStartPlaybackFromNearStartUsesClampOffsetFromStartOfRange = function(queue) {
        expectAsserts(9);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            assert(playerPlugin.Open.calledWith('StreamingPlayer', '1.0', 'StreamingPlayer'));
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL|HLSSLIDING|COMPONENT=HLS'));
            assert(playerPlugin._methods.InitPlayer.calledOnce);

            assert(playerPlugin._methods.StartPlayback.notCalled);
            this._mediaPlayer.beginPlaybackFrom(0.1);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            //live playback started from 0 position causes spoiler defect
            assertEquals(this._mediaPlayer.CLAMP_OFFSET_FROM_START_OF_RANGE, playerPlugin._methods.StartPlayback.args[0][0]);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testHlsLiveResumePlayCalledWithTimePassedIntoBeginPlaybackFrom = function(queue) {
        expectAsserts(9);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            assert(playerPlugin.Open.calledWith('StreamingPlayer', '1.0', 'StreamingPlayer'));
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL|HLSSLIDING|COMPONENT=HLS'));
            assert(playerPlugin._methods.InitPlayer.calledOnce);

            assert(playerPlugin._methods.StartPlayback.notCalled);
            this._mediaPlayer.beginPlaybackFrom(19);
            assert(playerPlugin._methods.StartPlayback.calledWith(19));
            assert(playerPlugin._methods.StartPlayback.calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testHlsGetPlayingRangeUpdateCalledBeforeJumpForward = function (queue) {
        expectAsserts(8);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);
            playerPlugin._methods.GetPlayingRange.returns(playerPlugin._range.start + '-' + playerPlugin._range.end);
            this._mediaPlayer._updatingTime = false;

            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.GetPlayingRange.calledOnce);

            playerPlugin._range = {
                start: 24,
                end: 124
            };
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 22 * 1000);
            playerPlugin._methods.GetPlayingRange.returns(playerPlugin._range.start + '-' + playerPlugin._range.end);

            assert(playerPlugin._methods.JumpForward.notCalled);
            this._mediaPlayer.playFrom(50);
            assertEquals(this._mediaPlayer_range, playerPlugin._methods.GetPlayingRange.args[1][0]);
            assert(playerPlugin._methods.GetPlayingRange.calledTwice);
            assert(playerPlugin._methods.JumpForward.calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testHlsGetPlayingRangeUpdateCalledBeforeJumpBackward = function (queue) {
        expectAsserts(8);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlayback();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 100, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 90 * 1000);
            playerPlugin._methods.GetPlayingRange.returns(playerPlugin._range.start + '-' + playerPlugin._range.end);
            this._mediaPlayer._updatingTime = false;

            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.GetPlayingRange.calledOnce);

            playerPlugin._range = {
                start: 24,
                end: 124
            };
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 122 * 1000);
            playerPlugin._methods.GetPlayingRange.returns(playerPlugin._range.start + '-' + playerPlugin._range.end);

            assert(playerPlugin._methods.JumpBackward.notCalled);
            this._mediaPlayer.playFrom(10);
            assertEquals(this._mediaPlayer_range, playerPlugin._methods.GetPlayingRange.args[1][0]);
            assert(playerPlugin._methods.GetPlayingRange.calledTwice);
            assert(playerPlugin._methods.JumpBackward.calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testHlsGetPlayingRangeUpdateNotCalledWhileInRangeTolerance = function (queue) {
        expectAsserts(6);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlayback();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 100, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 100 * 1000);

            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.GetPlayingRange.calledOnce);

            this._mediaPlayer.playFrom(10);
            assert(playerPlugin._methods.GetPlayingRange.calledOnce);

            this._mediaPlayer._updatingTime = false;
            this._mediaPlayer.playFrom(20);
            assert(playerPlugin._methods.GetPlayingRange.calledTwice);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testHlsGetPlayingRangeUpdateOnCurrentTimeGreaterThanEndRangeTolerance = function (queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlayback();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 100, { start: 0, end: 100 });
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 100 * 1000);
            playerPlugin._methods.GetPlayingRange.returns(playerPlugin._range.start + '-' + playerPlugin._range.end);
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin._methods.GetPlayingRange.calledOnce);
            this._mediaPlayer._updatingTime = false;

            this._mediaPlayer._range = {
                start: 24,
                end: 124
            };
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 133 * 1000);
            playerPlugin._methods.GetPlayingRange.returns(playerPlugin._range.start + '-' + playerPlugin._range.end);

            assertEquals(this._mediaPlayer_range, playerPlugin._methods.GetPlayingRange.args[1][0]);
            assert(playerPlugin._methods.GetPlayingRange.calledTwice);
            assert(playerPlugin._methods.JumpBackward.notCalled);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testHlsGetPlayingRangeUpdateOnCurrentTimeLowerThanStartRangeTolerance = function (queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME,  this._mediaPlayer.CLAMP_OFFSET_FROM_END_OF_RANGE * 1000);
            playerPlugin._methods.GetPlayingRange.returns(playerPlugin._range.start + '-' + playerPlugin._range.end);

            assert(playerPlugin._methods.GetPlayingRange.calledOnce);
            this._mediaPlayer._updatingTime = false;

            this._mediaPlayer._range = {
                start: 24,
                end: 124
            };
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 15 * 1000);
            playerPlugin._methods.GetPlayingRange.returns(playerPlugin._range.start + '-' + playerPlugin._range.end);

            assertEquals(this._mediaPlayer_range, playerPlugin._methods.GetPlayingRange.args[1][0]);
            assert(playerPlugin._methods.GetPlayingRange.calledTwice);
            assert(playerPlugin._methods.JumpForward.notCalled);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testHlsVodGetDurationUsedInsteadOfGetPlayingRange = function (queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });

            assert(playerPlugin._methods.GetPlayingRange.notCalled);
            assert(playerPlugin._methods.GetDuration.calledOnce);
            assertEquals(100, this._mediaPlayer.getDuration());
        });
    };
    /*HLS specific tests END*/

    this.SamsungStreamingMediaPlayerTests.prototype.testinitialiseMediaInitPlayerFailsReturningZero = function(queue) {
        var initPlayerReturnCode = 0;
        doTestinitialiseMediaInitPlayerFailsStartPlybackNotCalled(this, queue, initPlayerReturnCode);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testinitialiseMediaInitPlayerFailsReturningMinusOne = function(queue) {
        var initPlayerReturnCode = -1;
        doTestinitialiseMediaInitPlayerFailsStartPlybackNotCalled(this, queue, initPlayerReturnCode);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testinitialiseMediaInitPlayerFailsReturningFalse = function(queue) {
        var initPlayerReturnCode = false;
        doTestinitialiseMediaInitPlayerFailsStartPlybackNotCalled(this, queue, initPlayerReturnCode);
    };

    var doTestinitialiseMediaInitPlayerFailsStartPlybackNotCalled = function(self, queue, initPlayerReturnCode) {
        expectAsserts(5);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);
            playerPlugin._methods.InitPlayer.returns(initPlayerReturnCode);

            try {
                self._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
                self._mediaPlayer.beginPlayback();
            } catch (e) {}

            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.notCalled);

            assert(eventHandler.calledTwice);
            assertEquals(MediaPlayer.EVENT.ERROR, eventHandler.args[1][0].type);
            assertEquals('Failed to initialize video: testUrl', eventHandler.args[1][0].errorMessage);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testStartPlaybackCalledOnDeviceWhenBeginPlaybackFromCalledInStoppedState = function(queue) {
        expectAsserts(9);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assert(playerPlugin.Open.calledWith('Player', '1.010', 'Player'));
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL'));
            assert(playerPlugin._methods.InitPlayer.calledOnce);

            assert(playerPlugin._methods.StartPlayback.notCalled);
            this._mediaPlayer.beginPlaybackFrom(0);
            assert(playerPlugin._methods.StartPlayback.calledWith(0));
            assert(playerPlugin._methods.StartPlayback.calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayCalledOnDeviceWhenBeginPlaybackCalledInStoppedState = function(queue) {
        expectAsserts(8);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assert(playerPlugin.Open.calledWith('Player', '1.010', 'Player'));
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL'));
            assert(playerPlugin._methods.InitPlayer.calledOnce);

            assert(playerPlugin._methods.StartPlayback.notCalled);
            this._mediaPlayer.beginPlayback();
            assert(playerPlugin._methods.StartPlayback.calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testBeginPlaybackFromSetsCurrentTimeAndCallsPlayOnMediaElementWhenInStoppedState = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            this._mediaPlayer.beginPlaybackFrom(10);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 19 * 1000);

            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL'));
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledWith(10));
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testResumePlayCalledWithTimePassedIntoBeginPlaybackFrom = function(queue) {
        expectAsserts(9);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assert(playerPlugin.Open.calledWith('Player', '1.010', 'Player'));
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL'));
            assert(playerPlugin._methods.InitPlayer.calledOnce);

            assert(playerPlugin._methods.StartPlayback.notCalled);
            this._mediaPlayer.beginPlaybackFrom(19);
            assert(playerPlugin._methods.StartPlayback.calledWith(19));
            assert(playerPlugin._methods.StartPlayback.calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromWhileBufferingDefersJumpUntilPlaying = function(queue) {
        // Samsung advice to block seeking while buffering:
        // http://www.samsungdforum.com/Guide/tec00118/index.html
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);

            deviceMockingHooks.startBuffering(this._mediaPlayer);

            this._mediaPlayer.playFrom(50);
            assert(playerPlugin._methods.JumpForward.notCalled);

            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            assert(playerPlugin._methods.JumpForward.calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testJumpOnDeviceWhenPlayFromCalledInInitialBufferingState = function(queue) {
        expectAsserts(10);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);

            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testUrl'));
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledWith(0));
            assert(playerPlugin._methods.JumpForward.notCalled);
            this._mediaPlayer.playFrom(50);

            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.JumpForward.notCalled);

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);

            assert(playerPlugin._methods.JumpForward.calledOnce);
            assert(playerPlugin._methods.JumpForward.calledWith(50));
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testNoSecondBufferingEventWhenPlayingFromABufferingState = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
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
    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromCurrentTimeInPlayingStateBuffersThenPlays = function(queue) {
        var initialTimeMs = 30000;
        var targetTimeSecs = 30;
        doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromNearAfterCurrentTimeInPlayingStateBuffersThenPlays = function(queue) {
        var initialTimeMs = 30000;
        var targetTimeSecs = 32.5;
        doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromNearBeforeCurrentTimeInPlayingStateBuffersThenPlays = function(queue) {
        var initialTimeMs = 30000;
        var targetTimeSecs = 27.500;
        doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    var doTestPlayFromNearCurrentTimeInPlayingStateBuffersThenPlays = function(self, queue, initialTimeMs, targetTimeSecs) {
        expectAsserts(3);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            self._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, initialTimeMs);

            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);

            self._mediaPlayer.playFrom(targetTimeSecs);
            assert(eventHandler.calledTwice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.args[1][0].type);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromDifferentTimeWhenPlayingBuffersAndSeeks = function(queue) {
        expectAsserts(10);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.JumpForward.notCalled);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            this._mediaPlayer.playFrom(50);
            assert(eventHandler.calledOnce);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);

            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.JumpForward.calledOnce);
            assert(playerPlugin._methods.JumpForward.calledWith(50));
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromEarlierTimeWhenPlayingBuffersAndSeeks = function(queue) {
        expectAsserts(11);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(50);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 50, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 50000);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.JumpBackward.notCalled);
            assertEquals(50, this._mediaPlayer.getCurrentTime());

            this._mediaPlayer.playFrom(20);

            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.JumpForward.notCalled);
            assert(playerPlugin._methods.JumpBackward.calledOnce);
            assert(playerPlugin._methods.JumpBackward.calledWith(30));
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromEarlierTimeWhenPlayingThenPlayFromWhileBufferingSeeksAndPlays = function(queue) {
        expectAsserts(14);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(50);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 50, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 50000);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.JumpBackward.notCalled);
            assertEquals(50, this._mediaPlayer.getCurrentTime());

            assert(playerPlugin._methods.JumpBackward.notCalled);
            this._mediaPlayer.playFrom(20);

            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            assert(playerPlugin._methods.JumpBackward.calledOnce);
            assert(playerPlugin._methods.JumpBackward.calledWith(30));

            this._mediaPlayer.playFrom(10);
            assert(playerPlugin._methods.JumpBackward.calledOnce);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 20000);
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin._methods.JumpBackward.calledTwice);
            assertEquals(10, playerPlugin._methods.JumpBackward.args[1][0]);

            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 10000);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
        });
    };

    var doTestPlayFromNearCurrentTimeWhenPausedBuffersThenPlays = function(self, queue, initialTimeMs, targetTimeSecs) {
        expectAsserts(5);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            self._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, initialTimeMs);
            self._mediaPlayer.pause();

            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);

            assert(playerPlugin._methods.Resume.notCalled);
            self._mediaPlayer.playFrom(targetTimeSecs);
            assert(playerPlugin._methods.Resume.calledOnce);
            assert(eventHandler.calledTwice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.args[1][0].type);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromCurrentTimeWhenPausedBuffersThenPlays = function(queue) {
        var initialTimeMs = 50000;
        var targetTimeSecs = 50;
        doTestPlayFromNearCurrentTimeWhenPausedBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromNearAfterCurrentTimeWhenPausedBuffersThenPlays = function(queue) {
        var initialTimeMs = 50000;
        var targetTimeSecs = 52.5;
        doTestPlayFromNearCurrentTimeWhenPausedBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromNearBeforeCurrentTimeWhenPausedBuffersThenPlays = function(queue) {
        var initialTimeMs = 50000;
        var targetTimeSecs = 47.5;
        doTestPlayFromNearCurrentTimeWhenPausedBuffersThenPlays(this, queue, initialTimeMs, targetTimeSecs);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromDifferentTimeWhenPausedBuffersAndSeeks = function(queue) {
        expectAsserts(10);
        var self = this;
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            self._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);
            self._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, self._mediaPlayer.getState());

            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.JumpForward.notCalled);

            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);

            self._mediaPlayer.playFrom(50);
            assert(eventHandler.calledOnce);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);

            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.JumpForward.calledOnce);
            assert(playerPlugin._methods.JumpForward.calledWith(50));
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromDifferentTimeWhenPausedResumesAfterJump = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);

            this._mediaPlayer.pause();
            assert(playerPlugin._methods.Resume.notCalled);

            this._mediaPlayer.playFrom(50);
            assert(playerPlugin._methods.Resume.calledOnce);
            // Call Resume() after JumpForward() to avoid a single frame being played before the jump (D8000).
            assert(playerPlugin._methods.Resume.calledAfter(playerPlugin._methods.JumpForward));
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromEarlierTimeWhenPausedBuffersAndSeeks = function(queue) {
        expectAsserts(11);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(50);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 50, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 50000);
            this._mediaPlayer.pause();

            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.JumpBackward.notCalled);
            assertEquals(50, this._mediaPlayer.getCurrentTime());

            this._mediaPlayer.playFrom(20);

            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.JumpForward.notCalled);
            assert(playerPlugin._methods.JumpBackward.calledOnce);
            assert(playerPlugin._methods.JumpBackward.calledWith(30));
        });
    };



    this.SamsungStreamingMediaPlayerTests.prototype.testResumeWhenPausedCallsResume = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            this._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());

            assert(playerPlugin._methods.Resume.notCalled);

            this._mediaPlayer.resume();

            assert(playerPlugin._methods.Resume.calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPauseCallsPauseWhenPlaying = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin._methods.Pause.notCalled);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());

            this._mediaPlayer.pause();

            assert(playerPlugin._methods.Pause.calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testStopCallsStopWhenPlaying = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin._methods.Stop.notCalled);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());

            this._mediaPlayer.stop();

            assert(playerPlugin._methods.Stop.calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testMediaStoppedOnTransitionToErrorState = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin._methods.Stop.notCalled);

            try {
                this._mediaPlayer.beginPlayback();
            } catch (e) {}

            assert(playerPlugin._methods.Stop.calledOnce);
        });
    };

    function assert_x3_matchErrorEvent(eventHandler, expectedErrorType, expectedErrorMessage) {
        var actualEventArgs = eventHandler.args[0][0];

        assert(eventHandler.calledOnce);
        assertEquals(expectedErrorType, actualEventArgs.type);
        assertEquals(expectedErrorMessage, actualEventArgs.errorMessage);
    }

    this.SamsungStreamingMediaPlayerTests.prototype.testOnRenderErrorCausesErrorEvent = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            playerPlugin.OnEvent(listenerEventCodes.RENDER_ERROR);

            var expectedError = 'Media element emitted OnRenderError';
            assert_x3_matchErrorEvent(eventHandler, MediaPlayer.EVENT.ERROR, expectedError);

            assert(this._errorLog.withArgs(expectedError).calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testOnConnectionFailedCausesErrorEvent = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            playerPlugin.OnEvent(listenerEventCodes.CONNECTION_FAILED);

            var expectedError = 'Media element emitted OnConnectionFailed';
            assert_x3_matchErrorEvent(eventHandler, MediaPlayer.EVENT.ERROR, expectedError);

            assert(this._errorLog.withArgs(expectedError).calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testOnNetworkDisconnectedCausesErrorEvent = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            playerPlugin.OnEvent(listenerEventCodes.NETWORK_DISCONNECTED);

            var expectedError = 'Media element emitted OnNetworkDisconnected';
            assert_x3_matchErrorEvent(eventHandler, MediaPlayer.EVENT.ERROR, expectedError);

            assert(this._errorLog.withArgs(expectedError).calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testOnStreamNotFoundCausesErrorEvent = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            playerPlugin.OnEvent(listenerEventCodes.STREAM_NOT_FOUND);

            var expectedError = 'Media element emitted OnStreamNotFound';
            assert_x3_matchErrorEvent(eventHandler, MediaPlayer.EVENT.ERROR, expectedError);

            assert(this._errorLog.withArgs(expectedError).calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testOnAuthenticationFailedCausesErrorEvent = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            playerPlugin.OnEvent(listenerEventCodes.AUTHENTICATION_FAILED);

            var expectedError = 'Media element emitted OnAuthenticationFailed';
            assert_x3_matchErrorEvent(eventHandler, MediaPlayer.EVENT.ERROR, expectedError);

            assert(this._errorLog.withArgs(expectedError).calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstPlayingClampsToJustBeforeEnd = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            playerPlugin._range = { start: 0, end: 60 };
            playerPlugin._methods.GetDuration.returns(playerPlugin._range.end * 1000);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);

            assert(playerPlugin._methods.JumpForward.notCalled);

            this._mediaPlayer.playFrom(100);

            assert(playerPlugin._methods.JumpForward.calledOnce);
            assert(playerPlugin._methods.JumpForward.calledWith(58.9));
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstMidStreamBufferingClampsToJustBeforeEnd = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            playerPlugin._range = { start: 0, end: 60 };
            playerPlugin._methods.GetDuration.returns(playerPlugin._range.end * 1000);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);
            deviceMockingHooks.startBuffering(this._mediaPlayer);

            assert(playerPlugin._methods.JumpForward.notCalled);

            this._mediaPlayer.playFrom(100);
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);

            assert(playerPlugin._methods.JumpForward.calledOnce);
            assertEquals(58.9, playerPlugin._methods.JumpForward.args[0][0]);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstInitialBufferingClampsToJustBeforeEnd = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);

            assert(playerPlugin._methods.JumpForward.notCalled);

            this._mediaPlayer.playFrom(100);

            assert(playerPlugin._methods.JumpForward.notCalled);

            playerPlugin._range = { start: 0, end: 60 };
            playerPlugin._methods.GetDuration.returns(playerPlugin._range.end * 1000);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);

            assert(playerPlugin._methods.JumpForward.calledOnce);
            assertEquals(58.9, playerPlugin._methods.JumpForward.args[0][0]);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstPausedClampsToJustBeforeEnd = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            playerPlugin._range = { start: 0, end: 60 };
            playerPlugin._methods.GetDuration.returns(playerPlugin._range.end * 1000);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);
            this._mediaPlayer.pause();

            assert(playerPlugin._methods.JumpForward.notCalled);

            this._mediaPlayer.playFrom(100);
            assert(playerPlugin._methods.JumpForward.calledOnce);
            assert(playerPlugin._methods.JumpForward.calledWith(58.9));
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromTimeGreaterThanDurationWhilstCompleteClampsToJustBeforeEnd = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            playerPlugin._range = { start: 0, end: 60 };
            playerPlugin._methods.GetDuration.returns(playerPlugin._range.end * 1000);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);
            this._mediaPlayer.playFrom(100);

            assert(playerPlugin._methods.Stop.called);
            assert(playerPlugin._methods.StartPlayback.calledTwice);
            assertEquals(58.9, playerPlugin._methods.StartPlayback.args[1][0]);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromAfterMediaCompletedCallsStopBeforeResumePlay = function(queue) {
        expectAsserts(5);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);

            assert(playerPlugin._methods.Stop.notCalled);
            playerPlugin._methods.InitPlayer.reset();
            playerPlugin._methods.StartPlayback.reset();

            this._mediaPlayer.playFrom(0);

            assert(playerPlugin._methods.Stop.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.Stop.calledBefore(playerPlugin._methods.InitPlayer));
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromWhileAtNonZeroTimeGCausesRelativeJump = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 10000);

            assertEquals(10, this._mediaPlayer.getCurrentTime());
            assert(playerPlugin._methods.JumpForward.notCalled);

            this._mediaPlayer.playFrom(30);

            assert(playerPlugin._methods.JumpForward.calledOnce);
            assert(playerPlugin._methods.JumpForward.calledWith(20));
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testStatusMessageIncludesUpdatedTime = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            var callback = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, callback);

            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 10000);

            assert(callback.calledOnce);
            assertEquals(10, callback.args[0][0].currentTime);

            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 20000);

            assert(callback.calledTwice);
            assertEquals(20, callback.args[1][0].currentTime);


        });
    };


    this.SamsungStreamingMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInPausedStateWhenDeviceIsAbleToPauseAfterBuffering = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            this._mediaPlayer.pause();

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assert(playerPlugin._methods.Pause.calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsRemainsInBufferingStateWhenDeviceIsUnableToPauseAfterBuffering = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            this._mediaPlayer.pause();

            playerPlugin._methods.Pause.returns(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFailsReturningZero = function(queue) {
        var pauseReturnCode = 0;
        doTestPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFails(this, queue, pauseReturnCode);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFailsReturningMinusOne = function(queue) {
        var pauseReturnCode = -1;
        doTestPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFails(this, queue, pauseReturnCode);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFailsReturningFalse = function(queue) {
        var pauseReturnCode = false;
        doTestPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFails(this, queue, pauseReturnCode);
    };

    var doTestPausingBeforeMetaDataLoadsResultsInSecondAttemptToPauseAfterBufferingWhenInitialPauseFails = function(self, queue, pauseReturnCode) {
        expectAsserts(2);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            self._mediaPlayer.beginPlaybackFrom(0);
            self._mediaPlayer.pause();

            playerPlugin._methods.Pause.returns(pauseReturnCode);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assert(playerPlugin._methods.Pause.calledOnce);

            deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
            assert(playerPlugin._methods.Pause.calledTwice);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsThenResumingWhileAttemptingToPauseResultsInPlayingState = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            this._mediaPlayer.pause();

            playerPlugin._methods.Pause.returns(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            this._mediaPlayer.resume();
            playerPlugin._methods.Pause.returns(1);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPausingBeforeMetaDataLoadsResultsInPausedStateWhenPausedAfterMultipleAttempts = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            this._mediaPlayer.pause();

            playerPlugin._methods.Pause.returns(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin._methods.Pause.calledOnce);

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            assert(playerPlugin._methods.Pause.calledTwice);

            playerPlugin._methods.Pause.returns(1);

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            assert(playerPlugin._methods.Pause.calledThrice);
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testStatusEventsOnlyEmittedInPlayingState = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            this._mediaPlayer.pause();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            var callback = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, callback);

            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 10000);

            assert(callback.notCalled);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromWhilePlayingBeforeFirstStatusEventDefersJumpAndJumpsByCorrectAmount = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(30);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin._methods.JumpForward.notCalled);
            this._mediaPlayer.playFrom(50);

            assert(playerPlugin._methods.JumpForward.notCalled);

            // Device may not start playback from exactly the position requested, e.g. it may go to a keyframe
            var positionCloseToRequestedPosition = 32000;
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, positionCloseToRequestedPosition);

            assert(playerPlugin._methods.JumpForward.calledOnce);
            assertEquals(18, playerPlugin._methods.JumpForward.args[0][0]);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromWhilePausedBeforeFirstStatusEventDefersJumpAndJumpsByCorrectAmount = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(30);
            this._mediaPlayer.pause();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin._methods.JumpForward.notCalled);

            this._mediaPlayer.playFrom(50);

            assert(playerPlugin._methods.JumpForward.notCalled);

            // Device may not start playback from exactly the position requested, e.g. it may go to a keyframe
            var positionCloseToRequestedPosition = 32000;
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, positionCloseToRequestedPosition);

            assert(playerPlugin._methods.JumpForward.calledOnce);
            assertEquals(18, playerPlugin._methods.JumpForward.args[0][0]);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testMediaPlayerIsStoppedOnAppHide = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var addStub = this.sandbox.stub(window, 'addEventListener');

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlayback();

            var filtered = addStub.withArgs('hide', sinon.match.func, false);
            assert(filtered.calledOnce);
            var addedCallback = filtered.args[0][1];

            assert(playerPlugin._methods.Stop.notCalled);

            addedCallback(new CustomEvent('hide') );

            assert(playerPlugin._methods.Stop.calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testMediaPlayerIsStoppedOnAppUnload = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var addStub = this.sandbox.stub(window, 'addEventListener');

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlayback();

            var filtered = addStub.withArgs('unload', sinon.match.func, false);
            assert(filtered.calledOnce);
            var addedCallback = filtered.args[0][1];

            assert(playerPlugin._methods.Stop.notCalled);

            addedCallback(new CustomEvent('unload'));

            assert(playerPlugin._methods.Stop.calledOnce);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testMediaPlayerIgnorePeriodicRenderingCompleteEventInCompleteState = function (queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlayback();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            assert(eventHandler.notCalled);
            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);
            assertEquals(MediaPlayer.EVENT.COMPLETE, eventHandler.args[1][0].type);
            assert(eventHandler.calledTwice);

            //if Stop() is not called after RENDERING_COMPLETE then player sends periodically BUFFERING_COMPLETE and RENDERING_COMPLETE
            //ignore BUFFERING_COMPLETE and RENDERING_COMPLETE if player is already in COMPLETE state
            playerPlugin.OnEvent(listenerEventCodes.BUFFERING_COMPLETE);
            playerPlugin.OnEvent(listenerEventCodes.RENDERING_COMPLETE);

            assert(eventHandler.calledTwice);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPluginCloseCalledOnReset = function(queue) {
        expectAsserts(6);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            assert(playerPlugin.Open.calledOnce);

            assert(playerPlugin.Close.notCalled);
            this._mediaPlayer.reset();
            assert(playerPlugin.Close.calledOnce);

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            assert(playerPlugin.Close.calledOnce);
            assert(playerPlugin.Open.calledTwice);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPluginCloseNotCalledAfterStopCalledThenStartPlayback = function(queue) {
        expectAsserts(7);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlayback();
            assert(playerPlugin.Open.calledOnce);

            this._mediaPlayer.stop();
            assert(playerPlugin.Close.notCalled);

            this._mediaPlayer.beginPlayback();
            assert(playerPlugin.Close.notCalled);
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledTwice);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testWindowHideEventListenerIsTornDownOnReset = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var addStub = this.sandbox.stub(window, 'addEventListener');
            var removeStub = this.sandbox.stub(window, 'removeEventListener');

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');

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

    this.SamsungStreamingMediaPlayerTests.prototype.testWindowUnloadEventListenerIsTornDownOnReset = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {

            var addStub = this.sandbox.stub(window, 'addEventListener');
            var removeStub = this.sandbox.stub(window, 'removeEventListener');

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');

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

    this.SamsungStreamingMediaPlayerTests.prototype.testCurrentTimeIsUpdatedByOnCurrentPlayTimeEvents = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());

            assertEquals(0, this._mediaPlayer.getCurrentTime());

            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 10000);

            assertEquals(10, this._mediaPlayer.getCurrentTime());

            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 20000);

            assertEquals(20, this._mediaPlayer.getCurrentTime());
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testRangeIsUpdatedByBufferingCompleteEvents = function(queue) {
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            playerPlugin._methods.GetPlayingRange.returns('0-60');
            playerPlugin._methods.GetDuration.returns(60 * 1000);
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            assertEquals(60, this._mediaPlayer.getDuration());
            assertEquals({ start: 0, end: 60 }, this._mediaPlayer.getSeekableRange());
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testFailedJumpReturningZeroWhilePlayingReturnsToPlayingState = function(queue) {
        var jumpReturnCode = 0;
        doTestFailedJumpWhilePlayingReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testFailedJumpReturningMinusOneWhilePlayingReturnsToPlayingState = function(queue) {
        var jumpReturnCode = -1;
        doTestFailedJumpWhilePlayingReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testFailedJumpReturningFalseWhilePlayingReturnsToPlayingState = function(queue) {
        var jumpReturnCode = false;
        doTestFailedJumpWhilePlayingReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    var doTestFailedJumpWhilePlayingReturnsToPlayingState = function(self, queue, jumpReturnCode) {
        expectAsserts(5);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            self._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);

            assertEquals(MediaPlayer.STATE.PLAYING, self._mediaPlayer.getState());

            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);
            playerPlugin._methods.JumpForward.returns(jumpReturnCode);

            self._mediaPlayer.playFrom(30);

            assert(eventHandler.calledTwice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.firstCall.args[0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.lastCall.args[0].type);
            assertEquals(MediaPlayer.STATE.PLAYING, self._mediaPlayer.getState());
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testFailedJumpReturningZeroWhilePausedGoesToPlayingState = function(queue) {
        var jumpReturnCode = 0;
        doTestFailedJumpWhilePausedReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testFailedJumpReturningMinusOneWhilePausedGoesToPlayingState = function(queue) {
        var jumpReturnCode = -1;
        doTestFailedJumpWhilePausedReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testFailedJumpReturningFalseWhilePausedGoesToPlayingState = function(queue) {
        var jumpReturnCode = false;
        doTestFailedJumpWhilePausedReturnsToPlayingState(this, queue, jumpReturnCode);
    };

    var doTestFailedJumpWhilePausedReturnsToPlayingState = function(self, queue, jumpReturnCode) {
        expectAsserts(5);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            self._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);

            self._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, self._mediaPlayer.getState());

            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);
            playerPlugin._methods.JumpForward.returns(jumpReturnCode);

            self._mediaPlayer.playFrom(30);

            assert(eventHandler.calledTwice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.firstCall.args[0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.lastCall.args[0].type);
            assertEquals(MediaPlayer.STATE.PLAYING, self._mediaPlayer.getState());
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testFailedDeferredJumpRemainsInBufferingState = function(queue) {
        expectAsserts(5);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            this._mediaPlayer.playFrom(30);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);
            playerPlugin._methods.JumpForward.returns(0);

            assert(eventHandler.notCalled);
            assert(playerPlugin._methods.JumpForward.notCalled);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);

            assert(playerPlugin._methods.JumpForward.calledOnce);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testFailedDeferredJumpResultsInRepeatedAttemptsToJumpUntilSuccess = function(queue) {
        expectAsserts(8);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            this._mediaPlayer.playFrom(30);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);
            playerPlugin._methods.JumpForward.returns(0);

            assert(eventHandler.notCalled);
            assert(playerPlugin._methods.JumpForward.notCalled);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);

            assert(playerPlugin._methods.JumpForward.calledOnce);

            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 1);
            assert(playerPlugin._methods.JumpForward.calledTwice);

            playerPlugin._methods.JumpForward.returns(1);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 2);
            assert(playerPlugin._methods.JumpForward.calledThrice);

            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 3);
            assert(playerPlugin._methods.JumpForward.calledThrice);

            // No additional events - we remain in BUFFERING
            assert(eventHandler.notCalled);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testDeferredJumpsDoNotReenterBufferingState = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            this._mediaPlayer.playFrom(30);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);
            playerPlugin._methods.JumpForward.returns(0);

            assert(eventHandler.notCalled);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 1);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 2);

            assert(eventHandler.withArgs(sinon.match({ type: MediaPlayer.EVENT.BUFFERING })).notCalled);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testDeferredSeekIsCancelledWhenTargetIsCurrentTime = function(queue) {
        var targetTime = 30;
        doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime(this, queue, targetTime);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testDeferredSeekIsCancelledWhenTargetIsNearAfterCurrentTime = function(queue) {
        var targetTime = 32.5;
        doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime(this, queue, targetTime);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testDeferredSeekIsCancelledWhenTargetIsNearBeforeCurrentTime = function(queue) {
        var targetTime = 27.5;
        doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime(this, queue, targetTime);
    };

    var doTestDeferredSeekIsCancelledWhenTargetIsNearCurrentTime = function(self, queue, targetTime) {
        expectAsserts(4);
        runMediaPlayerTest(self, queue, function(MediaPlayer) {
            self._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            self._mediaPlayer.beginPlaybackFrom(30);

            assertEquals(MediaPlayer.STATE.BUFFERING, self._mediaPlayer.getState());

            self._mediaPlayer.playFrom(50);
            self._mediaPlayer.playFrom(targetTime);

            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);

            deviceMockingHooks.sendMetadata(self._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            var deviceSeeksToKeyFrameAtPosition = 30000;
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, deviceSeeksToKeyFrameAtPosition);

            assert(playerPlugin._methods.JumpForward.notCalled);
            assert(playerPlugin._methods.JumpBackward.notCalled);
            assertEquals(MediaPlayer.STATE.PLAYING, self._mediaPlayer.getState());
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testPlayFromAndPauseBeforeMetaDataLoadsResultsInSeekFirstThenPauseWithCurrentTime = function(queue) {
        expectAsserts(5);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            this._mediaPlayer.playFrom(30);
            this._mediaPlayer.pause();

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);

            // Remains in buffering state because we need to seek
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            assert(playerPlugin._methods.JumpForward.calledOnce);

            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin._methods.Pause.calledOnce);
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assertEquals(30, this._mediaPlayer.getCurrentTime());
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testDeferredSeekDoesNotPersistAfterReset = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            this._mediaPlayer.playFrom(50);

            this._mediaPlayer.stop();
            this._mediaPlayer.reset();

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);

            assert(playerPlugin._methods.JumpForward.notCalled);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testDeferredPauseDoesNotPersistAfterReset = function(queue) {
        expectAsserts(2);
        playerPlugin._methods.Pause.returns(0);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            this._mediaPlayer.pause();

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playerPlugin._methods.Pause.calledOnce);

            this._mediaPlayer.stop();
            this._mediaPlayer.reset();

            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testUrl', 'testMimeType');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 30, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);

            assert(playerPlugin._methods.Pause.calledOnce);
        });
        playerPlugin._methods.Pause.returns(1);
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testMediaUrlGetsSpecialHlsFragmentAppended = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'test/url', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assert(playerPlugin._methods.InitPlayer.calledWith('test/url|COMPONENT=HLS'));
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testMediaUrlGetsSpecialHlsFragmentAppendedWithXMpegUrl = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'test/url', 'application/x-mpegURL');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assert(playerPlugin._methods.InitPlayer.calledWith('test/url|COMPONENT=HLS'));
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testMediaUrlGetsSpecialHlsLiveFragmentAppended = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'test/url', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assert(playerPlugin._methods.InitPlayer.calledWith('test/url|HLSSLIDING|COMPONENT=HLS'));
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testMediaUrlGetsSpecialHlsLiveFragmentAppendedWithXMpegUrl = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'test/url', 'application/x-mpegURL');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assert(playerPlugin._methods.InitPlayer.calledWith('test/url|HLSSLIDING|COMPONENT=HLS'));
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testGetSourceDoesNotHaveSpecialHlsFragmentAppended = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'test/url', 'video/mp4');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assert(this._mediaPlayer.getSource().indexOf('|COMPONENT=HLS') === -1);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testCallingStopFromStoppedStateDoesNotCallDeviceStop = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            playerPlugin._methods.Stop.reset();

            this._mediaPlayer.stop();
            assert(playerPlugin._methods.Stop.notCalled);
        });
    };

    this.SamsungStreamingMediaPlayerTests.prototype.testGetPlayerElement = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assertEquals(playerPlugin, this._mediaPlayer.getPlayerElement());
        });
    };

    // **** WARNING **** WARNING **** WARNING: These TODOs are NOT complete/exhaustive
    // TODO: Investigate if we should keep a reference to the original player plugin and restore on tear-down in the same way media/samsung_streaming modifier
    // -- This appears to only be the tvmwPlugin - if we don't need it then we shouldn't modify it.
    // -- UPDATE: I haven't seen any ill effects on the 2013 FoxP from not using tvmwPlugin - needs further
    //    investigation on other devices.

    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all MediaPlayer implementations (last, so it can detect conflicts)
    window.commonTests.mediaPlayer.all.mixinTests(this.SamsungStreamingMediaPlayerTests, 'antie/devices/mediaplayer/samsung_streaming', config, deviceMockingHooks);

})();
