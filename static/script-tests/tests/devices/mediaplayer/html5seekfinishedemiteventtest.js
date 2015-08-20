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
    this.HTML5SeekFinishedEmitEventTests = AsyncTestCase("HTML5SeekFinishedEmitEvent");

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/html5seekfinishedemitevent"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};
    var configWithRestartTimeout = {"restartTimeout":10000, "modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/html5seekfinishedemitevent"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    var eventWasFired = function(self, eventType) {
        for(var i = 0; i < self._eventCallback.args.length; i++) {
            if(eventType === self._eventCallback.args[i][0].type) {
                return true;
            }
        }
        return false;
    };

    var eventNotFired = function(self, eventType) {
        return !eventWasFired(self, eventType);
    };

    // ---------------
    // Mix in the base HTML5 tests to make sure the sub-modifier doesn't break basic functionality
    // ---------------
    window.commonTests.mediaPlayer.html5.mixinTests(this.HTML5SeekFinishedEmitEventTests, "antie/devices/mediaplayer/html5seekfinishedemitevent", config);

    // ---------------
    // Remove tests that are irrelevant for this sub-modifier.
    // ---------------

    // ---------------
    // Additional tests for this sub-modifier.
    // ---------------

    var getToPlaying = function(self, MediaPlayer) {
        self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
        self._mediaPlayer.beginPlaybackFrom(0);
        self.deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
        self.deviceMockingHooks.finishBuffering(self._mediaPlayer);
    };

    this.HTML5SeekFinishedEmitEventTests.prototype.testIfTimeIsInRangeAndHasBeenPlaying5TimesWithNoTimeoutWeFireSeekFinishedEvent = function(queue) {
        var self = this;
        expectAsserts(7);
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer);

            assert(eventWasFired(self, MediaPlayer.EVENT.SEEK_ATTEMPTED));
            for(var i = 0; i < 5; i++) {
                self.deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
                assert(eventNotFired(self, MediaPlayer.EVENT.SEEK_FINISHED));
                self._clock.tick(1000);
                self.stubCreateElementResults.video.currentTime += 1;
                self._eventCallback.reset();
            }

            self.deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
            assert(eventWasFired(self, MediaPlayer.EVENT.SEEK_FINISHED));
        });
    };

    this.HTML5SeekFinishedEmitEventTests.prototype.testWeAlreadyFiredSeekFinishedEventDoNotFireAnother = function(queue) {
        var self = this;
        expectAsserts(8);
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer);

            assert(eventWasFired(self, MediaPlayer.EVENT.SEEK_ATTEMPTED));
            for(var i = 0; i < 5; i++) {
                self.deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
                assert(eventNotFired(self, MediaPlayer.EVENT.SEEK_FINISHED));
                self._clock.tick(1000);
                self.stubCreateElementResults.video.currentTime += 1;
                self._eventCallback.reset();
            }

            self.deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
            assert(eventWasFired(self, MediaPlayer.EVENT.SEEK_FINISHED));

            self._eventCallback.reset();
            self.deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
            assert(eventNotFired(self, MediaPlayer.EVENT.SEEK_FINISHED));
        });
    };

    this.HTML5SeekFinishedEmitEventTests.prototype.testIfTimeIsInRangeAndHasBeenPlaying5TimesWith10SecondTimeoutWeFireSeekFinishedEvent = function(queue) {
        var self = this;
        expectAsserts(12);
        this.runMediaPlayerTestWithSpecificConfig(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer);

            assert(eventWasFired(self, MediaPlayer.EVENT.SEEK_ATTEMPTED));
            for(var i = 0; i < 10; i++) {
                self.deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
                self._clock.tick(1000);
                self.stubCreateElementResults.video.currentTime += 1;
                assert(eventNotFired(self, MediaPlayer.EVENT.SEEK_FINISHED));
                self._eventCallback.reset();
            }

            self.deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
            self._clock.tick(1000);
            assert(eventWasFired(self, MediaPlayer.EVENT.SEEK_FINISHED));
        }, configWithRestartTimeout);
    };
})();
