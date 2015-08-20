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
    this.CEHTMLSeekFinishedEmitEventTests = AsyncTestCase("CEHTMLSeekFinishedEmitEvent");

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/cehtmlseekfinishedemitevent"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};
    var configWithRestartTimeout = {"restartTimeout":10000, "modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/cehtmlseekfinishedemitevent"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    var eventWasFired = function(eventHandler, eventType) {
        for(var i = 0; i < eventHandler.callCount; i++) {
            if(eventHandler.getCall(i).args[0].type === eventType) {
                return true;
            }
        }
        return false;
    };

    var eventNotFired = function(eventHandler, eventType) {
        return !eventWasFired(eventHandler, eventType);
    };

    // ---------------
    // Mix in the base HTML5 tests to make sure the sub-modifier doesn't break basic functionality
    // ---------------
    window.commonTests.mediaPlayer.cehtml.mixinTests(this.CEHTMLSeekFinishedEmitEventTests, "antie/devices/mediaplayer/cehtmlseekfinishedemitevent", config);

    // ---------------
    // Remove tests that are irrelevant for this sub-modifier.
    // ---------------

    // ---------------
    // Additional tests for this sub-modifier.
    // ---------------
    this.CEHTMLSeekFinishedEmitEventTests.prototype.testIfTimeIsInRangeAndHasBeenPlaying5TimesWithNoTimeoutWeFireSeekFinishedEvent = function(queue) {
        expectAsserts(7);
        var self = this;
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);

            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.beginPlaybackFrom(1000);
            self.deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            self.deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assert(eventWasFired(eventHandler, MediaPlayer.EVENT.SEEK_ATTEMPTED));
            for(var i = 0; i < 5; i++) {
                assert(eventNotFired(eventHandler, MediaPlayer.EVENT.SEEK_FINISHED));
                self._clock.tick(500);
                self.fakeCEHTMLObject.playPosition += 500;
                eventHandler.reset();
            }

            self.deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
            assert(eventWasFired(eventHandler, MediaPlayer.EVENT.SEEK_FINISHED));
        });
    };

    this.CEHTMLSeekFinishedEmitEventTests.prototype.testIfWeFiredSeekFinishedEventDoNotFireAnother = function(queue) {
        expectAsserts(8);
        var self = this;
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);

            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.beginPlaybackFrom(1000);
            self.deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            self.deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assert(eventWasFired(eventHandler, MediaPlayer.EVENT.SEEK_ATTEMPTED));
            for(var i = 0; i < 5; i++) {
                assert(eventNotFired(eventHandler, MediaPlayer.EVENT.SEEK_FINISHED));
                self._clock.tick(500);
                self.fakeCEHTMLObject.playPosition += 500;
                eventHandler.reset();
            }

            self.deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
            assert(eventWasFired(eventHandler, MediaPlayer.EVENT.SEEK_FINISHED));
            eventHandler.reset();

            self.deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
            assert(eventNotFired(eventHandler, MediaPlayer.EVENT.SEEK_FINISHED));
        });
    };

    this.CEHTMLSeekFinishedEmitEventTests.prototype.testIfTimeIsInRangeAndHasBeenPlaying5TimesWith10SecondTimeoutWeFireSeekFinishedEvent = function(queue) {
        var self = this;
        expectAsserts(21);
        this.runMediaPlayerTestWithSpecificConfig(this, queue, function (MediaPlayer) {
            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);

            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.beginPlaybackFrom(1000);
            self.deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            self.deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assert(eventWasFired(eventHandler, MediaPlayer.EVENT.SEEK_ATTEMPTED));

            var numberOfLoops = configWithRestartTimeout.restartTimeout/500;
            for(var i = 0; i < numberOfLoops - 1; i++) {
                self._clock.tick(500);
                self.fakeCEHTMLObject.playPosition += 500;
                assert(eventNotFired(eventHandler, MediaPlayer.EVENT.SEEK_FINISHED));
            }

            self.deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
            assert(eventWasFired(eventHandler, MediaPlayer.EVENT.SEEK_FINISHED));
        }, configWithRestartTimeout);
    };
})();
