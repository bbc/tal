/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {
    this.LivePlayerSupportLevelSeekableTest = AsyncTestCase('LivePlayerSupportLevelSeekableTest');

    this.LivePlayerSupportLevelSeekableTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    var sourceContainer = document.createElement('div');

    var config = {
        'modules': {'base': 'antie/devices/browserdevice', 'modifiers': ['antie/devices/mediaplayer/html5']},
        'input': {'map': {}},
        'layouts': [{
            'width': 960,
            'height': 540,
            'module': 'fixtures/layouts/default',
            'classes': ['browserdevice540p']
        }],
        'deviceConfigurationKey': 'devices-html5-1'
    };
    var configWithForceBeginPlaybackToEndOfWindowAsTrue = {
        'modules': {
            'base': 'antie/devices/browserdevice',
            'modifiers': ['antie/devices/mediaplayer/html5']
        },
        'input': {'map': {}},
        'layouts': [{
            'width': 960,
            'height': 540,
            'module': 'fixtures/layouts/default',
            'classes': ['browserdevice540p']
        }],
        'deviceConfigurationKey': 'devices-html5-1',
        'streaming': {'overrides': {'forceBeginPlaybackToEndOfWindow': true}}
    };
    var configWithForceBeginPlaybackToEndOfWindowAsFalse = {
        'modules': {
            'base': 'antie/devices/browserdevice',
            'modifiers': ['antie/devices/mediaplayer/html5']
        },
        'input': {'map': {}},
        'layouts': [{
            'width': 960,
            'height': 540,
            'module': 'fixtures/layouts/default',
            'classes': ['browserdevice540p']
        }],
        'deviceConfigurationKey': 'devices-html5-1',
        'streaming': {'overrides': {'forceBeginPlaybackToEndOfWindow': false}}
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testGetLiveSupportReturnsSeekableWithSupportLevelSeekable = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {

            var device = new Device(antie.framework.deviceConfiguration);
            var liveSupportLevel = device.getLiveSupport();

            assertEquals('seekable', liveSupportLevel);
        });
    };

    var testFunctionsInLivePlayerCallMediaPlayerFunctions = function (action, expectedArgCount) {
        return function (queue) {
            expectAsserts(2);
            queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
                var device = new Device(antie.framework.deviceConfiguration);
                var livePlayer = device.getLivePlayer();
                var mediaPlayerFuncStub = this.sandbox.stub();
                device.getMediaPlayer()[action] = mediaPlayerFuncStub;
                livePlayer[action]();
                assert(mediaPlayerFuncStub.calledOnce);
                assertEquals(expectedArgCount, mediaPlayerFuncStub.getCall(0).args.length);
            }, config);
        };
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerInitialiseMediaCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('initialiseMedia', 5);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerBeginPlaybackCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('beginPlayback', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerBeginPlaybackFromCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('beginPlaybackFrom', 1);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerStopCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('stop', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerResetCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('reset', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerGetStateCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getState', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerGetSourceCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getSource', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerGetMimeTypeCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getMimeType', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerAddEventCallbackCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('addEventCallback', 2);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerRemoveEventCallbackCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('removeEventCallback', 2);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerRemoveAllEventCallbacksCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('removeAllEventCallbacks', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerPlayFromCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('playFrom', 1);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerPauseCallsFunctionInMediaPlayer = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();
            var expectedRange = {
                'start': 0,
                'end': 30
            };
            this.sandbox.stub(livePlayer._mediaPlayer, 'getSeekableRange').returns(expectedRange);
            this.sandbox.stub(livePlayer._mediaPlayer, 'getCurrentTime').returns(30);
            this.sandbox.stub(livePlayer._mediaPlayer, 'resume');
            var pauseStub = this.sandbox.stub(device.getMediaPlayer(), 'pause');
            //using fake timers to ensure auto resume timer does not fire
            var clock = sinon.useFakeTimers();
            livePlayer.pause();
            assert(pauseStub.calledOnce);
            assertEquals(0, pauseStub.getCall(0).args.length);
            clock.restore();
        }, config);
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerPauseFakesImmediateAutoResumeNearStartOfSeekableRange = function (queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();
            var expectedRange = {
                'start': 0,
                'end': 30
            };
            this.sandbox.stub(livePlayer._mediaPlayer, 'getSeekableRange').returns(expectedRange);
            this.sandbox.stub(livePlayer._mediaPlayer, 'getCurrentTime').returns(8);
            var toPausedStub = this.sandbox.stub(livePlayer._mediaPlayer, '_toPaused');
            var toPlayingStub = this.sandbox.stub(livePlayer._mediaPlayer, '_toPlaying');
            var pauseStub = this.sandbox.stub(livePlayer._mediaPlayer, 'pause');

            livePlayer.pause();
            assert(pauseStub.notCalled);
            assert(toPausedStub.calledOnce);
            assert(toPlayingStub.calledOnce);
            sinon.assert.callOrder(toPausedStub, toPlayingStub);
        }, config);
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerPauseDoesNotFakeImmediateAutoResumeIfDisabledNearStartOfSeekableRange = function (queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();
            var expectedRange = {
                'start': 0,
                'end': 30
            };
            this.sandbox.stub(livePlayer._mediaPlayer, 'getSeekableRange').returns(expectedRange);
            this.sandbox.stub(livePlayer._mediaPlayer, 'getCurrentTime').returns(8);
            var toPausedStub = this.sandbox.stub(livePlayer._mediaPlayer, '_toPaused');
            var toPlayingStub = this.sandbox.stub(livePlayer._mediaPlayer, '_toPlaying');
            var pauseStub = this.sandbox.stub(livePlayer._mediaPlayer, 'pause');

            livePlayer.pause({disableAutoResume: true});
            assert(pauseStub.calledOnce);
            assert(toPausedStub.notCalled);
            assert(toPlayingStub.notCalled);
        }, config);
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerResumeCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('resume', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerGetCurrentTimeCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getCurrentTime', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerGetSeekableRangeCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getSeekableRange', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerGetPlayerElementCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getPlayerElement', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testGetStateReturnsState = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();
            assertEquals('EMPTY', livePlayer.getState());
        }, config);
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testGetSourceReturnsSource = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            this.sandbox.stub(livePlayer._mediaPlayer, 'getSource').returns('http://test.mp4');

            assertEquals('http://test.mp4', livePlayer.getSource());
        }, config);
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testGetMimeTypeReturnsMimeType = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            this.sandbox.stub(livePlayer._mediaPlayer, 'getMimeType').returns('video/mp4');

            assertEquals('video/mp4', livePlayer.getMimeType());
        }, config);
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testGetCurrentTimeReturnsCurrentTime = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            this.sandbox.stub(livePlayer._mediaPlayer, 'getCurrentTime').returns(30);

            assertEquals(30, livePlayer.getCurrentTime());
        }, config);
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testGetSeekableRangeReturnsSeekableRange = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            var expectedRange = {
                'start': 0,
                'end': 30
            };

            this.sandbox.stub(livePlayer._mediaPlayer, 'getSeekableRange').returns(expectedRange);

            assertEquals(expectedRange, livePlayer.getSeekableRange());
        }, config);
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testMediaTypeIsMutatedToLive = function (queue) {
        expectAsserts(4);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            this.sandbox.stub(livePlayer._mediaPlayer, 'initialiseMedia');

            livePlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, '', '', sourceContainer);
            assert(livePlayer._mediaPlayer.initialiseMedia.calledWith(MediaPlayer.TYPE.LIVE_VIDEO));

            livePlayer.initialiseMedia(MediaPlayer.TYPE.AUDIO, '', '', sourceContainer);
            assert(livePlayer._mediaPlayer.initialiseMedia.calledWith(MediaPlayer.TYPE.LIVE_AUDIO));

            livePlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_VIDEO, '', '', sourceContainer);
            assert(livePlayer._mediaPlayer.initialiseMedia.calledWith(MediaPlayer.TYPE.LIVE_VIDEO));

            livePlayer.initialiseMedia(MediaPlayer.TYPE.LIVE_AUDIO, '', '', sourceContainer);
            assert(livePlayer._mediaPlayer.initialiseMedia.calledWith(MediaPlayer.TYPE.LIVE_AUDIO));
        }, config);
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testGetPlayerElementReturnsPlayerElement = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();
            var playerElement = 'player element';

            this.sandbox.stub(livePlayer._mediaPlayer, 'getPlayerElement').returns(playerElement);

            assertEquals(playerElement, livePlayer.getPlayerElement());
        }, config);
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testBeginPlaybackFromIsCalledWithInfinityIfForceBeginPlaybackToEndOfWindowIsTrue = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            livePlayer._mediaPlayer.beginPlayback = this.sandbox.stub();
            livePlayer._mediaPlayer.beginPlaybackFrom = this.sandbox.stub();

            livePlayer.beginPlayback();
            assert(livePlayer._mediaPlayer.beginPlaybackFrom.calledWith(Infinity));
            assert(livePlayer._mediaPlayer.beginPlayback.notCalled);
        }, configWithForceBeginPlaybackToEndOfWindowAsTrue);
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testBeginPlaybackIsCalledIfForceBeginPlaybackToEndOfWindowIsFalse = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            livePlayer._mediaPlayer.beginPlayback = this.sandbox.stub();
            livePlayer._mediaPlayer.beginPlaybackFrom = this.sandbox.stub();

            livePlayer.beginPlayback();
            assert(livePlayer._mediaPlayer.beginPlayback.called);
            assert(livePlayer._mediaPlayer.beginPlaybackFrom.notCalled);
        }, configWithForceBeginPlaybackToEndOfWindowAsFalse);
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testBeginPlaybackIsCalledIfForceBeginPlaybackToEndOfWindowIsNotPresent = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            livePlayer._mediaPlayer.beginPlayback = this.sandbox.stub();
            livePlayer._mediaPlayer.beginPlaybackFrom = this.sandbox.stub();

            livePlayer.beginPlayback();
            assert(livePlayer._mediaPlayer.beginPlayback.called);
            assert(livePlayer._mediaPlayer.beginPlaybackFrom.notCalled);
        }, config);
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testAutoResumeWhenPausedAndStartOfRangeIsApproached = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();
            this.sandbox.stub(livePlayer._mediaPlayer, 'pause');

            var expectedRange = {
                'start': 0,
                'end': 30
            };

            this.sandbox.stub(livePlayer._mediaPlayer, 'getSeekableRange').returns(expectedRange);
            this.sandbox.stub(livePlayer._mediaPlayer, 'getCurrentTime').returns(30);

            livePlayer._mediaPlayer.resume = this.sandbox.stub();

            var clock = sinon.useFakeTimers();
            livePlayer.pause();
            clock.tick(21 * 1000);

            assert(livePlayer._mediaPlayer.resume.notCalled);

            clock.tick(1 * 1000);

            assert(livePlayer._mediaPlayer.resume.called);

            clock.restore();
        }, config);
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testDoesNotAutoResumeWhenItIsDisabled = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();
            this.sandbox.stub(livePlayer._mediaPlayer, 'pause');

            var expectedRange = {
                'start': 0,
                'end': 30
            };

            this.sandbox.stub(livePlayer._mediaPlayer, 'getSeekableRange').returns(expectedRange);
            this.sandbox.stub(livePlayer._mediaPlayer, 'getCurrentTime').returns(30);

            livePlayer._mediaPlayer.resume = this.sandbox.stub();

            var clock = sinon.useFakeTimers();
            livePlayer.pause({disableAutoResume: true});
            clock.tick(22 * 1000);

            assert(livePlayer._mediaPlayer.resume.notCalled);

            clock.restore();
        }, config);
    };


    this.LivePlayerSupportLevelSeekableTest.prototype.testAutoResumeCancelledWhenPausedAndResumedBeforeStartOfRangeIsApproached = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();
            this.sandbox.stub(livePlayer._mediaPlayer, 'pause');

            var expectedRange = {
                'start': 0,
                'end': 30
            };

            this.sandbox.stub(livePlayer._mediaPlayer, 'getSeekableRange').returns(expectedRange);
            this.sandbox.stub(livePlayer._mediaPlayer, 'getCurrentTime').returns(30);
            livePlayer._mediaPlayer.getState = this.sandbox.stub();
            livePlayer._mediaPlayer.getState.returns(MediaPlayer.STATE.PLAYING);

            livePlayer._mediaPlayer.resume = this.sandbox.stub();

            var clock = sinon.useFakeTimers();
            livePlayer.pause();

            livePlayer._mediaPlayer._emitEvent(MediaPlayer.EVENT.PLAYING);
            clock.tick(22 * 1000);

            assert(livePlayer._mediaPlayer.resume.notCalled);

            clock.restore();
        }, config);
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testAutoResumeNotCancelledByEventWithPausedState = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/seekable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();
            this.sandbox.stub(livePlayer._mediaPlayer, 'pause');

            var expectedRange = {
                'start': 0,
                'end': 30
            };

            this.sandbox.stub(livePlayer._mediaPlayer, 'getSeekableRange').returns(expectedRange);
            this.sandbox.stub(livePlayer._mediaPlayer, 'getCurrentTime').returns(30);
            livePlayer._mediaPlayer.getState = this.sandbox.stub();
            livePlayer._mediaPlayer.getState.returns(MediaPlayer.STATE.PLAYING);

            livePlayer._mediaPlayer.resume = this.sandbox.stub();

            var clock = sinon.useFakeTimers();
            livePlayer.pause();

            livePlayer._mediaPlayer.getState.returns(MediaPlayer.STATE.PAUSED);
            livePlayer._mediaPlayer._emitEvent(MediaPlayer.EVENT.SENTINEL_PAUSE);
            clock.tick(22 * 1000);

            assert(livePlayer._mediaPlayer.resume.called);

            clock.restore();
        }, config);
    };

})();
