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

// Mix-in a set of common MediaPlayer tests. These tests test the common API behaviour, and so are valid for ALL implementations.
// It isup to the device implementation test code that pulls these in to make sure that sufficient mocking is in place to allow these tests to run.
window.mixinCommonMediaTests = function (testCase, mediaPlayerDeviceModifierRequireName, config, deviceMockingHooks) {
    var mixins = {};

    // ********************************************
    // ********* Device overriding tests **********
    // ********************************************

    mixins.testGettingMediaPlayerGivesDeviceVersionWhenModifierProvider = function (queue) {
        expectAsserts(1);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', [mediaPlayerDeviceModifierRequireName],
            function(application, MediaPlayerImpl) {

                deviceMockingHooks.setup(self.sandbox, application);

                var device = application.getDevice();
                var instance = device.getMediaPlayer();

                assertInstanceOf(MediaPlayerImpl, instance);
            }, config);
    };

    mixins.testGettingMediaPlayerRepeatedlyReturnsSameObject = function (queue) {
        expectAsserts(1);
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', [mediaPlayerDeviceModifierRequireName],
            function(application, MediaPlayerImpl) {

                deviceMockingHooks.setup(self.sandbox, application);

                var device = application.getDevice();
                var instance = device.getMediaPlayer();
                var instance2 = device.getMediaPlayer();

                assertSame(instance, instance2);

            }, config);
    };

    // *******************************************************
    // *************** Test-generating methods ***************
    // *********** (See end of file for actual tests) ********
    // *******************************************************


    var doTest = function (self, queue, test) {
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", mediaPlayerDeviceModifierRequireName],
            function(application, MediaPlayer, MediaPlayerImpl) {

                deviceMockingHooks.setup(self.sandbox, application);

                self.device = application.getDevice();
                self._mediaPlayer = self.device.getMediaPlayer();

                self.eventCallback = self.sandbox.stub();
                self._mediaPlayer.addEventCallback(null, self.eventCallback);

                test.call(self, MediaPlayer);
            }, config);
    };

    var assertLatestEvent = function (self, expectedEventData) {
        assert(self.eventCallback.called);
        var actualEventData = self.eventCallback.lastCall.args[0];
        for (var name in expectedEventData) {
            if (expectedEventData.hasOwnProperty(name)) {
                assertEquals(expectedEventData[name], actualEventData[name]);
            }
        }
    };

    var assertMediaPlayerError = function (self, MediaPlayer) {
        assertEquals(MediaPlayer.STATE.ERROR, self._mediaPlayer.getState());
        assertLatestEvent(self, {
            state: MediaPlayer.STATE.ERROR,
            currentTime: undefined,
            range: undefined,
            url: undefined,
            mimeType: undefined,
            type: MediaPlayer.EVENT.ERROR
        });
    };

    var assertBuffering = function (self, MediaPlayer, postBufferingState) {
        assertEquals(MediaPlayer.STATE.BUFFERING, self._mediaPlayer.getState());
        assertLatestEvent(self, {
            state: MediaPlayer.STATE.BUFFERING,
            // Availability of range/currentTime at this point is device-specific.
            url: "testUrl",
            mimeType: "testMimeType",
            type: MediaPlayer.EVENT.BUFFERING
        });
        deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
        deviceMockingHooks.finishBuffering(self._mediaPlayer);
        assertEquals(postBufferingState, self._mediaPlayer.getState());
    };

    var makeGetMethodReturnsUndefinedTest = function (setup, apiCall) {
        return makeGetMethodReturnsExpectedValueTest(setup, apiCall, undefined);
    };

    var makeGetMethodReturnsExpectedValueTest = function (setup, apiCall, expected) {
        var test = function (queue) {
            expectAsserts(2);
            doTest(this, queue, function (MediaPlayer) {
                setup.call(this, MediaPlayer);
                assertEquals(expected, this._mediaPlayer[apiCall]());
            });
        };
        test.bind(testCase);
        return test;
    };

    var makeApiCallCausesErrorTest = function (setup, apiCall) {
        var test = function (queue) {
            expectAsserts(9);
            doTest(this, queue, function (MediaPlayer) {
                setup.call(this, MediaPlayer);
                this._mediaPlayer[apiCall]();
                assertMediaPlayerError(this, MediaPlayer);
            });
        };
        test.bind(testCase);
        return test;
    };


    // *******************************************
    // ********* EMPTY state tests ***************
    // *******************************************

    var getToEmptyState = function (MediaPlayer) {
        assertEquals(MediaPlayer.STATE.EMPTY, this._mediaPlayer.getState());
    };

    mixins.testMediaPlayerStartsInEmptyState = function (queue) {
        expectAsserts(1);
        doTest(this, queue, function (MediaPlayer) {
            assertEquals(MediaPlayer.STATE.EMPTY, this._mediaPlayer.getState());
        });
    };

    mixins.testGetSourceReturnsUndefinedInEmptyState = makeGetMethodReturnsUndefinedTest(getToEmptyState, "getSource");
    mixins.testGetMimeTypeReturnsUndefinedInEmptyState = makeGetMethodReturnsUndefinedTest(getToEmptyState, "getMimeType");
    mixins.testGetCurrentTimeReturnsUndefinedInEmptyState = makeGetMethodReturnsUndefinedTest(getToEmptyState, "getCurrentTime");
    mixins.testGetRangeReturnsUndefinedInEmptyState = makeGetMethodReturnsUndefinedTest(getToEmptyState, "getRange");

    mixins.testCallingPlayFromInEmptyStateIsAnError = makeApiCallCausesErrorTest(getToEmptyState, "playFrom");
    mixins.testCallingPauseInEmptyStateIsAnError = makeApiCallCausesErrorTest(getToEmptyState, "pause");
    mixins.testCallingResumeInEmptyStateIsAnError = makeApiCallCausesErrorTest(getToEmptyState, "resume");
    mixins.testCallingStopInEmptyStateIsAnError = makeApiCallCausesErrorTest(getToEmptyState, "stop");
    mixins.testCallingResetInEmptyStateIsAnError = makeApiCallCausesErrorTest(getToEmptyState, "reset");

    mixins.testCallingSetSourceInEmptyStateGoesToStoppedState = function (queue) {
        expectAsserts(9);
        doTest(this, queue, function (MediaPlayer) {
            getToEmptyState.call(this, MediaPlayer);
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.STOPPED,
                currentTime: undefined,
                range: undefined,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.STOPPED
            });
        });
    };


    // *******************************************
    // ********* STOPPED state tests *************
    // *******************************************

    var getToStoppedState = function (MediaPlayer) {
        this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
        assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
    };

    mixins.testGetSourceReturnsUndefinedInStoppedState = makeGetMethodReturnsExpectedValueTest(getToStoppedState, "getSource", "testUrl");
    mixins.testGetMimeTypeReturnsUndefinedInStoppedState = makeGetMethodReturnsExpectedValueTest(getToStoppedState, "getMimeType", "testMimeType");

    mixins.testGetCurrentTimeReturnsUndefinedInStoppedState = makeGetMethodReturnsUndefinedTest(getToStoppedState, "getCurrentTime");
    mixins.testGetRangeReturnsUndefinedInStoppedState = makeGetMethodReturnsUndefinedTest(getToStoppedState, "getRange");

    mixins.testCallingSetSourceInStoppedStateIsAnError = makeApiCallCausesErrorTest(getToStoppedState, "setSource");
    mixins.testCallingPauseInStoppedStateIsAnError = makeApiCallCausesErrorTest(getToStoppedState, "pause");
    mixins.testCallingStopInStoppedStateIsAnError = makeApiCallCausesErrorTest(getToStoppedState, "stop");
    mixins.testCallingResumeInStoppedStateIsAnError = makeApiCallCausesErrorTest(getToStoppedState, "resume");

    mixins.testCallingResetInStoppedStateGoesToEmptyState = function (queue) {
        expectAsserts(4);
        doTest(this, queue, function (MediaPlayer) {
            getToStoppedState.call(this, MediaPlayer);
            this._mediaPlayer.reset();
            assertEquals(MediaPlayer.STATE.EMPTY, this._mediaPlayer.getState());
            assertEquals(undefined, this._mediaPlayer.getSource());
            assertEquals(undefined, this._mediaPlayer.getMimeType());
        });
    };

    mixins.testCallingPlayFromInStoppedStateGoesToBufferingState = function (queue) {
        expectAsserts(8);
        doTest(this, queue, function (MediaPlayer) {
            getToStoppedState.call(this, MediaPlayer);
            this._mediaPlayer.playFrom(0);
            assertBuffering(this, MediaPlayer, MediaPlayer.STATE.PLAYING);
        });
    };

    // *******************************************
    // ********* BUFFERING state tests ***********
    // *******************************************

    var getToBufferingState = function (MediaPlayer) {
        this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
        this._mediaPlayer.playFrom(0);
        assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
    };

    mixins.testGetSourceReturnsExpectedValueInBufferingState = makeGetMethodReturnsExpectedValueTest(getToBufferingState, "getSource", "testUrl");
    mixins.testGetMimeTypeReturnsExpectedValueInBufferingState = makeGetMethodReturnsExpectedValueTest(getToBufferingState, "getMimeType", "testMimeType");

    // Availability of getCurrentTime() and getRange() are device-specific at this point.

    mixins.testCallingSetSourceInBufferingStateIsAnError = makeApiCallCausesErrorTest(getToBufferingState, "setSource");
    mixins.testCallingResetInBufferingStateIsAnError = makeApiCallCausesErrorTest(getToBufferingState, "reset");

    mixins.testWhenBufferingFinishesAndNoFurtherApiCallsThenWeGoToPlayingState = function (queue) {
        expectAsserts(9);
        doTest(this, queue, function (MediaPlayer) {
            getToBufferingState.call(this, MediaPlayer);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.PLAYING,
                currentTime: 0,
                range: { start: 0, end: 100 },
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.PLAYING
            });
        });
    };

    mixins.testWhenPauseCalledAndBufferingFinishesThenWeGoToPausedState = function (queue) {
        expectAsserts(10);
        doTest(this, queue, function (MediaPlayer) {
            getToBufferingState.call(this, MediaPlayer);
            this._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.PAUSED,
                currentTime: 0,
                range: { start: 0, end: 100 },
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.PAUSED
            });
        });
    };


    mixins.testWhenPauseThenResumeCalledBeforeBufferingFinishesThenWeGoToPlayingState = function (queue) {
        expectAsserts(10);
        doTest(this, queue, function (MediaPlayer) {
            getToBufferingState.call(this, MediaPlayer);
            this._mediaPlayer.pause();
            this._mediaPlayer.resume();
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.PLAYING,
                currentTime: 0,
                range: { start: 0, end: 100 },
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.PLAYING
            });
        });
    };

    mixins.testWhenPlayFromMiddleOfMediaAndBufferingFinishesThenWeGoToPlayingFromSpecifiedPoint = function (queue) {
        expectAsserts(9);
        doTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(50);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.PLAYING,
                currentTime: 50,
                range: { start: 0, end: 100 },
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.PLAYING
            });
        });
    };

    mixins.testCallingStopInBufferingStateGoesToStoppedState = function (queue) {
        expectAsserts(9);
        doTest(this, queue, function (MediaPlayer) {
            getToBufferingState.call(this, MediaPlayer);
            this._mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.STOPPED,
                currentTime: undefined,
                range: undefined,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.STOPPED
            });
        });
    };

    // *******************************************
    // ********* PLAYING state tests *************
    // *******************************************

    var getToPlayingState = function (MediaPlayer) {
        this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
        this._mediaPlayer.playFrom(0);
        deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
        deviceMockingHooks.finishBuffering(this._mediaPlayer);
        assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
    };

    mixins.testGetSourceReturnsExpectedValueInPlayingState = makeGetMethodReturnsExpectedValueTest(getToPlayingState, "getSource", "testUrl");
    mixins.testGetMimeTypeReturnsExpectedValueInPlayingState = makeGetMethodReturnsExpectedValueTest(getToPlayingState, "getMimeType", "testMimeType");
    mixins.testGetCurrentTimeReturnsExpectedValueInPlayingState = makeGetMethodReturnsExpectedValueTest(getToPlayingState, "getCurrentTime", 0);
    mixins.testGetRangeReturnsExpectedValueInPlayingState = makeGetMethodReturnsExpectedValueTest(getToPlayingState, "getRange", { start: 0, end: 100 });

    mixins.testCallingSetSourceInPlayingStateIsAnError = makeApiCallCausesErrorTest(getToPlayingState, "setSource");
    mixins.testCallingResetInPlayingStateIsAnError = makeApiCallCausesErrorTest(getToPlayingState, "reset");

    mixins.testWhenCallResumeWhileAlreadyPlayingThenRemainInPlayState = function (queue) {
        expectAsserts(3);
        doTest(this, queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            var originalCount = this.eventCallback.callCount;
            this._mediaPlayer.resume();
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            assertEquals(originalCount, this.eventCallback.callCount);
        });
    };

    mixins.testWhenCallPlayFromWhilePlayingGoesToBufferingState = function (queue) {
        expectAsserts(8);
        doTest(this, queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            this._mediaPlayer.playFrom(90);
            assertBuffering(this, MediaPlayer, MediaPlayer.STATE.PLAYING);
        });
    };

    mixins.testWhenCallingPauseWhilePlayingGoesToPausedState = function (queue) {
        expectAsserts(9);
        doTest(this, queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            this._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.PAUSED,
                currentTime: 0,
                range: { start: 0, end: 100 },
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.PAUSED
            });
        });
    };

    mixins.testWhenCallingStopWhilePlayingGoesToStoppedState = function (queue) {
        expectAsserts(9);
        doTest(this, queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            this._mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.STOPPED,
                currentTime: undefined,
                range: undefined,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.STOPPED
            });
        });
    };

    mixins.testWhenPlaybackErrorOccursWhilePlayingThenGoesToErrorState = function (queue) {
        expectAsserts(9);
        doTest(this, queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            deviceMockingHooks.emitPlaybackError(this._mediaPlayer);
            assertMediaPlayerError(this, MediaPlayer);
        });
    };

    mixins.testWhenMediaFinishesWhenPlayingThenGoesToCompleteState = function (queue) {
        expectAsserts(8);
        doTest(this, queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);
            assertEquals(MediaPlayer.STATE.COMPLETE, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.COMPLETE,
                // Availability of currentTime at this point is device-specific.
                range: { start: 0, end: 100 },
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.COMPLETE
            });
        });
    };

    mixins.testWhenBufferingStartsWhilePlayingGoesToBufferingState = function (queue) {
        expectAsserts(10);
        doTest(this, queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            deviceMockingHooks.startBuffering(this._mediaPlayer);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.BUFFERING,
                currentTime: 0,
                range: { start: 0, end: 100 },
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.BUFFERING
            });
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
        });
    };

    mixins.testGetRegularStatusEventWhenPlaying = function (queue) {
        expectAsserts(8);
        doTest(this, queue, function (MediaPlayer) {
            deviceMockingHooks.mockTime(this._mediaPlayer);
            getToPlayingState.call(this, MediaPlayer);
            var originalCount = this.eventCallback.callCount;
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.PLAYING,
                // Cannot test current time as it will be updating
                range: { start: 0, end: 100 },
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.STATUS
            });
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            assert(this.eventCallback.callCount - originalCount >= 3); // Three seconds so must have had at least three status messages
            deviceMockingHooks.unmockTime(this._mediaPlayer);
        });
    };

    // *******************************************
    // ********* PAUSED state tests **************
    // *******************************************

    var getToPausedState = function (MediaPlayer) {
        this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
        this._mediaPlayer.playFrom(0);
        this._mediaPlayer.pause();
        deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
        deviceMockingHooks.finishBuffering(this._mediaPlayer);
        assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
    };

    mixins.testGetSourceReturnsExpectedValueInPausedState = makeGetMethodReturnsExpectedValueTest(getToPausedState, "getSource", "testUrl");
    mixins.testGetMimeTypeReturnsExpectedValueInPausedState = makeGetMethodReturnsExpectedValueTest(getToPausedState, "getMimeType", "testMimeType");
    mixins.testGetCurrentTimeReturnsExpectedValueInPausedState = makeGetMethodReturnsExpectedValueTest(getToPausedState, "getCurrentTime", 0);
    mixins.testGetRangeReturnsExpectedValueInPausedState = makeGetMethodReturnsExpectedValueTest(getToPausedState, "getRange", { start: 0, end: 100 });

    mixins.testCallingSetSourceInPausedStateIsAnError = makeApiCallCausesErrorTest(getToPausedState, "setSource");
    mixins.testCallingResetInPausedStateIsAnError = makeApiCallCausesErrorTest(getToPausedState, "reset");

    mixins.testWhenCallingResumeWhilePausedGoesToPlayingState = function (queue) {
        expectAsserts(9);
        doTest(this, queue, function (MediaPlayer) {
            getToPausedState.call(this, MediaPlayer);
            this._mediaPlayer.resume();
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.PLAYING,
                currentTime: 0,
                range: { start: 0, end: 100 },
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.PLAYING
            });
        });
    };

    mixins.testWhenCallPlayFromWhilePausedGoesToBufferingState = function (queue) {
        expectAsserts(8);
        doTest(this, queue, function (MediaPlayer) {
            getToPausedState.call(this, MediaPlayer);
            this._mediaPlayer.playFrom(90);
            assertBuffering(this, MediaPlayer, MediaPlayer.STATE.PLAYING);
        });
    };

    mixins.testWhenCallPauseWhileAlreadyPausedThenRemainInPausedState = function (queue) {
        expectAsserts(3);
        doTest(this, queue, function (MediaPlayer) {
            getToPausedState.call(this, MediaPlayer);
            var originalCount = this.eventCallback.callCount;
            this._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assertEquals(originalCount, this.eventCallback.callCount);
        });
    };

    mixins.testWhenCallingStopWhilePausedGoesToStoppedState = function (queue) {
        expectAsserts(9);
        doTest(this, queue, function (MediaPlayer) {
            getToPausedState.call(this, MediaPlayer);
            this._mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.STOPPED,
                currentTime: undefined,
                range: undefined,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.STOPPED
            });
        });
    };

    // *******************************************
    // ********* COMPLETE state tests ************
    // *******************************************

    var  getToCompleteState = function (MediaPlayer) {
        this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
        this._mediaPlayer.playFrom(0);
        deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
        deviceMockingHooks.finishBuffering(this._mediaPlayer);
        deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);
        assertEquals(MediaPlayer.STATE.COMPLETE, this._mediaPlayer.getState());
    };

    mixins.testGetSourceReturnsExpectedValueInCompleteState = makeGetMethodReturnsExpectedValueTest(getToCompleteState, "getSource", "testUrl");
    mixins.testGetMimeTypeReturnsExpectedValueInCompleteState = makeGetMethodReturnsExpectedValueTest(getToCompleteState, "getMimeType", "testMimeType");
    mixins.testGetRangeReturnsExpectedValueInCompleteState = makeGetMethodReturnsExpectedValueTest(getToCompleteState, "getRange", { start: 0, end: 100 });

    // Availability of getCurrentTime() is device-specific at this point.

    mixins.testCallingSetSourceInCompleteStateIsAnError = makeApiCallCausesErrorTest(getToCompleteState, "setSource");
    mixins.testCallingPauseInCompleteStateIsAnError = makeApiCallCausesErrorTest(getToCompleteState, "pause");
    mixins.testCallingResumeInCompleteStateIsAnError = makeApiCallCausesErrorTest(getToCompleteState, "resume");
    mixins.testCallingResetInCompleteStateIsAnError = makeApiCallCausesErrorTest(getToCompleteState, "reset");

    mixins.testWhenCallPlayFromWhileCompleteGoesToBufferingState = function (queue) {
        expectAsserts(8);
        doTest(this, queue, function (MediaPlayer) {
            getToCompleteState.call(this, MediaPlayer);
            this._mediaPlayer.playFrom(90);
            assertBuffering(this, MediaPlayer, MediaPlayer.STATE.PLAYING);
        });
    };

    mixins.testCallingStopInCompleteStateGoesToStoppedState = function (queue) {
        expectAsserts(9);
        doTest(this, queue, function (MediaPlayer) {
            getToCompleteState.call(this, MediaPlayer);
            this._mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.STOPPED,
                currentTime: undefined,
                range: undefined,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.STOPPED
            });
        });
    };

    // *******************************************
    // ********* ERROR state tests ***************
    // *******************************************

    var getToErrorState = function (MediaPlayer) {
        this._mediaPlayer.stop();
        assertEquals(MediaPlayer.STATE.ERROR, this._mediaPlayer.getState());
    };

    mixins.testGetSourceReturnsUndefinedInErrorState = makeGetMethodReturnsUndefinedTest(getToErrorState, "getSource");
    mixins.testGetMimeTypeReturnsUndefinedInErrorState = makeGetMethodReturnsUndefinedTest(getToErrorState, "getMimeType");
    mixins.testGetCurrentTimeReturnsUndefinedInErrorState = makeGetMethodReturnsUndefinedTest(getToErrorState, "getCurrentTime");
    mixins.testGetRangeReturnsUndefinedInErrorState = makeGetMethodReturnsUndefinedTest(getToErrorState, "getRange");

    mixins.testCallingSetSourceInErrorStateIsAnError = makeApiCallCausesErrorTest(getToErrorState, "setSource");
    mixins.testCallingPlayFromInErrorStateIsAnError = makeApiCallCausesErrorTest(getToErrorState, "playFrom");
    mixins.testCallingPauseInErrorStateIsAnError = makeApiCallCausesErrorTest(getToErrorState, "pause");
    mixins.testCallingResumeInErrorStateIsAnError = makeApiCallCausesErrorTest(getToErrorState, "resume");
    mixins.testCallingStopInErrorStateIsAnError = makeApiCallCausesErrorTest(getToErrorState, "stop");

    mixins.testCallingResetInErrorStateGoesToEmptyState = function (queue) {
        expectAsserts(2);
        doTest(this, queue, function (MediaPlayer) {
            getToErrorState.call(this, MediaPlayer);
            this._mediaPlayer.reset();
            assertEquals(MediaPlayer.STATE.EMPTY, this._mediaPlayer.getState());
        });
    };

    mixins.testWhenBufferingFinishesDuringErrorWeContinueToBeInError = function (queue) {
        expectAsserts(3);
        doTest(this, queue, function (MediaPlayer) {
            getToBufferingState.call(this, MediaPlayer);
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "myURL", "mime/type");
            assertEquals(MediaPlayer.STATE.ERROR, this._mediaPlayer.getState());
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assertEquals(MediaPlayer.STATE.ERROR, this._mediaPlayer.getState());
        });
    };

    // *******************************************
    // ***** Error logged for invalid state ******
    // *********** transitions tests *************
    // *******************************************

    var makeStandardErrorWhileMakingCallInEmptyAndErrorStatesIsLoggedTest = function(method, args) {
        return function(queue) {
            expectAsserts(2);
            doTest(this, queue, function (MediaPlayer) {
                var errorStub = this.sandbox.stub();
                this.sandbox.stub(this.device, "getLogger").returns({error: errorStub});
                this._mediaPlayer[method].apply(this._mediaPlayer, args);
                assert(errorStub.calledWith("Cannot " + method + " while in the 'EMPTY' state"));
                this._mediaPlayer[method].apply(this._mediaPlayer, args);
                assert(errorStub.calledWith("Cannot " + method + " while in the 'ERROR' state"));
            });
        };
    };

    mixins.testErrorWhilePlayingFromInInvalidStateIsLogged = makeStandardErrorWhileMakingCallInEmptyAndErrorStatesIsLoggedTest("playFrom", [0]);

    mixins.testErrorWhilePausingInInvalidStateIsLogged = makeStandardErrorWhileMakingCallInEmptyAndErrorStatesIsLoggedTest("pause");

    mixins.testErrorWhilePlayingInInvalidStateIsLogged = makeStandardErrorWhileMakingCallInEmptyAndErrorStatesIsLoggedTest("resume");

    mixins.testErrorWhileStoppingInInvalidStateIsLogged = makeStandardErrorWhileMakingCallInEmptyAndErrorStatesIsLoggedTest("stop");

    mixins.testErrorWhileSettingSourceInInvalidStateIsLogged = function(queue) {
        expectAsserts(1);
        doTest(this, queue, function (MediaPlayer) {
            var errorStub = this.sandbox.stub();
            this.sandbox.stub(this.device, "getLogger").returns({error: errorStub});
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assert(errorStub.calledWith("Cannot set source unless in the 'EMPTY' state"));
        });
    };

    mixins.testErrorWhileResettingInInvalidStateIsLogged = function(queue) {
        expectAsserts(1);
        doTest(this, queue, function (MediaPlayer) {
            var errorStub = this.sandbox.stub();
            this.sandbox.stub(this.device, "getLogger").returns({error: errorStub});
            this._mediaPlayer.reset();
            assert(errorStub.calledWith("Cannot reset while in the 'EMPTY' state"));
        });
    };

    // *******************************************
    // ********* Mixin the functions *************
    // *******************************************

    // Make sure we don't mix in over the top of an existing function!
    for (var name in mixins) {
        if (mixins.hasOwnProperty(name)) {
            if (testCase.prototype[name]) {
                throw "Trying to mixin '"+name+"' but that already exists!";
            }
            testCase.prototype[name] = mixins[name];
        }
    };
 };