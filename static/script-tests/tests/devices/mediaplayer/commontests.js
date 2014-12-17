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

window.commonTests = window.commonTests || { };
window.commonTests.mediaPlayer = window.commonTests.mediaPlayer || { };
window.commonTests.mediaPlayer.all = window.commonTests.mediaPlayer.all || { };

// Mix-in a set of common MediaPlayer tests. These tests test the common API behaviour, and so are valid for ALL implementations.
// It isup to the device implementation test code that pulls these in to make sure that sufficient mocking is in place to allow these tests to run.
window.commonTests.mediaPlayer.all.mixinTests = function (testCase, mediaPlayerDeviceModifierRequireName, config, deviceMockingHooks) {
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
        queuedApplicationInit(queue, 'lib/mockapplication', [],
            function(application) {

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
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer"],
            function(application, MediaPlayer) {

                deviceMockingHooks.setup(self.sandbox, application);
                deviceMockingHooks.mockTime();
                self.device = application.getDevice();
                self._mediaPlayer = self.device.getMediaPlayer();

                self.eventCallback = self.sandbox.stub();
                self._mediaPlayer.addEventCallback(null, self.eventCallback);

                try {
                    test.call(self, MediaPlayer);
                }
                finally {
                    deviceMockingHooks.unmockTime();
                }
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
            seekableRange: undefined,
            duration: undefined,
            url: undefined,
            mimeType: undefined,
            type: MediaPlayer.EVENT.ERROR
        });
    };

    var assertBufferingAndNextState = function (self, MediaPlayer, postBufferingState) {
        assertEquals(MediaPlayer.STATE.BUFFERING, self._mediaPlayer.getState());
        assertLatestEvent(self, {
            state: MediaPlayer.STATE.BUFFERING,
            // Availability of range/duration/currentTime at this point is device-specific.
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
            expectAsserts(11);
            doTest(this, queue, function (MediaPlayer) {
                setup.call(this, MediaPlayer);
                var err;
                try {
                    this._mediaPlayer[apiCall]();
                } catch (e) {
                    err = e;
                }
                assertEquals("ApiError", err.substring(0, 8));
                assertMediaPlayerError(this, MediaPlayer);
            });
        };
        test.bind(testCase);
        return test;
    };

    var sendDeviceEvent = function (deviceEventName) {
        if (deviceEventName === 'sendMetadata') {
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
        } else {
            deviceMockingHooks[deviceEventName](this._mediaPlayer);
        }
    };

    var makeDeviceEventStaysInSameStateTest = function (setup, deviceEventName) {
        var test = function (queue) {
            expectAsserts(2);
            doTest(this, queue, function (MediaPlayer) {
                setup.call(this, MediaPlayer);
                var previousState = this._mediaPlayer.getState();
                sendDeviceEvent(deviceEventName);
                assertEquals(previousState, this._mediaPlayer.getState());
            });
        };
        test.bind(testCase);
        return test;
    };

    var makeDeviceErrorGetsReported = function (setup, deviceEventName) {
        var test = function (queue) {
            expectAsserts(4);
            doTest(this, queue, function (MediaPlayer) {
                setup.call(this, MediaPlayer);
                var state = this._mediaPlayer.getState();
                deviceMockingHooks.emitPlaybackError(this._mediaPlayer);
                assertLatestEvent(this, {
                    state: state,
                    type: MediaPlayer.EVENT.ERROR
                });
            });
        };
        test.bind(testCase);
        return test;
    };

    var makeTimePassingDoesNotCauseStatusEventTest = function (setup) {
        var test = function (queue) {
            expectAsserts(2);
            doTest(this, queue, function (MediaPlayer) {
                setup.call(this, MediaPlayer);
                deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
                var latestEventType = this.eventCallback.lastCall.args[0].type || '';
                assert(MediaPlayer.EVENT.STATUS !== latestEventType);
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

    var getToEmptyStateViaReset = function (MediaPlayer) {
        getToPlayingState.call(this, MediaPlayer);
        this._mediaPlayer.stop();
        this._mediaPlayer.reset();
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
    mixins.testGetSeekableRangeReturnsUndefinedInEmptyState = makeGetMethodReturnsUndefinedTest(getToEmptyState, "getSeekableRange");
    mixins.testGetDurationReturnsUndefinedInEmptyState = makeGetMethodReturnsUndefinedTest(getToEmptyState, "getDuration");

    mixins.testGetSourceReturnsUndefinedInEmptyStateAfterReset = makeGetMethodReturnsUndefinedTest(getToEmptyStateViaReset, "getSource");
    mixins.testGetMimeTypeReturnsUndefinedInEmptyStateAfterReset = makeGetMethodReturnsUndefinedTest(getToEmptyStateViaReset, "getMimeType");
    mixins.testGetCurrentTimeReturnsUndefinedInEmptyStateAfterReset = makeGetMethodReturnsUndefinedTest(getToEmptyStateViaReset, "getCurrentTime");
    mixins.testGetSeekableRangeReturnsUndefinedInEmptyStateAfterReset = makeGetMethodReturnsUndefinedTest(getToEmptyStateViaReset, "getSeekableRange");
    mixins.testGetDurationReturnsUndefinedInEmptyStateAfterReset = makeGetMethodReturnsUndefinedTest(getToEmptyStateViaReset, "getDuration");

    mixins.testCallingPlayFromInEmptyStateIsAnError = makeApiCallCausesErrorTest(getToEmptyState, "playFrom");
    mixins.testCallingBeginPlaybackInEmptyStateIsAnError = makeApiCallCausesErrorTest(getToEmptyState, "beginPlayback");
    mixins.testCallingPauseInEmptyStateIsAnError = makeApiCallCausesErrorTest(getToEmptyState, "pause");
    mixins.testCallingResumeInEmptyStateIsAnError = makeApiCallCausesErrorTest(getToEmptyState, "resume");
    mixins.testCallingStopInEmptyStateIsAnError = makeApiCallCausesErrorTest(getToEmptyState, "stop");

    mixins.testCallingSetSourceInEmptyStateGoesToStoppedState = function (queue) {
        expectAsserts(10);
        doTest(this, queue, function (MediaPlayer) {
            getToEmptyState.call(this, MediaPlayer);
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.STOPPED,
                currentTime: undefined,
                seekableRange: undefined,
                duration: undefined,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.STOPPED
            });
        });
    };

    mixins.testCallingResetInEmptyStateStaysInEmptyState = function (queue) {
        expectAsserts(2);
        doTest(this, queue, function (MediaPlayer) {
            getToEmptyState.call(this, MediaPlayer);

            this._mediaPlayer.reset();

            assertEquals(MediaPlayer.STATE.EMPTY, this._mediaPlayer.getState());
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
    mixins.testGetSeekableRangeReturnsUndefinedInStoppedState = makeGetMethodReturnsUndefinedTest(getToStoppedState, "getSeekableRange");
    mixins.testGetDurationReturnsUndefinedInStoppedState = makeGetMethodReturnsUndefinedTest(getToStoppedState, "getDuration");

    mixins.testCallingSetSourceInStoppedStateIsAnError = makeApiCallCausesErrorTest(getToStoppedState, "setSource");
    mixins.testCallingPauseInStoppedStateIsAnError = makeApiCallCausesErrorTest(getToStoppedState, "pause");
    mixins.testCallingResumeInStoppedStateIsAnError = makeApiCallCausesErrorTest(getToStoppedState, "resume");

    mixins.testSendMetaDataInStoppedStateStaysInStoppedState = makeDeviceEventStaysInSameStateTest(getToStoppedState, 'sendMetadata');
    mixins.testFinishBufferingInStoppedStateStaysInStoppedState = makeDeviceEventStaysInSameStateTest(getToStoppedState, 'finishBuffering');
    mixins.testStartBufferingInStoppedStateStaysInStoppedState = makeDeviceEventStaysInSameStateTest(getToStoppedState, 'startBuffering');

    mixins.testDeviceErrorInStoppedStateGetsReported = makeDeviceErrorGetsReported(getToStoppedState);

    mixins.testTimePassingDoesNotCauseStatusEventToBeSentInStoppedState = makeTimePassingDoesNotCauseStatusEventTest(getToStoppedState);

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
            assertBufferingAndNextState(this, MediaPlayer, MediaPlayer.STATE.PLAYING);
        });
    };

    mixins.testFinishBufferingThenPlayFromInStoppedStateGoesToBuffering = function (queue) {
        expectAsserts(2);
        doTest(this, queue, function (MediaPlayer) {
            getToStoppedState.call(this, MediaPlayer);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            this._mediaPlayer.playFrom(0);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
        });
    };

    mixins.testCallingBeginPlaybackInStoppedStateGoesToBufferingState = function (queue) {
        expectAsserts(8);
        doTest(this, queue, function (MediaPlayer) {
            getToStoppedState.call(this, MediaPlayer);
            this._mediaPlayer.beginPlayback();
            assertBufferingAndNextState(this, MediaPlayer, MediaPlayer.STATE.PLAYING);
        });
    };

    mixins.testCallingStopInStoppedStateStaysInStoppedState = function (queue) {
        expectAsserts(3);
        doTest(this, queue, function (MediaPlayer) {
            getToStoppedState.call(this, MediaPlayer);
            var callCount = this.eventCallback.callCount;
            this._mediaPlayer.stop();
            assertEquals(callCount, this.eventCallback.callCount);
            assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
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

    // Availability of getCurrentTime(), getSeekableRange() and getDuration() are device-specific at this point.

    mixins.testCallingSetSourceInBufferingStateIsAnError = makeApiCallCausesErrorTest(getToBufferingState, "setSource");
    mixins.testCallingBeginPlaybackInBufferingStateIsAnError = makeApiCallCausesErrorTest(getToBufferingState, "beginPlayback");
    mixins.testCallingResetInBufferingStateIsAnError = makeApiCallCausesErrorTest(getToBufferingState, "reset");

    mixins.testSendMetaDataInBufferingStateStaysInBufferingState = makeDeviceEventStaysInSameStateTest(getToBufferingState, 'sendMetadata');
    mixins.testStartBufferingInBufferingStateStaysInBufferingState = makeDeviceEventStaysInSameStateTest(getToBufferingState, 'startBuffering');

    mixins.testDeviceErrorInBufferingStateGetsReported = makeDeviceErrorGetsReported(getToBufferingState);

    mixins.testTimePassingDoesNotCauseStatusEventToBeSentInBufferingState = makeTimePassingDoesNotCauseStatusEventTest(getToBufferingState);

    mixins.testWhenBufferingFinishesAndNoFurtherApiCallsThenWeGoToPlayingState = function (queue) {
        expectAsserts(10);
        doTest(this, queue, function (MediaPlayer) {
            getToBufferingState.call(this, MediaPlayer);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.PLAYING,
                currentTime: 0,
                seekableRange: { start: 0, end: 100 },
                duration: 100,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.PLAYING
            });
        });
    };

    mixins.testWhenPauseCalledAndBufferingFinishesThenWeGoToPausedState = function (queue) {
        expectAsserts(11);
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
                seekableRange: { start: 0, end: 100 },
                duration: 100,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.PAUSED
            });
        });
    };


    mixins.testWhenPauseThenResumeCalledBeforeBufferingFinishesThenWeGoToPlayingState = function (queue) {
        expectAsserts(11);
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
                seekableRange: { start: 0, end: 100 },
                duration: 100,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.PLAYING
            });
        });
    };

    mixins.testWhenPlayFromMiddleOfMediaAndBufferingFinishesThenWeGoToPlayingFromSpecifiedPoint = function (queue) {
        expectAsserts(10);
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
                seekableRange: { start: 0, end: 100 },
                duration: 100,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.PLAYING
            });
        });
    };

    mixins.testCallingStopInBufferingStateGoesToStoppedState = function (queue) {
        expectAsserts(10);
        doTest(this, queue, function (MediaPlayer) {
            getToBufferingState.call(this, MediaPlayer);
            this._mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.STOPPED,
                currentTime: undefined,
                seekableRange: undefined,
                duration: undefined,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.STOPPED
            });
        });
    };

    mixins.testDeviceBufferingNotificationInBufferingStateDoesNotEmitSecondBufferingEvent = function (queue) {
        expectAsserts(2);
        doTest(this, queue, function (MediaPlayer) {
            getToBufferingState.call(this, MediaPlayer);
            var callCount = this.eventCallback.callCount;
            deviceMockingHooks.startBuffering(this._mediaPlayer);
            assertEquals(callCount, this.eventCallback.callCount);
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
    mixins.testCallingBeginPlaybackInPlayingStateIsAnError = makeApiCallCausesErrorTest(getToPlayingState, "beginPlayback");
    mixins.testGetMimeTypeReturnsExpectedValueInPlayingState = makeGetMethodReturnsExpectedValueTest(getToPlayingState, "getMimeType", "testMimeType");
    mixins.testGetCurrentTimeReturnsExpectedValueInPlayingState = makeGetMethodReturnsExpectedValueTest(getToPlayingState, "getCurrentTime", 0);
    mixins.testGetSeekableRangeReturnsExpectedValueInPlayingState = makeGetMethodReturnsExpectedValueTest(getToPlayingState, "getSeekableRange", { start: 0, end: 100 });
    mixins.testGetDurationReturnsExpectedValueInPlayingState = makeGetMethodReturnsExpectedValueTest(getToPlayingState, "getDuration", 100);

    mixins.testCallingSetSourceInPlayingStateIsAnError = makeApiCallCausesErrorTest(getToPlayingState, "setSource");
    mixins.testCallingResetInPlayingStateIsAnError = makeApiCallCausesErrorTest(getToPlayingState, "reset");

    mixins.testSendMetaDataInPlayingStateStaysInPlayingState = makeDeviceEventStaysInSameStateTest(getToPlayingState, 'sendMetadata');
    mixins.testFinishBufferingInPlayingStateStaysInPlayingState = makeDeviceEventStaysInSameStateTest(getToPlayingState, 'finishBuffering');

    mixins.testDeviceErrorInPlayingStateGetsReported = makeDeviceErrorGetsReported(getToPlayingState);

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
            assertBufferingAndNextState(this, MediaPlayer, MediaPlayer.STATE.PLAYING);
        });
    };

    mixins.testWhenCallingPauseWhilePlayingGoesToPausedState = function (queue) {
        expectAsserts(10);
        doTest(this, queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            this._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.PAUSED,
                currentTime: 0,
                seekableRange: { start: 0, end: 100 },
                duration: 100,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.PAUSED
            });
        });
    };

    mixins.testWhenCallingStopWhilePlayingGoesToStoppedState = function (queue) {
        expectAsserts(10);
        doTest(this, queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            this._mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.STOPPED,
                currentTime: undefined,
                seekableRange: undefined,
                duration: undefined,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.STOPPED
            });
        });
    };

    mixins.testWhenMediaFinishesWhenPlayingThenGoesToCompleteState = function (queue) {
        expectAsserts(9);
        doTest(this, queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);
            assertEquals(MediaPlayer.STATE.COMPLETE, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.COMPLETE,
                // Availability of currentTime at this point is device-specific.
                seekableRange: { start: 0, end: 100 },
                duration: 100,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.COMPLETE
            });
        });
    };

    mixins.testWhenBufferingStartsWhilePlayingGoesToBufferingState = function (queue) {
        expectAsserts(11);
        doTest(this, queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            deviceMockingHooks.startBuffering(this._mediaPlayer);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.BUFFERING,
                currentTime: 0,
                seekableRange: { start: 0, end: 100 },
                duration: 100,
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
        expectAsserts(9);
        doTest(this, queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            var originalCount = this.eventCallback.callCount;
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.PLAYING,
                // Cannot test current time as it will be updating
                seekableRange: { start: 0, end: 100 },
                duration: 100,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.STATUS
            });
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            assert(this.eventCallback.callCount - originalCount >= 3); // Three seconds so must have had at least three status messages
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
    mixins.testCallingBeginPlaybackInPausedStateIsAnError = makeApiCallCausesErrorTest(getToPausedState, "beginPlayback");
    mixins.testGetMimeTypeReturnsExpectedValueInPausedState = makeGetMethodReturnsExpectedValueTest(getToPausedState, "getMimeType", "testMimeType");
    mixins.testGetCurrentTimeReturnsExpectedValueInPausedState = makeGetMethodReturnsExpectedValueTest(getToPausedState, "getCurrentTime", 0);
    mixins.testGetSeekableRangeReturnsExpectedValueInPausedState = makeGetMethodReturnsExpectedValueTest(getToPausedState, "getSeekableRange", { start: 0, end: 100 });
    mixins.testGetDurationReturnsExpectedValueInPausedState = makeGetMethodReturnsExpectedValueTest(getToPausedState, "getDuration", 100);

    mixins.testCallingSetSourceInPausedStateIsAnError = makeApiCallCausesErrorTest(getToPausedState, "setSource");
    mixins.testCallingResetInPausedStateIsAnError = makeApiCallCausesErrorTest(getToPausedState, "reset");

    mixins.testSendMetaDataInPausedStateStaysInPausedState = makeDeviceEventStaysInSameStateTest(getToPausedState, 'sendMetadata');
    mixins.testFinishBufferingInPausedStateStaysInPausedState = makeDeviceEventStaysInSameStateTest(getToPausedState, 'finishBuffering');
    mixins.testStartBufferingInPausedStateStaysInPausedState = makeDeviceEventStaysInSameStateTest(getToPausedState, 'startBuffering');

    mixins.testDeviceErrorInPausedStateGetsReported = makeDeviceErrorGetsReported(getToPausedState);

    mixins.testTimePassingDoesNotCauseStatusEventToBeSentInPausedState = makeTimePassingDoesNotCauseStatusEventTest(getToPausedState);

    mixins.testWhenCallingResumeWhilePausedGoesToPlayingState = function (queue) {
        expectAsserts(10);
        doTest(this, queue, function (MediaPlayer) {
            getToPausedState.call(this, MediaPlayer);
            this._mediaPlayer.resume();
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.PLAYING,
                currentTime: 0,
                seekableRange: { start: 0, end: 100 },
                duration: 100,
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
            assertBufferingAndNextState(this, MediaPlayer, MediaPlayer.STATE.PLAYING);
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
        expectAsserts(10);
        doTest(this, queue, function (MediaPlayer) {
            getToPausedState.call(this, MediaPlayer);
            this._mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.STOPPED,
                currentTime: undefined,
                seekableRange: undefined,
                duration: undefined,
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
    mixins.testCallingBeginPlaybackInCompleteStateIsAnError = makeApiCallCausesErrorTest(getToCompleteState, "beginPlayback");
    mixins.testGetMimeTypeReturnsExpectedValueInCompleteState = makeGetMethodReturnsExpectedValueTest(getToCompleteState, "getMimeType", "testMimeType");
    mixins.testGetSeekableRangeReturnsExpectedValueInCompleteState = makeGetMethodReturnsExpectedValueTest(getToCompleteState, "getSeekableRange", { start: 0, end: 100 });
    mixins.testGetDurationReturnsExpectedValueInCompleteState = makeGetMethodReturnsExpectedValueTest(getToCompleteState, "getDuration", 100);
    mixins.testGetCurrentTimeReturnsExpectedValueInCompleteState = makeGetMethodReturnsExpectedValueTest(getToCompleteState, "getCurrentTime", 100);

    mixins.testCallingSetSourceInCompleteStateIsAnError = makeApiCallCausesErrorTest(getToCompleteState, "setSource");
    mixins.testCallingPauseInCompleteStateIsAnError = makeApiCallCausesErrorTest(getToCompleteState, "pause");
    mixins.testCallingResumeInCompleteStateIsAnError = makeApiCallCausesErrorTest(getToCompleteState, "resume");
    mixins.testCallingResetInCompleteStateIsAnError = makeApiCallCausesErrorTest(getToCompleteState, "reset");

    mixins.testSendMetaDataInCompleteStateStaysInCompleteState = makeDeviceEventStaysInSameStateTest(getToCompleteState, 'sendMetadata');
    mixins.testFinishBufferingInCompleteStateStaysInCompleteState = makeDeviceEventStaysInSameStateTest(getToCompleteState, 'finishBuffering');
    mixins.testStartBufferingInCompleteStateStaysInCompleteState = makeDeviceEventStaysInSameStateTest(getToCompleteState, 'startBuffering');

    mixins.testTimePassingDoesNotCauseStatusEventToBeSentInCompleteState = makeTimePassingDoesNotCauseStatusEventTest(getToCompleteState);

    mixins.testWhenCallPlayFromWhileCompleteGoesToBufferingState = function (queue) {
        expectAsserts(8);
        doTest(this, queue, function (MediaPlayer) {
            getToCompleteState.call(this, MediaPlayer);
            this._mediaPlayer.playFrom(90);
            assertBufferingAndNextState(this, MediaPlayer, MediaPlayer.STATE.PLAYING);
        });
    };

    mixins.testCallingStopInCompleteStateGoesToStoppedState = function (queue) {
        expectAsserts(10);
        doTest(this, queue, function (MediaPlayer) {
            getToCompleteState.call(this, MediaPlayer);
            this._mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
            assertLatestEvent(this, {
                state: MediaPlayer.STATE.STOPPED,
                currentTime: undefined,
                seekableRange: undefined,
                duration: undefined,
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
        try {
            this._mediaPlayer.stop();
        } catch (e) {}
        assertEquals(MediaPlayer.STATE.ERROR, this._mediaPlayer.getState());
    };

    mixins.testGetSourceReturnsUndefinedInErrorState = makeGetMethodReturnsUndefinedTest(getToErrorState, "getSource");
    mixins.testCallingBeginPlaybackInErrorStateIsAnError = makeApiCallCausesErrorTest(getToErrorState, "beginPlayback");
    mixins.testGetMimeTypeReturnsUndefinedInErrorState = makeGetMethodReturnsUndefinedTest(getToErrorState, "getMimeType");
    mixins.testGetCurrentTimeReturnsUndefinedInErrorState = makeGetMethodReturnsUndefinedTest(getToErrorState, "getCurrentTime");
    mixins.testGetSeekableRangeReturnsUndefinedInErrorState = makeGetMethodReturnsUndefinedTest(getToErrorState, "getSeekableRange");
    mixins.testGetDurationReturnsUndefinedInErrorState = makeGetMethodReturnsUndefinedTest(getToErrorState, "getDuration");

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
        expectAsserts(2);
        doTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            try {
                this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            } catch (e) {}
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
                try {
                    this._mediaPlayer[method].apply(this._mediaPlayer, args);
                } catch (e) {}
                assert(errorStub.calledWith("Cannot " + method + " while in the 'EMPTY' state"));
                try {
                    this._mediaPlayer[method].apply(this._mediaPlayer, args);
                } catch (e) {}
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
            try {
                this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            } catch (e) {}
            assert(errorStub.calledWith("Cannot set source unless in the 'EMPTY' state"));
        });
    };

    mixins.testErrorWhileResettingInInvalidStateIsLogged = function(queue) {
        expectAsserts(2);
        doTest(this, queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            var errorStub = this.sandbox.stub();
            this.sandbox.stub(this.device, "getLogger").returns({error: errorStub});
            try {
                this._mediaPlayer.reset();
            } catch (e) {}
            assert(errorStub.calledWith("Cannot reset while in the 'PLAYING' state"));
        });
    };

    // *******************************************
    // ***** Debug message logged for ************
    // *********** clamped playFrom  *************
    // *******************************************

    mixins.testWhenPlayFromGetsClampedFromBufferingADebugMessageIsLogged = function(queue) {
        expectAsserts(1);
        doTest(this, queue, function (MediaPlayer) {
            var debugStub = this.sandbox.stub();
            var warnStub = this.sandbox.stub();
            this.sandbox.stub(this.device, "getLogger").returns({
                debug: debugStub,
                warn: warnStub
            });

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            this._mediaPlayer.playFrom(50);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 0 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assert(debugStub.withArgs("playFrom 50 clamped to 0 - seekable range is { start: 0, end: 0 }").calledOnce);
        });
    };

    mixins.testWhenPlayFromGetsClampedFromPlayingStateADebugMessageIsLogged = function(queue) {
        expectAsserts(1);
        doTest(this, queue, function (MediaPlayer) {
            var debugStub = this.sandbox.stub();
            var warnStub = this.sandbox.stub();
            this.sandbox.stub(this.device, "getLogger").returns({
                debug: debugStub,
                warn: warnStub
            });

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 0 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            this._mediaPlayer.playFrom(110);

            assert(debugStub.withArgs("playFrom 110 clamped to 0 - seekable range is { start: 0, end: 0 }").calledOnce);
        });
    };

    mixins.testWhenPlayFromGetsClampedFromPlayingStateWithNonZeroEndOfRangeADebugMessageIsLoggedOnce = function(queue) {
        expectAsserts(1);
        doTest(this, queue, function (MediaPlayer) {
            var debugStub = this.sandbox.stub();
            var warnStub = this.sandbox.stub();
            this.sandbox.stub(this.device, "getLogger").returns({
                debug: debugStub,
                warn: warnStub
            });

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            this._mediaPlayer.playFrom(110);

            assert(debugStub.withArgs("playFrom 110 clamped to 98.9 - seekable range is { start: 0, end: 100 }").calledOnce);
        });
    };

    mixins.testWhenPlayFromGetsClampedFromPausedStateADebugMessageIsLogged = function(queue) {
        expectAsserts(1);
        doTest(this, queue, function (MediaPlayer) {
            var debugStub = this.sandbox.stub();
            var warnStub = this.sandbox.stub();
            this.sandbox.stub(this.device, "getLogger").returns({
                debug: debugStub,
                warn: warnStub
            });

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.beginPlayback();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            this._mediaPlayer.pause();
            this._mediaPlayer.playFrom(80);

            assert(debugStub.withArgs("playFrom 80 clamped to 58.9 - seekable range is { start: 0, end: 60 }").calledOnce);
        });
    };

    mixins.testWhenPlayFromDoesNotGetClampedADebugMessageIsNotLogged = function(queue) {
        expectAsserts(1);
        doTest(this, queue, function (MediaPlayer) {
            var debugStub = this.sandbox.stub();
            var warnStub = this.sandbox.stub();
            this.sandbox.stub(this.device, "getLogger").returns({
                debug: debugStub,
                warn: warnStub
            });

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(50);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(debugStub.notCalled);
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