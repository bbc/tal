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
    this.CEHTMLMediaPlayerTests = AsyncTestCase("CEHTMLMediaPlayer");

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/cehtml"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    // Setup device specific mocking
    var deviceMockingHooks = {
        setup: function(sandbox, application) {

        },
        sendMetadata: function(mediaPlayer, currentTime, range) {
            mediaPlayer._range = range; // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
            mediaPlayer._currentTime = currentTime; // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        finishBuffering: function(mediaPlayer) {
            mediaPlayer._currentTime = mediaPlayer._targetSeekTime ? mediaPlayer._targetSeekTime : mediaPlayer._currentTime;  // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
            mediaPlayer._onFinishedBuffering(); // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        emitPlaybackError: function(mediaPlayer) {
            mediaPlayer._onDeviceError(); // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        reachEndOfMedia: function(mediaPlayer) {
            mediaPlayer._onEndOfMedia();  // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        startBuffering: function(mediaPlayer) {
            mediaPlayer._onDeviceBuffering();  // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        mockTime: function(mediaplayer) {
            // FIXME - Implementations can use this hook to set up fake timers if required
        },
        makeOneSecondPass: function(mediaplayer, time) {
            mediaplayer._onStatus();  // FIXME - do not do this in an actual implementation - replace it with proper event / setTimeout mock / whatever.
        },
        unmockTime: function(mediaplayer) {
            // FIXME - Implementations can use this hook to tear down fake timers if required
        }
    };

    this.CEHTMLMediaPlayerTests.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.CEHTMLMediaPlayerTests.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    //---------------------
    // Samsung Maple specific tests
    //---------------------

    // TODO: Ensure errors are logged.
    // TODO: Ensure playFrom(...) and play() both clamp to the available range (there's a _getClampedTime helper in the MediaPlayer)

    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all MediaPlayer implementations (last, so it can detect conflicts)
    MixinCommonMediaTests(this.CEHTMLMediaPlayerTests, "antie/devices/mediaplayer/cehtml", config, deviceMockingHooks);

})();
