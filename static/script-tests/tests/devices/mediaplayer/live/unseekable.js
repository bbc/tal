/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
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
    this.LivePlayerSupportLevelUnseekableTest = AsyncTestCase("LivePlayerSupportLevelUnseekableTest");

    this.LivePlayerSupportLevelUnseekableTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.LivePlayerSupportLevelUnseekableTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    this.LivePlayerSupportLevelUnseekableTest.prototype.testGetLiveSupportReturnsUnseekableWithSupportLevelUnseekable = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", "antie/devices/device", "antie/devices/mediaplayer/live/unseekable"], function(application, MediaPlayer, Device) {

            var device = new Device(antie.framework.deviceConfiguration);
            var liveSupportLevel = device.getLiveSupport();

            assertEquals("unseekable", liveSupportLevel);
        });
    };

    var testFunctionsInLivePlayerCallMediaPlayerFunctions = function(action) {
        return function (queue) {
            expectAsserts(1);
            queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", "antie/devices/device", "antie/devices/mediaplayer/live/unseekable"], function(application, MediaPlayer, Device) {
                var device = new Device(antie.framework.deviceConfiguration);
                var livePlayer = device.getLivePlayer();
                device.getMediaPlayer()[action] = this.sandbox.stub();
                livePlayer[action]();
                assert(device.getMediaPlayer()[action].calledOnce);
            }, config);
        }
    };

    this.LivePlayerSupportLevelUnseekableTest.prototype.testLivePlayerBeginPlaybackCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('beginPlayback');

    this.LivePlayerSupportLevelUnseekableTest.prototype.testLivePlayerSetSourceCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('setSource');

    this.LivePlayerSupportLevelUnseekableTest.prototype.testLivePlayerStopCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('stop');

    this.LivePlayerSupportLevelUnseekableTest.prototype.testLivePlayerResetCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('reset');

    this.LivePlayerSupportLevelUnseekableTest.prototype.testLivePlayerGetStateCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('getState');

    this.LivePlayerSupportLevelUnseekableTest.prototype.testLivePlayerGetSourceCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('getSource');

    this.LivePlayerSupportLevelUnseekableTest.prototype.testLivePlayerGetMimeTypeCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('getMimeType');

    this.LivePlayerSupportLevelUnseekableTest.prototype.testLivePlayerAddEventCallbackCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('addEventCallback');

    this.LivePlayerSupportLevelUnseekableTest.prototype.testLivePlayerRemoveEventCallbackCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('removeEventCallback');

    this.LivePlayerSupportLevelUnseekableTest.prototype.testSeekableMediaPlayerFunctionsNotDefinedInUnseekableLive = function (queue) {
        expectAsserts(5);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", "antie/devices/device", "antie/devices/mediaplayer/live/unseekable"], function(application, MediaPlayer, Device) {

            var device = new Device(antie.framework.deviceConfiguration);
            var livePlayer = device.getLivePlayer();

            assertUndefined(livePlayer.playFrom);
            assertUndefined(livePlayer.pause);
            assertUndefined(livePlayer.resume);
            assertUndefined(livePlayer.getCurrentTime);
            assertUndefined(livePlayer.getSeekableRange);
        });
    };
})();
