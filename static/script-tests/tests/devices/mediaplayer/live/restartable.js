/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {
    this.LivePlayerSupportLevelRestartableTest = AsyncTestCase('LivePlayerSupportLevelRestartableTest');

    this.LivePlayerSupportLevelRestartableTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    var sourceContainer = document.createElement('div');

    var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/mediaplayer/html5']}, 'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};
    var configWithForceBeginPlaybackToEndOfWindowAsTrue = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/mediaplayer/html5']}, 'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1','streaming':{'overrides':{'forceBeginPlaybackToEndOfWindow':true}}};
    var configWithForceBeginPlaybackToEndOfWindowAsFalse = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/mediaplayer/html5']}, 'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1','streaming':{'overrides':{'forceBeginPlaybackToEndOfWindow':false}}};

    this.LivePlayerSupportLevelRestartableTest.prototype.testGetLiveSupportReturnsRestartableWithSupportLevelRestartable = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function(application, MediaPlayer, Device) {

            var device = new Device(antie.framework.deviceConfiguration);
            var liveSupportLevel = device.getLiveSupport();

            assertEquals('restartable', liveSupportLevel);
        });
    };

    var testFunctionsInLivePlayerCallMediaPlayerFunctions = function(action, expectedArgCount) {
        return function (queue) {
            expectAsserts(2);
            queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function(application, MediaPlayer, Device) {
                var device = new Device(antie.framework.deviceConfiguration);
                var livePlayer = device.getLivePlayer();
                var mediaPlayerFuncStub = this.sandbox.stub();
                device.getMediaPlayer()[action] = mediaPlayerFuncStub;
                //using fake timers to ensure auto play timer does not fire
                var clock = sinon.useFakeTimers();
                livePlayer[action]();
                assert(mediaPlayerFuncStub.calledOnce);
                assertEquals(expectedArgCount, mediaPlayerFuncStub.getCall(0).args.length);
                clock.restore();
            }, config);
        };
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testLivePlayerBeginPlaybackCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('beginPlayback', 0);

    this.LivePlayerSupportLevelRestartableTest.prototype.testLivePlayerBeginPlaybackFromCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('beginPlaybackFrom', 1);

    this.LivePlayerSupportLevelRestartableTest.prototype.testLivePlayerInitialiseMediaCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('initialiseMedia', 5);

    this.LivePlayerSupportLevelRestartableTest.prototype.testLivePlayerStopCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('stop', 0);

    this.LivePlayerSupportLevelRestartableTest.prototype.testLivePlayerResetCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('reset', 0);

    this.LivePlayerSupportLevelRestartableTest.prototype.testLivePlayerGetStateCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getState', 0);

    this.LivePlayerSupportLevelRestartableTest.prototype.testLivePlayerGetSourceCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getSource', 0);

    this.LivePlayerSupportLevelRestartableTest.prototype.testLivePlayerGetMimeTypeCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getMimeType', 0);

    this.LivePlayerSupportLevelRestartableTest.prototype.testLivePlayerAddEventCallbackCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('addEventCallback', 2);

    this.LivePlayerSupportLevelRestartableTest.prototype.testLivePlayerRemoveEventCallbackCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('removeEventCallback', 2);

    this.LivePlayerSupportLevelRestartableTest.prototype.testLivePlayerRemoveAllEventCallbacksCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('removeAllEventCallbacks', 0);

    this.LivePlayerSupportLevelRestartableTest.prototype.testLivePlayerGetPlayerElementCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getPlayerElement', 0);

    this.LivePlayerSupportLevelRestartableTest.prototype.testLivePlayerPauseCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('pause', 0);

    this.LivePlayerSupportLevelRestartableTest.prototype.testLivePlayerResumeCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('resume', 0);

    this.LivePlayerSupportLevelRestartableTest.prototype.testSeekableMediaPlayerFunctionsNotDefinedInRestartableLive = function (queue) {
        expectAsserts(3);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function(application, MediaPlayer, Device) {

            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            assertUndefined(livePlayer.playFrom);
            assertUndefined(livePlayer.getCurrentTime);
            assertUndefined(livePlayer.getSeekableRange);
        });
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testGetStateReturnsState = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function(application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();
            assertEquals('EMPTY', livePlayer.getState());
        }, config);
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testGetSourceReturnsSource = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function(application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            this.sandbox.stub(livePlayer._mediaPlayer, 'getSource').returns('http://test.mp4');

            assertEquals('http://test.mp4', livePlayer.getSource());
        }, config);
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testGetMimeTypeReturnsMimeType = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function(application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            this.sandbox.stub(livePlayer._mediaPlayer, 'getMimeType').returns('video/mp4');

            assertEquals('video/mp4', livePlayer.getMimeType());
        }, config);
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testMediaTypeIsMutatedToLive = function(queue) {
        expectAsserts(4);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function (application, MediaPlayer, Device) {
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

    this.LivePlayerSupportLevelRestartableTest.prototype.testGetPlayerElementReturnsPlayerElement = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();
            var playerElement = 'player element';

            this.sandbox.stub(livePlayer._mediaPlayer, 'getPlayerElement').returns(playerElement);

            assertEquals(playerElement, livePlayer.getPlayerElement());
        }, config);
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testBeginPlaybackFromIsCalledWithInfinityIfForceBeginPlaybackToEndOfWindowIsTrue = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            livePlayer._mediaPlayer.beginPlayback = this.sandbox.stub();
            livePlayer._mediaPlayer.beginPlaybackFrom = this.sandbox.stub();

            livePlayer.beginPlayback();
            assert(livePlayer._mediaPlayer.beginPlaybackFrom.calledWith(Infinity));
            assert(livePlayer._mediaPlayer.beginPlayback.notCalled);
        }, configWithForceBeginPlaybackToEndOfWindowAsTrue);
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testBeginPlaybackIsCalledIfForceBeginPlaybackToEndOfWindowIsFalse = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            livePlayer._mediaPlayer.beginPlayback = this.sandbox.stub();
            livePlayer._mediaPlayer.beginPlaybackFrom = this.sandbox.stub();

            livePlayer.beginPlayback();
            assert(livePlayer._mediaPlayer.beginPlayback.called);
            assert(livePlayer._mediaPlayer.beginPlaybackFrom.notCalled);
        }, configWithForceBeginPlaybackToEndOfWindowAsFalse);
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testBeginPlaybackIsCalledIfForceBeginPlaybackToEndOfWindowIsNotPresent = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            livePlayer._mediaPlayer.beginPlayback = this.sandbox.stub();
            livePlayer._mediaPlayer.beginPlaybackFrom = this.sandbox.stub();

            livePlayer.beginPlayback();
            assert(livePlayer._mediaPlayer.beginPlayback.called);
            assert(livePlayer._mediaPlayer.beginPlaybackFrom.notCalled);
        }, config);
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testAutoResumeWhenBeginPlaybackFromThenPausedAndStartOfRangeIsApproached = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            livePlayer._mediaPlayer.beginPlaybackFrom = this.sandbox.stub();
            livePlayer._mediaPlayer.beginPlayback = this.sandbox.stub();
            livePlayer._mediaPlayer.pause = this.sandbox.stub();
            livePlayer._mediaPlayer.resume = this.sandbox.stub();

            var clock = sinon.useFakeTimers();
            livePlayer.beginPlaybackFrom(30);
            livePlayer.pause();
            clock.tick(21 * 1000);

            assert(livePlayer._mediaPlayer.resume.notCalled);

            clock.tick(1 * 1000);

            assert(livePlayer._mediaPlayer.resume.called);

            clock.restore();
        }, config);
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testAutoResumeWhenBeginPlaybackThenPausedAndStartOfRangeIsApproached = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            livePlayer._mediaPlayer.beginPlaybackFrom = this.sandbox.stub();
            livePlayer._mediaPlayer.beginPlayback = this.sandbox.stub();
            livePlayer._mediaPlayer.pause = this.sandbox.stub();
            livePlayer._mediaPlayer.resume = this.sandbox.stub();
            this.sandbox.stub(livePlayer._mediaPlayer, 'getCurrentTime').returns(30);
            this.sandbox.stub(livePlayer._mediaPlayer, 'getState').returns(MediaPlayer.STATE.PLAYING);

            var clock = sinon.useFakeTimers();
            livePlayer.beginPlayback();
            livePlayer._mediaPlayer._emitEvent(MediaPlayer.EVENT.PLAYING);
            livePlayer.pause();
            clock.tick(21 * 1000);

            assert(livePlayer._mediaPlayer.resume.notCalled);

            clock.tick(1 * 1000);

            assert(livePlayer._mediaPlayer.resume.called);

            clock.restore();

        }, config);
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testAutoResumeWhenPausedMultipleTimesAndStartOfRangeIsApproached = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            livePlayer._mediaPlayer.beginPlaybackFrom = this.sandbox.stub();
            livePlayer._mediaPlayer.beginPlayback = this.sandbox.stub();
            livePlayer._mediaPlayer.pause = this.sandbox.stub();
            livePlayer._mediaPlayer.resume = this.sandbox.stub();
            this.sandbox.stub(livePlayer._mediaPlayer, 'getState').returns(MediaPlayer.STATE.PLAYING);

            var clock = sinon.useFakeTimers();
            livePlayer.beginPlaybackFrom(30);
            livePlayer.pause();
            clock.tick(21 * 1000);
            livePlayer._mediaPlayer._emitEvent(MediaPlayer.EVENT.PLAYING);
            livePlayer.pause();
            clock.tick(1 * 1000);

            assert(livePlayer._mediaPlayer.resume.called);

            clock.restore();
        }, config);
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testAutoResumeCancelledWhenPausedAndResumedBeforeStartOfRangeIsApproached = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            livePlayer._mediaPlayer.beginPlaybackFrom = this.sandbox.stub();
            livePlayer._mediaPlayer.beginPlayback = this.sandbox.stub();
            livePlayer._mediaPlayer.pause = this.sandbox.stub();
            livePlayer._mediaPlayer.resume = this.sandbox.stub();
            this.sandbox.stub(livePlayer._mediaPlayer, 'getState').returns(MediaPlayer.STATE.PLAYING);

            var clock = sinon.useFakeTimers();
            livePlayer.beginPlaybackFrom(30);
            livePlayer.pause();

            livePlayer._mediaPlayer._emitEvent(MediaPlayer.EVENT.PLAYING);
            clock.tick(22 * 1000);

            assert(livePlayer._mediaPlayer.resume.notCalled);

            clock.restore();
        }, config);
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testAutoResumesImmediatelyIfPausedAfterAlreadyAutoResumeing = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            livePlayer._mediaPlayer.beginPlaybackFrom = this.sandbox.stub();
            livePlayer._mediaPlayer.beginPlayback = this.sandbox.stub();
            livePlayer._mediaPlayer.pause = this.sandbox.stub();
            livePlayer._mediaPlayer.resume = this.sandbox.stub();

            var clock = sinon.useFakeTimers();
            livePlayer.beginPlaybackFrom(30);
            livePlayer.pause();
            clock.tick(30 * 1000);

            livePlayer._mediaPlayer.resume.reset();

            livePlayer.pause();
            clock.tick(1);

            assert(livePlayer._mediaPlayer.resume.called);

            clock.restore();
        }, config);
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testDoesNotAutoResumeWhenItIsDisabled = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            livePlayer._mediaPlayer.beginPlaybackFrom = this.sandbox.stub();
            livePlayer._mediaPlayer.beginPlayback = this.sandbox.stub();
            livePlayer._mediaPlayer.pause = this.sandbox.stub();
            livePlayer._mediaPlayer.resume = this.sandbox.stub();

            var clock = sinon.useFakeTimers();
            livePlayer.beginPlaybackFrom(30);
            livePlayer.pause({disableAutoResume: true});
            clock.tick(30 * 1000);

            assert(livePlayer._mediaPlayer.resume.notCalled);

            clock.restore();
        }, config);

    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testAutoResumeNotCancelledByEventWithPausedState = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            livePlayer._mediaPlayer.beginPlaybackFrom = this.sandbox.stub();
            livePlayer._mediaPlayer.beginPlayback = this.sandbox.stub();
            livePlayer._mediaPlayer.pause = this.sandbox.stub();
            livePlayer._mediaPlayer.resume = this.sandbox.stub();
            livePlayer._mediaPlayer.getState = this.sandbox.stub();
            livePlayer._mediaPlayer.getState.returns(MediaPlayer.STATE.PLAYING);
            livePlayer._mediaPlayer.resume = this.sandbox.stub();

            var clock = sinon.useFakeTimers();
            livePlayer.beginPlaybackFrom(30);
            livePlayer.pause();

            livePlayer._mediaPlayer.getState.returns(MediaPlayer.STATE.PAUSED);
            livePlayer._mediaPlayer._emitEvent(MediaPlayer.EVENT.SENTINEL_PAUSE);
            clock.tick(22 * 1000);

            assert(livePlayer._mediaPlayer.resume.called);

            clock.restore();
        }, config);
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testAutoResumeWhenBeginPlaybackFromTimeSpentBufferingIsDeducted = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            livePlayer._mediaPlayer.beginPlaybackFrom = this.sandbox.stub();
            livePlayer._mediaPlayer.beginPlayback = this.sandbox.stub();
            livePlayer._mediaPlayer.pause = this.sandbox.stub();
            livePlayer._mediaPlayer.resume = this.sandbox.stub();
            livePlayer._mediaPlayer.getState = this.sandbox.stub();
            livePlayer._mediaPlayer.getState.returns(MediaPlayer.STATE.PLAYING);

            var clock = sinon.useFakeTimers();
            livePlayer.beginPlaybackFrom(30);

            livePlayer._mediaPlayer.getState.returns(MediaPlayer.STATE.BUFFERING);
            livePlayer._mediaPlayer._emitEvent(MediaPlayer.EVENT.BUFFERING);

            clock.tick(21 * 1000);

            livePlayer._mediaPlayer.getState.returns(MediaPlayer.STATE.PLAYING);
            livePlayer._mediaPlayer._emitEvent(MediaPlayer.EVENT.PLAYING);

            livePlayer.pause();

            clock.tick(1 * 1000);

            assert(livePlayer._mediaPlayer.resume.called);

            clock.restore();
        }, config);
    };

    this.LivePlayerSupportLevelRestartableTest.prototype.testAutoResumeWhenBeginPlaybackTimeSpentBufferingIsDeducted = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/mediaplayer/mediaplayer', 'antie/devices/device', 'antie/devices/mediaplayer/live/restartable'], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            livePlayer._mediaPlayer.beginPlaybackFrom = this.sandbox.stub();
            livePlayer._mediaPlayer.beginPlayback = this.sandbox.stub();
            livePlayer._mediaPlayer.pause = this.sandbox.stub();
            livePlayer._mediaPlayer.resume = this.sandbox.stub();
            this.sandbox.stub(livePlayer._mediaPlayer, 'getCurrentTime').returns(30);
            livePlayer._mediaPlayer.getState = this.sandbox.stub();
            livePlayer._mediaPlayer.getState.returns(MediaPlayer.STATE.PLAYING);

            var clock = sinon.useFakeTimers();
            livePlayer.beginPlayback();
            livePlayer._mediaPlayer._emitEvent(MediaPlayer.EVENT.PLAYING);

            livePlayer._mediaPlayer.getState.returns(MediaPlayer.STATE.BUFFERING);
            livePlayer._mediaPlayer._emitEvent(MediaPlayer.EVENT.BUFFERING);

            clock.tick(21 * 1000);

            livePlayer._mediaPlayer.getState.returns(MediaPlayer.STATE.PLAYING);
            livePlayer._mediaPlayer._emitEvent(MediaPlayer.EVENT.PLAYING);

            livePlayer.pause();

            clock.tick(1 * 1000);

            assert(livePlayer._mediaPlayer.resume.called);

            clock.restore();
        }, config);
    };

})();
