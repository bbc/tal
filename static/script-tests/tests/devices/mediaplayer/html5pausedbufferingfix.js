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
    // jshint newcap: false
    this.HTML5PausedBufferingFixMediaPlayerTests = AsyncTestCase("HTML5PausedBufferingFixMediaPlayer");



    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/html5pausedbufferingfix"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    this.HTML5PausedBufferingFixMediaPlayerTests.prototype.testBufferingSignalIgnoredWhenPaused = function(queue) {
        expectAsserts(2);
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            this.deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            this.deviceMockingHooks.finishBuffering(this._mediaPlayer);
            this._mediaPlayer.pause();

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            this.deviceMockingHooks.startBuffering(this._mediaPlayer);

            assert(eventHandler.notCalled);
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
        });
    };
    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all HTML5 MediaPlayer implementations (last, so it can detect conflicts)

    window.commonTests.mediaPlayer.html5.mixinTests(this.HTML5PausedBufferingFixMediaPlayerTests, "antie/devices/mediaplayer/html5pausedbufferingfix", config);
    // ********************
    // Removal of common tests that are in direct conflict with the purpose of this device sub-modifier
    // ********************

    delete HTML5PausedBufferingFixMediaPlayerTests.prototype.testMediaElementResumesWhenBufferingCompleteIfWeHaveCalledResumeWhileBufferingDuringThePausedState;


})();