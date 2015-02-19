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
    this.LivePlayerSupportLevelSeekableTest = AsyncTestCase("LivePlayerSupportLevelSeekableTest");

    this.LivePlayerSupportLevelSeekableTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    this.LivePlayerSupportLevelSeekableTest.prototype.testGetLiveSupportReturnsSeekableWithSupportLevelSeekable = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", "antie/devices/device", "antie/devices/mediaplayer/live/seekable"], function(application, MediaPlayer, Device) {

            var device = new Device(antie.framework.deviceConfiguration);
            var liveSupportLevel = device.getLiveSupport();

            assertEquals("seekable", liveSupportLevel);
        });
    };

    var testFunctionsInLivePlayerCallMediaPlayerFunctions = function(action, expectedArgCount) {
        return function (queue) {
            expectAsserts(2);
            queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", "antie/devices/device", "antie/devices/mediaplayer/live/seekable"], function(application, MediaPlayer, Device) {
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

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerSetSourceCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('setSource', 3);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerBeginPlaybackCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('beginPlayback', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerStopCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('stop', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerResetCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('reset', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerGetStateCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getState', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerGetSourceCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getSource', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerGetMimeTypeCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getMimeType', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerAddEventCallbackCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('addEventCallback', 2);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerRemoveEventCallbackCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('removeEventCallback', 2);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerRemoveAllEventCallbacksCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('removeAllEventCallbacks', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerPlayFromCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('playFrom', 1);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerPauseCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('pause', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerResumeCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('resume', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerGetCurrentTimeCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getCurrentTime', 0);

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerGetSeekableRangeCallsFunctionInMediaPlayer = testFunctionsInLivePlayerCallMediaPlayerFunctions('getSeekableRange', 0);
})();
