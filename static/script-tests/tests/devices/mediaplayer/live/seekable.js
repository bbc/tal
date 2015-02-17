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

    var testFunctionsInLivePlayerCallMediaPlayerFunctions = function(action) {
        return function (queue) {
            expectAsserts(1);
            queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", "antie/devices/device", "antie/devices/mediaplayer/live/seekable"], function(application, MediaPlayer, Device) {
                var device = new Device(antie.framework.deviceConfiguration);
                var livePlayer = device.getLivePlayer();
                device.getMediaPlayer()[action] = this.sandbox.stub();
                livePlayer[action]();
                assert(device.getMediaPlayer()[action].calledOnce);
            }, config);
        }
    };

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerSetSourceCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('setSource');

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerBeginPlaybackCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('beginPlayback');

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerStopCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('stop');

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerResetCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('reset');

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerGetStateCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('getState');

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerGetSourceCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('getSource');

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerGetMimeTypeCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('getMimeType');

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerAddEventCallbackCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('addEventCallback');

    this.LivePlayerSupportLevelSeekableTest.prototype.testSeekableLivePlayerRemoveEventCallbackCallsFunctionInMediaElement = testFunctionsInLivePlayerCallMediaPlayerFunctions('removeEventCallback');
})();
