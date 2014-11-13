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
    this.HTML5WaitingFixMediaPlayerTests = AsyncTestCase("HTML5WaitingFixMediaPlayer");



    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/html5waitingfix"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    //-------------
    // Test helpers
    //-------------

    var toPlaying = function (self, MediaPlayer) {
        self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
        self._mediaPlayer.playFrom(0);
        self.deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
        self.deviceMockingHooks.finishBuffering(self._mediaPlayer);
        self.deviceMockingHooks.makeOneSecondPass();
    };

    var timeOutToBuffering = function (self) {
        self._clock.tick(1000);
    };

    var sendTimeUpdateEvent = function (self) {
        self.deviceMockingHooks.makeOneSecondPass();
    };

    var assertState = function (self, state) {
        assertEquals(state, self._mediaPlayer.getState());
    };

    //---------------------
    // HTML5 specific tests
    //---------------------

    this.HTML5WaitingFixMediaPlayerTests.prototype.testWhenNoTimeUpdatesThenGoToBuffering = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            toPlaying(this, MediaPlayer);
            timeOutToBuffering(this);

            assertState(this, MediaPlayer.STATE.BUFFERING);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testWhenTimeUpdatesWhileBufferingThenGoToPlaying = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            toPlaying(this, MediaPlayer);

            timeOutToBuffering(this);
            sendTimeUpdateEvent(this);

            assertState(this, MediaPlayer.STATE.PLAYING);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testFrequentTimeUpdatesDoNotGoToBuffering = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            toPlaying(this, MediaPlayer);

            assertState(this, MediaPlayer.STATE.PLAYING);
            this._clock.tick(100);
            assertState(this, MediaPlayer.STATE.PLAYING);

            sendTimeUpdateEvent(this);
            assertState(this, MediaPlayer.STATE.PLAYING);
            this._clock.tick(100);
            assertState(this, MediaPlayer.STATE.PLAYING);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testDoesNotGoToBufferingWhenPaused = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            toPlaying(this, MediaPlayer);

            this._mediaPlayer.pause();
            timeOutToBuffering(this);

            assertState(this, MediaPlayer.STATE.PAUSED);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testDoesNotGoToBufferingWhenStopped = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            toPlaying(this, MediaPlayer);

            this._mediaPlayer.stop();
            timeOutToBuffering(this);

            assertState(this, MediaPlayer.STATE.STOPPED);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testDoesNotGoToBufferingWhenComplete = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            toPlaying(this, MediaPlayer);

            this.deviceMockingHooks.reachEndOfMedia(MediaPlayer);
            timeOutToBuffering(this);

            assertState(this, MediaPlayer.STATE.COMPLETE);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testDoesNotGoToBufferingWhenPauseAtStart = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            this._mediaPlayer.pause();
            this.deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            this.deviceMockingHooks.finishBuffering(this._mediaPlayer);
            sendTimeUpdateEvent(this);

            timeOutToBuffering(this);

            assertState(this, MediaPlayer.STATE.PAUSED);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testDeferPauseUntilAfterBuffering = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            toPlaying(this, MediaPlayer);
            timeOutToBuffering(this);

            this._mediaPlayer.pause();
            assert(this.stubCreateElementResults.video.pause.notCalled);

            sendTimeUpdateEvent(this);
            assert(this.stubCreateElementResults.video.pause.calledOnce);
            assertState(this, MediaPlayer.STATE.PAUSED);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testDeferPauseThenResume = function(queue) {
        expectAsserts(2);
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            toPlaying(this, MediaPlayer);
            timeOutToBuffering(this);
            this._mediaPlayer.pause();

            this._mediaPlayer.resume();
            sendTimeUpdateEvent(this);

            assert(this.stubCreateElementResults.video.pause.notCalled);
            assertState(this, MediaPlayer.STATE.PLAYING);
        });
    };

    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all HTML5 MediaPlayer implementations (last, so it can detect conflicts)

    window.commonTests.mediaPlayer.html5.mixinTests(this.HTML5WaitingFixMediaPlayerTests, "antie/devices/mediaplayer/html5waitingfix", config);

})();
