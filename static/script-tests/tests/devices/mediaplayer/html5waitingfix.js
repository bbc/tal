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
    this.HTML5WaitingFixMediaPlayerTests = AsyncTestCase("HTML5WaitingFixMediaPlayer");

    //---------------
    // Mix in the base HTML5 tests to make sure the sub-modifier doesn't break basic functionality
    //---------------

    this.HTML5MediaPlayerTests.prototype.mixTestsIntoSubModifier(this.HTML5WaitingFixMediaPlayerTests.prototype);
    this.HTML5WaitingFixMediaPlayerTests.prototype.config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/html5waitingfix"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    var stubCreateElementResults;
    var deviceMockingHooks;

    var oldSetUp = this.HTML5WaitingFixMediaPlayerTests.prototype.setUp;
    this.HTML5WaitingFixMediaPlayerTests.prototype.setUp = function(queue) {
        oldSetUp.call(this, queue);
        stubCreateElementResults = this.stubCreateElementResults;
        deviceMockingHooks = this.deviceMockingHooks;
    };

    //-------------
    // Test helpers
    //-------------

    this.HTML5WaitingFixMediaPlayerTests.prototype.toPlaying = function (MediaPlayer) {
        this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
        this._mediaPlayer.playFrom(0);
        deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
        deviceMockingHooks.finishBuffering(this._mediaPlayer);
        deviceMockingHooks.makeOneSecondPass();
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.timeOutToBuffering = function () {
        this._clock.tick(1000);
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.sendTimeUpdateEvent = function () {
        deviceMockingHooks.makeOneSecondPass();
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.assertState = function (state) {
        assertEquals(state, this._mediaPlayer.getState());
    };

    //---------------------
    // HTML5 specific tests
    //---------------------

    this.HTML5WaitingFixMediaPlayerTests.prototype.testWhenNoTimeUpdatesThenGoToBuffering = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(queue, function (MediaPlayer) {
            this.toPlaying(MediaPlayer);
            this.timeOutToBuffering();

            this.assertState(MediaPlayer.STATE.BUFFERING);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testWhenTimeUpdatesWhileBufferingThenGoToPlaying = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(queue, function (MediaPlayer) {
            this.toPlaying(MediaPlayer);

            this.timeOutToBuffering();
            this.sendTimeUpdateEvent();

            this.assertState(MediaPlayer.STATE.PLAYING);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testFrequentTimeUpdatesDoNotGoToBuffering = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function (MediaPlayer) {
            this.toPlaying(MediaPlayer);

            this.assertState(MediaPlayer.STATE.PLAYING);
            this._clock.tick(100);
            this.assertState(MediaPlayer.STATE.PLAYING);

            this.sendTimeUpdateEvent();
            this.assertState(MediaPlayer.STATE.PLAYING);
            this._clock.tick(100);
            this.assertState(MediaPlayer.STATE.PLAYING);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testDoesNotGoToBufferingWhenPaused = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(queue, function (MediaPlayer) {
            this.toPlaying(MediaPlayer);

            this._mediaPlayer.pause();
            this.timeOutToBuffering();

            this.assertState(MediaPlayer.STATE.PAUSED);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testDoesNotGoToBufferingWhenStopped = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(queue, function (MediaPlayer) {
            this.toPlaying(MediaPlayer);

            this._mediaPlayer.stop();
            this.timeOutToBuffering();

            this.assertState(MediaPlayer.STATE.STOPPED);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testDoesNotGoToBufferingWhenComplete = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(queue, function (MediaPlayer) {
            this.toPlaying(MediaPlayer);

            deviceMockingHooks.reachEndOfMedia(MediaPlayer);
            this.timeOutToBuffering();

            this.assertState(MediaPlayer.STATE.COMPLETE);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testDoesNotGoToBufferingWhenError = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(queue, function (MediaPlayer) {
            this.toPlaying(MediaPlayer);

            deviceMockingHooks.emitPlaybackError(MediaPlayer);
            this.timeOutToBuffering();

            this.assertState(MediaPlayer.STATE.ERROR);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testDoesNotGoToBufferingWhenPauseAtStart = function(queue) {
        expectAsserts(1);
        this.runMediaPlayerTest(queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            this._mediaPlayer.pause();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            this.sendTimeUpdateEvent();

            this.timeOutToBuffering();

            this.assertState(MediaPlayer.STATE.PAUSED);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testDeferPauseUntilAfterBuffering = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function (MediaPlayer) {
            this.toPlaying(MediaPlayer);
            this.timeOutToBuffering();

            this._mediaPlayer.pause();
            assert(stubCreateElementResults.video.pause.notCalled);

            this.sendTimeUpdateEvent();
            assert(stubCreateElementResults.video.pause.calledOnce);
            this.assertState(MediaPlayer.STATE.PAUSED);
        });
    };

    this.HTML5WaitingFixMediaPlayerTests.prototype.testDeferPauseThenResume = function(queue) {
        expectAsserts(2);
        this.runMediaPlayerTest(queue, function (MediaPlayer) {
            this.toPlaying(MediaPlayer);
            this.timeOutToBuffering();
            this._mediaPlayer.pause();

            this._mediaPlayer.resume();
            this.sendTimeUpdateEvent();

            assert(stubCreateElementResults.video.pause.notCalled);
            this.assertState(MediaPlayer.STATE.PLAYING);
        });
    };
})();
