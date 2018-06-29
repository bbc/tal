/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.SamsungStreaming2015MediaPlayerTests = AsyncTestCase('SamsungStreaming2015MediaPlayer');

    var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/mediaplayer/samsung_streaming_2015']}, 'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};
    var screenSize = {};
    var playerPlugin = null;

    // Setup device specific mocking
    var deviceMockingHooks = {
        setup: function(/*sandbox, application*/) {

            // Override StartPlayback to update the time for the common tests only - although the Samsung specific tests
            // do use these mocking hooks, they do not call setup.
            playerPlugin._methods.StartPlayback = function (seconds) {
                this.parent.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, seconds * 1000);
            };
        },
        sendMetadata: function(mediaPlayer, currentTime, range) {
            if (range !== undefined) {
                playerPlugin._range = range;
            }
            playerPlugin._methods.GetLiveDuration.returns(playerPlugin._range.start*1000 + '|' + playerPlugin._range.end*1000);
            playerPlugin._methods.GetDuration.returns(playerPlugin._range.end*1000);
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

    this.SamsungStreaming2015MediaPlayerTests.prototype.setUp = function() {
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
                case 'GetLiveDuration':
                    return this._methods.GetLiveDuration();
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
                GetLiveDuration: this.sandbox.stub(),
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

    this.SamsungStreaming2015MediaPlayerTests.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    var runMediaPlayerTest = function (self, queue, action) {
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/samsung_streaming_2015', 'antie/devices/mediaplayer/mediaplayer'],
                              function(application, MediaPlayerImpl, MediaPlayer) {
                                  self._device = application.getDevice();
                                  self.sandbox.stub(self._device, 'getScreenSize').returns(screenSize);
                                  self._errorLog = self.sandbox.stub(self._device.getLogger(), 'error');
                                  self._mediaPlayer = self._device.getMediaPlayer();
            
                                  action.call(self, MediaPlayer);
                              }, config);
    };

    //---------------------
    // Samsung Streaming 2015 specific tests
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
    
    
    /*HLS specific tests START*/
    this.SamsungStreaming2015MediaPlayerTests.prototype.testPLayerOpenPluginThenHlsStartPlaybackCalledOnDeviceWhenBeginPlaybackFromCalledInStoppedState = function(queue) {
        expectAsserts(9);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            assert(playerPlugin.Open.calledWith('Player', '1.010', 'Player'));
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL|COMPONENT=HLS'));
            assert(playerPlugin._methods.InitPlayer.calledOnce);
            
            assert(playerPlugin._methods.StartPlayback.notCalled);
            this._mediaPlayer.beginPlaybackFrom(0);
            assert(playerPlugin._methods.StartPlayback.calledWith(0));
            assert(playerPlugin._methods.StartPlayback.calledOnce);
        });
    };
    this.SamsungStreaming2015MediaPlayerTests.prototype.testPLayerOpenPluginThenHlsPlayCalledOnDeviceWhenBeginPlaybackFromCalledInStoppedState = function(queue) {
        expectAsserts(8);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            assert(playerPlugin.Open.calledWith('Player', '1.010', 'Player'));
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL|COMPONENT=HLS'));
            assert(playerPlugin._methods.InitPlayer.calledOnce);
            
            assert(playerPlugin._methods.StartPlayback.notCalled);
            this._mediaPlayer.beginPlayback();
            assert(playerPlugin._methods.StartPlayback.calledOnce);
        });
    };

    this.SamsungStreaming2015MediaPlayerTests.prototype.testHlsLiveStartPlaybackFromBeginingCalledOnDeviceWhenBeginPlaybackFromCalledInStoppedState = function(queue) {
        expectAsserts(9);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            assert(playerPlugin.Open.calledWith('Player', '1.010', 'Player'));
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL|COMPONENT=HLS'));
            assert(playerPlugin._methods.InitPlayer.calledOnce);
            
            assert(playerPlugin._methods.StartPlayback.notCalled);
            this._mediaPlayer.beginPlaybackFrom(0);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            //live playback started from 0 position causes spoiler defect
            assertEquals(this._mediaPlayer.CLAMP_OFFSET_FROM_START_OF_RANGE, playerPlugin._methods.StartPlayback.args[0][0]);
        });
    };
    
    this.SamsungStreaming2015MediaPlayerTests.prototype.testHlsLiveStartPlaybackFromNearStartUsesClampOffsetFromStartOfRange = function(queue) {
        expectAsserts(9);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            assert(playerPlugin.Open.calledWith('Player', '1.010', 'Player'));
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL|COMPONENT=HLS'));
            assert(playerPlugin._methods.InitPlayer.calledOnce);

            assert(playerPlugin._methods.StartPlayback.notCalled);
            this._mediaPlayer.beginPlaybackFrom(0.1);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            //live playback started from 0 position causes spoiler defect
            assertEquals(this._mediaPlayer.CLAMP_OFFSET_FROM_START_OF_RANGE, playerPlugin._methods.StartPlayback.args[0][0]);
        });
    };
    
    this.SamsungStreaming2015MediaPlayerTests.prototype.testHlsLiveResumePlayCalledWithTimePassedIntoBeginPlaybackFrom = function(queue) {
        expectAsserts(9);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin.Open.notCalled);
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            assert(playerPlugin.Open.calledWith('Player', '1.010', 'Player'));
            assert(playerPlugin.Open.calledOnce);
            assert(playerPlugin._methods.InitPlayer.calledWith('testURL|COMPONENT=HLS'));
            assert(playerPlugin._methods.InitPlayer.calledOnce);
            
            assert(playerPlugin._methods.StartPlayback.notCalled);
            this._mediaPlayer.beginPlaybackFrom(19);
            assert(playerPlugin._methods.StartPlayback.calledWith(19));
            assert(playerPlugin._methods.StartPlayback.calledOnce);
        });
    };
    
    this.SamsungStreaming2015MediaPlayerTests.prototype.testHlsGetLiveDurationUpdateCalledBeforeJumpForward = function (queue) {
        expectAsserts(7);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 0);
            this._mediaPlayer._updatingTime = false;
            
            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.GetLiveDuration.calledOnce);
            
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 22 * 1000);
            
            assert(playerPlugin._methods.JumpForward.notCalled);
            this._mediaPlayer.playFrom(50);
            assert(playerPlugin._methods.GetLiveDuration.calledTwice);
            assert(playerPlugin._methods.JumpForward.calledOnce);
        });
    };
    
    this.SamsungStreaming2015MediaPlayerTests.prototype.testHlsGetLiveDurationUpdateCalledBeforeJumpBackward = function (queue) {
        expectAsserts(7);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            assert(playerPlugin._methods.InitPlayer.notCalled);
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlayback();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 100, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 90 * 1000);
            this._mediaPlayer._updatingTime = false;
            
            assert(playerPlugin._methods.InitPlayer.calledOnce);
            assert(playerPlugin._methods.StartPlayback.calledOnce);
            assert(playerPlugin._methods.GetLiveDuration.calledOnce);
            
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 122 * 1000);
            
            assert(playerPlugin._methods.JumpBackward.notCalled);
            this._mediaPlayer.playFrom(10);
            assert(playerPlugin._methods.GetLiveDuration.calledTwice);
            assert(playerPlugin._methods.JumpBackward.calledOnce);
        });
    };
    
    this.SamsungStreaming2015MediaPlayerTests.prototype.testHlsGetLiveDurationUpdateNotCalledWhileInRangeTolerance = function (queue) {
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
            assert(playerPlugin._methods.GetLiveDuration.calledOnce);
            
            this._mediaPlayer.playFrom(10);
            assert(playerPlugin._methods.GetLiveDuration.calledOnce);
            
            this._mediaPlayer._updatingTime = false;
            this._mediaPlayer.playFrom(20);
            assert(playerPlugin._methods.GetLiveDuration.calledTwice);
        });
    };
    
    this.SamsungStreaming2015MediaPlayerTests.prototype.testHlsGetLiveDurationUpdateOnCurrentTimeGreaterThanEndRangeTolerance = function (queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlayback();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 100, { start: 0, end: 100 });
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 100 * 1000);
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            
            assert(playerPlugin._methods.GetLiveDuration.calledOnce);
            this._mediaPlayer._updatingTime = false;
            
            this._mediaPlayer._range = {
                start: 24,
                end: 124
            };
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 133 * 1000);
            assert(playerPlugin._methods.GetLiveDuration.calledTwice);
        });
    };
    
    this.SamsungStreaming2015MediaPlayerTests.prototype.testHlsGetLiveDurationUpdateOnCurrentTimeLowerThanStartRangeTolerance = function (queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME,  this._mediaPlayer.CLAMP_OFFSET_FROM_END_OF_RANGE * 1000);
            playerPlugin._methods.GetLiveDuration.returns(playerPlugin._range.start + '|' + playerPlugin._range.end);
            
            assert(playerPlugin._methods.GetLiveDuration.calledOnce);
            this._mediaPlayer._updatingTime = false;
            
            this._mediaPlayer._range = {
                start: 24,
                end: 124
            };
            playerPlugin.OnEvent(listenerEventCodes.CURRENT_PLAYBACK_TIME, 15 * 1000);
            playerPlugin._methods.GetLiveDuration.returns(playerPlugin._range.start + '|' + playerPlugin._range.end);
            
            assertEquals(this._mediaPlayer_range, playerPlugin._methods.GetLiveDuration.args[1][0]);
            assert(playerPlugin._methods.GetLiveDuration.calledTwice);
            assert(playerPlugin._methods.JumpForward.notCalled);
        });
    };
        
    this.SamsungStreaming2015MediaPlayerTests.prototype.testHlsVodGetDurationUsedInsteadOfGetLiveDuration = function (queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function(MediaPlayer) {
            this._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'testURL', 'application/vnd.apple.mpegurl');
            this._mediaPlayer.beginPlaybackFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });

            assert(playerPlugin._methods.GetLiveDuration.notCalled);
            assert(playerPlugin._methods.GetDuration.calledOnce);
            assertEquals(100, this._mediaPlayer.getDuration());
        });
    };
    /*HLS specific tests END*/

    // **** WARNING **** WARNING **** WARNING: These TODOs are NOT complete/exhaustive
    // TODO: Investigate if we should keep a reference to the original player plugin and restore on tear-down in the same way media/samsung_streaming modifier
    // -- This appears to only be the tvmwPlugin - if we don't need it then we shouldn't modify it.
    // -- UPDATE: I haven't seen any ill effects on the 2013 FoxP from not using tvmwPlugin - needs further
    //    investigation on other devices.

    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all MediaPlayer implementations (last, so it can detect conflicts)
    window.commonTests.mediaPlayer.all.mixinTests(this.SamsungStreaming2015MediaPlayerTests, 'antie/devices/mediaplayer/samsung_streaming_2015', config, deviceMockingHooks);

})();
