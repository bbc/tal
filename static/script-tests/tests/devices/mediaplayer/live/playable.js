/**
 * @preserve Copyright (c) 2015 British Broadcasting Corporation
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

(function () {
    // jshint newcap: false
    this.LivePlayerSupportLevelPlayableTest = AsyncTestCase("LivePlayerSupportLevelPlayableTest");

    this.LivePlayerSupportLevelPlayableTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.LivePlayerSupportLevelPlayableTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    this.LivePlayerSupportLevelPlayableTest.prototype.testGetLiveSupportReturnsPlayableWithSupportLevelPlayable = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", "antie/devices/device", "antie/devices/mediaplayer/live/playable"], function(application, MediaPlayer, Device) {

            var device = new Device(antie.framework.deviceConfiguration);
            var liveSupportLevel = device.getLiveSupport();

            assertEquals("playable", liveSupportLevel);
        });
    };

    var testFunctionsInLivePlayerCallMediaPlayerFunctions = function(action, expectedArgCount) {
        return function (queue) {
            expectAsserts(2);
            queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", "antie/devices/device", "antie/devices/mediaplayer/live/playable"], function(application, MediaPlayer, Device) {
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

    this.LivePlayerSupportLevelPlayableTest.prototype.testLivePlayerBeginPlaybackCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('beginPlayback', 0);

    this.LivePlayerSupportLevelPlayableTest.prototype.testLivePlayerSetSourceCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('setSource', 3);

    this.LivePlayerSupportLevelPlayableTest.prototype.testLivePlayerStopCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('stop', 0);

    this.LivePlayerSupportLevelPlayableTest.prototype.testLivePlayerResetCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('reset', 0);

    this.LivePlayerSupportLevelPlayableTest.prototype.testLivePlayerGetStateCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getState', 0);

    this.LivePlayerSupportLevelPlayableTest.prototype.testLivePlayerGetSourceCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getSource', 0);

    this.LivePlayerSupportLevelPlayableTest.prototype.testLivePlayerGetMimeTypeCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getMimeType', 0);

    this.LivePlayerSupportLevelPlayableTest.prototype.testLivePlayerAddEventCallbackCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('addEventCallback', 2);

    this.LivePlayerSupportLevelPlayableTest.prototype.testLivePlayerRemoveEventCallbackCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('removeEventCallback', 2);

    this.LivePlayerSupportLevelPlayableTest.prototype.testLivePlayerRemoveAllEventCallbacksCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('removeAllEventCallbacks', 0);

    this.LivePlayerSupportLevelPlayableTest.prototype.testLivePlayerGetPlayerElementCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getPlayerElement', 0);

    this.LivePlayerSupportLevelPlayableTest.prototype.testSeekableMediaPlayerFunctionsNotDefinedInPlayableLive = function (queue) {
        expectAsserts(6);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", "antie/devices/device", "antie/devices/mediaplayer/live/playable"], function(application, MediaPlayer, Device) {

            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            assertUndefined(livePlayer.beginPlaybackFrom);
            assertUndefined(livePlayer.playFrom);
            assertUndefined(livePlayer.pause);
            assertUndefined(livePlayer.resume);
            assertUndefined(livePlayer.getCurrentTime);
            assertUndefined(livePlayer.getSeekableRange);
        });
    };

    this.LivePlayerSupportLevelPlayableTest.prototype.testGetStateReturnsState = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", "antie/devices/device", "antie/devices/mediaplayer/live/playable"], function(application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();
            assertEquals("EMPTY", livePlayer.getState());
        }, config);
    };

    this.LivePlayerSupportLevelPlayableTest.prototype.testGetSourceReturnsSource = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", "antie/devices/device", "antie/devices/mediaplayer/live/playable"], function(application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            this.sandbox.stub(livePlayer._mediaPlayer, 'getSource').returns("http://test.mp4");

            assertEquals("http://test.mp4", livePlayer.getSource());
        }, config);
    };

    this.LivePlayerSupportLevelPlayableTest.prototype.testGetMimeTypeReturnsMimeType = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", "antie/devices/device", "antie/devices/mediaplayer/live/playable"], function(application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            this.sandbox.stub(livePlayer._mediaPlayer, 'getMimeType').returns("video/mp4");

            assertEquals("video/mp4", livePlayer.getMimeType());
        }, config);
    };

    this.LivePlayerSupportLevelPlayableTest.prototype.testMediaTypeIsMutatedToLive = function(queue) {
        expectAsserts(4);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", "antie/devices/device", "antie/devices/mediaplayer/live/playable"], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            this.sandbox.stub(livePlayer._mediaPlayer, 'setSource');

            livePlayer.setSource(MediaPlayer.TYPE.VIDEO, "", "");
            assert(livePlayer._mediaPlayer.setSource.calledWith(MediaPlayer.TYPE.LIVE_VIDEO));

            livePlayer.setSource(MediaPlayer.TYPE.AUDIO, "", "");
            assert(livePlayer._mediaPlayer.setSource.calledWith(MediaPlayer.TYPE.LIVE_AUDIO));

            livePlayer.setSource(MediaPlayer.TYPE.LIVE_VIDEO, "", "");
            assert(livePlayer._mediaPlayer.setSource.calledWith(MediaPlayer.TYPE.LIVE_VIDEO));

            livePlayer.setSource(MediaPlayer.TYPE.LIVE_AUDIO, "", "");
            assert(livePlayer._mediaPlayer.setSource.calledWith(MediaPlayer.TYPE.LIVE_AUDIO));
        }, config);
    };

    this.LivePlayerSupportLevelPlayableTest.prototype.testGetPlayerElementReturnsPlayerElement = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", "antie/devices/device", "antie/devices/mediaplayer/live/playable"], function (application, MediaPlayer, Device) {
            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();
            var playerElement = "player element";

            this.sandbox.stub(livePlayer._mediaPlayer, 'getPlayerElement').returns(playerElement);

            assertEquals(playerElement, livePlayer.getPlayerElement());
        }, config);
    };
})();
