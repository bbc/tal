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
MixinCommonMediaTests = function (testCase, mediaPlayerDeviceModifierRequireName, config, deviceMockingHooks) {
    var mixins = {};

    // ********************************************
    // ********* Device overriding tests **********
    // ********************************************

    mixins.testGettingMediaPlayerGivesDeviceVersionWhenModifierProvider = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [mediaPlayerDeviceModifierRequireName],
            function(application, MediaPlayerImpl) {

                var device = application.getDevice();
                var instance = device.getMediaPlayer();

                assertInstanceOf(MediaPlayerImpl, instance);
            }, config);
    };

    mixins.testGettingMediaPlayerRepeatedlyReturnsSameObject = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [mediaPlayerDeviceModifierRequireName],
            function(application, MediaPlayerImpl) {

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


    mixins.doTest = function (queue, test) {
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", mediaPlayerDeviceModifierRequireName],
            function(application, MediaPlayer, MediaPlayerImpl) {

                var device = application.getDevice();
                self.mediaPlayer = device.getMediaPlayer();

                self.eventCallback = self.sandbox.stub();
                self.mediaPlayer.addEventCallback(null, self.eventCallback);

                test.call(self, MediaPlayer);
            }, config);
    };

    mixins.assertLatestEvent = function (expectedEventData) {
        assert(this.eventCallback.called);
        var actualEventData = this.eventCallback.lastCall.args[0];
        for (name in expectedEventData) {
            if (expectedEventData.hasOwnProperty(name)) {
                assertEquals(expectedEventData[name], actualEventData[name]);
            }
        }
    };

    mixins.assertMediaPlayerError = function (MediaPlayer) {
        assertEquals(MediaPlayer.STATE.ERROR, this.mediaPlayer.getState());
        this.assertLatestEvent({
            state: MediaPlayer.STATE.ERROR,
            currentTime: undefined,
            range: undefined,
            url: undefined,
            mimeType: undefined,
            type: MediaPlayer.EVENT.ERROR
        });
    };

    mixins.assertBuffering = function (MediaPlayer, postBufferingState) {
        assertEquals(MediaPlayer.STATE.BUFFERING, this.mediaPlayer.getState());
        this.assertLatestEvent({
            state: MediaPlayer.STATE.BUFFERING,
            // Availability of range/currentTime at this point is device-specific.
            url: "testUrl",
            mimeType: "testMimeType",
            type: MediaPlayer.EVENT.BUFFERING
        });
        deviceMockingHooks.finishBuffering(this.mediaPlayer);
        assertEquals(postBufferingState, this.mediaPlayer.getState());
    };

    var makeGetMethodReturnsUndefinedTest = function (setup, apiCall) {
        return makeGetMethodReturnsExpectedValueTest(setup, apiCall, undefined);
    };

    var makeGetMethodReturnsExpectedValueTest = function (setup, apiCall, expected) {
        var test = function (queue) {
            expectAsserts(2);
            this.doTest(queue, function (MediaPlayer) {
                setup.call(this, MediaPlayer);
                assertEquals(expected, this.mediaPlayer[apiCall]());
            });
        };
        test.bind(testCase);
        return test;
    };

    var makeApiCallCausesErrorTest = function (setup, apiCall) {
        var test = function (queue) {
            expectAsserts(9);
            this.doTest(queue, function (MediaPlayer) {
                setup.call(this, MediaPlayer);
                this.mediaPlayer[apiCall]();
                this.assertMediaPlayerError(MediaPlayer);
            });
        };
        test.bind(testCase);
        return test;
    };


    // *******************************************
    // ********* EMPTY state tests ***************
    // *******************************************

    var getToEmptyState = function (MediaPlayer) {
        assertEquals(MediaPlayer.STATE.EMPTY, this.mediaPlayer.getState());
    };

    mixins.testMediaPlayerStartsInEmptyState = function (queue) {
        expectAsserts(1); 
        this.doTest(queue, function (MediaPlayer) {
            assertEquals(MediaPlayer.STATE.EMPTY, this.mediaPlayer.getState());
        });
    };

    mixins.testGetSourceReturnsUndefinedInEmptyState = makeGetMethodReturnsUndefinedTest(getToEmptyState, "getSource");
    mixins.testGetMimeTypeReturnsUndefinedInEmptyState = makeGetMethodReturnsUndefinedTest(getToEmptyState, "getMimeType");
    mixins.testGetCurrentTimeReturnsUndefinedInEmptyState = makeGetMethodReturnsUndefinedTest(getToEmptyState, "getCurrentTime");
    mixins.testGetRangeReturnsUndefinedInEmptyState = makeGetMethodReturnsUndefinedTest(getToEmptyState, "getRange");

    mixins.testCallingPlayInEmptyStateIsAnError = makeApiCallCausesErrorTest(getToEmptyState, "play");
    mixins.testCallingPlayFromInEmptyStateIsAnError = makeApiCallCausesErrorTest(getToEmptyState, "playFrom");
    mixins.testCallingPauseInEmptyStateIsAnError = makeApiCallCausesErrorTest(getToEmptyState, "pause");
    mixins.testCallingStopInEmptyStateIsAnError = makeApiCallCausesErrorTest(getToEmptyState, "stop");
    mixins.testCallingResetInEmptyStateIsAnError = makeApiCallCausesErrorTest(getToEmptyState, "reset");

    mixins.testCallingSetSourceInEmptyStateGoesToStoppedState = function (queue) {
        expectAsserts(9);
        this.doTest(queue, function (MediaPlayer) {
            getToEmptyState.call(this, MediaPlayer);
            this.mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            assertEquals(MediaPlayer.STATE.STOPPED, this.mediaPlayer.getState());
            this.assertLatestEvent({
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
        this.mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
        assertEquals(MediaPlayer.STATE.STOPPED, this.mediaPlayer.getState());
    };

    mixins.testGetSourceReturnsUndefinedInStoppedState = makeGetMethodReturnsExpectedValueTest(getToStoppedState, "getSource", "testUrl");
    mixins.testGetMimeTypeReturnsUndefinedInStoppedState = makeGetMethodReturnsExpectedValueTest(getToStoppedState, "getMimeType", "testMimeType");

    mixins.testGetCurrentTimeReturnsUndefinedInStoppedState = makeGetMethodReturnsUndefinedTest(getToStoppedState, "getCurrentTime");
    mixins.testGetRangeReturnsUndefinedInStoppedState = makeGetMethodReturnsUndefinedTest(getToStoppedState, "getRange");

    mixins.testCallingSetSourceInStoppedStateIsAnError = makeApiCallCausesErrorTest(getToStoppedState, "setSource");
    mixins.testCallingPauseInStoppedStateIsAnError = makeApiCallCausesErrorTest(getToStoppedState, "pause");
    mixins.testCallingStopInStoppedStateIsAnError = makeApiCallCausesErrorTest(getToStoppedState, "stop");

    mixins.testCallingResetInStoppedStateGoesToEmptyState = function (queue) {
        expectAsserts(4); 
        this.doTest(queue, function (MediaPlayer) {
            getToStoppedState.call(this, MediaPlayer);
            this.mediaPlayer.reset();
            assertEquals(MediaPlayer.STATE.EMPTY, this.mediaPlayer.getState());
            assertEquals(undefined, this.mediaPlayer.getSource());
            assertEquals(undefined, this.mediaPlayer.getMimeType());
        });
    };

    mixins.testCallingPlayInStoppedStateGoesToBufferingState = function (queue) {
        expectAsserts(8); 
        this.doTest(queue, function (MediaPlayer) {
            getToStoppedState.call(this, MediaPlayer);
            this.mediaPlayer.play();
            this.assertBuffering(MediaPlayer, MediaPlayer.STATE.PLAYING);
        });
    };

    mixins.testCallingPlayFromInStoppedStateGoesToBufferingState = function (queue) {
        expectAsserts(8); 
        this.doTest(queue, function (MediaPlayer) {
            getToStoppedState.call(this, MediaPlayer);
            this.mediaPlayer.playFrom(0);
            this.assertBuffering(MediaPlayer, MediaPlayer.STATE.PLAYING);
        });
    };

    // *******************************************
    // ********* BUFFERING state tests ***********
    // *******************************************

    var getToBufferingState = function (MediaPlayer) {
        this.mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
        this.mediaPlayer.play();
        assertEquals(MediaPlayer.STATE.BUFFERING, this.mediaPlayer.getState());
    };

    mixins.testGetSourceReturnsExpectedValueInBufferingState = makeGetMethodReturnsExpectedValueTest(getToBufferingState, "getSource", "testUrl");
    mixins.testGetMimeTypeReturnsExpectedValueInBufferingState = makeGetMethodReturnsExpectedValueTest(getToBufferingState, "getMimeType", "testMimeType");

    // Availability of getCurrentTime() and getRange() are device-specific at this point.

    mixins.testCallingSetSourceInBufferingStateIsAnError = makeApiCallCausesErrorTest(getToBufferingState, "setSource");
    mixins.testCallingResetInBufferingStateIsAnError = makeApiCallCausesErrorTest(getToBufferingState, "reset");

    mixins.testWhenBufferingFinishesAndNoFurtherApiCallsThenWeGoToPlayingState = function (queue) {
        expectAsserts(9);
        this.doTest(queue, function (MediaPlayer) {
            getToBufferingState.call(this, MediaPlayer);
            deviceMockingHooks.finishBuffering(this.mediaPlayer, 0, { start: 0, end: 100 });
            assertEquals(MediaPlayer.STATE.PLAYING, this.mediaPlayer.getState());
            this.assertLatestEvent({
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
        this.doTest(queue, function (MediaPlayer) {
            getToBufferingState.call(this, MediaPlayer);
            this.mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.BUFFERING, this.mediaPlayer.getState());
            deviceMockingHooks.finishBuffering(this.mediaPlayer, 0, { start: 0, end: 100 });
            assertEquals(MediaPlayer.STATE.PAUSED, this.mediaPlayer.getState());
            this.assertLatestEvent({
                state: MediaPlayer.STATE.PAUSED,
                currentTime: 0,
                range: { start: 0, end: 100 },
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.PAUSED
            });
        });
    };


    mixins.testWhenPauseThenPlayCalledBeforeBufferingFinishesThenWeGoToPlayingState = function (queue) {
        expectAsserts(10);
        this.doTest(queue, function (MediaPlayer) {
            getToBufferingState.call(this, MediaPlayer);
            this.mediaPlayer.pause();
            this.mediaPlayer.play();
            assertEquals(MediaPlayer.STATE.BUFFERING, this.mediaPlayer.getState());
            deviceMockingHooks.finishBuffering(this.mediaPlayer, 0, { start: 0, end: 100 });
            assertEquals(MediaPlayer.STATE.PLAYING, this.mediaPlayer.getState());
            this.assertLatestEvent({
                state: MediaPlayer.STATE.PLAYING,
                currentTime: 0,
                range: { start: 0, end: 100 },
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.PLAYING
            });
        });
    };

    mixins.testWhenBufferingEnteredUsingPlayFromAndBufferingFinishesThenWeGoToPlayingFromSpecifiedPoint = function (queue) {
        expectAsserts(9);
        this.doTest(queue, function (MediaPlayer) {
            this.mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this.mediaPlayer.playFrom(50);
            assertEquals(MediaPlayer.STATE.BUFFERING, this.mediaPlayer.getState());
            deviceMockingHooks.finishBuffering(this.mediaPlayer, 50, { start: 0, end: 100 });
            assertEquals(MediaPlayer.STATE.PLAYING, this.mediaPlayer.getState());
            this.assertLatestEvent({
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
        this.doTest(queue, function (MediaPlayer) {
            getToBufferingState.call(this, MediaPlayer);
            this.mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, this.mediaPlayer.getState());
            this.assertLatestEvent({
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
        this.mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
        this.mediaPlayer.play();
        deviceMockingHooks.finishBuffering(this.mediaPlayer, 0, { start: 0, end: 100 });
        assertEquals(MediaPlayer.STATE.PLAYING, this.mediaPlayer.getState());
    };

    mixins.testGetSourceReturnsExpectedValueInPlayingState = makeGetMethodReturnsExpectedValueTest(getToPlayingState, "getSource", "testUrl");
    mixins.testGetMimeTypeReturnsExpectedValueInPlayingState = makeGetMethodReturnsExpectedValueTest(getToPlayingState, "getMimeType", "testMimeType");
    mixins.testGetCurrentTimeReturnsExpectedValueInPlayingState = makeGetMethodReturnsExpectedValueTest(getToPlayingState, "getCurrentTime", 0);
    mixins.testGetRangeReturnsExpectedValueInPlayingState = makeGetMethodReturnsExpectedValueTest(getToPlayingState, "getRange", { start: 0, end: 100 });

    mixins.testCallingSetSourceInPlayingStateIsAnError = makeApiCallCausesErrorTest(getToPlayingState, "setSource");
    mixins.testCallingResetInPlayingStateIsAnError = makeApiCallCausesErrorTest(getToPlayingState, "reset");

    mixins.testWhenCallPlayWhileAlreadyPlayingThenRemainInPlayState = function (queue) {
        expectAsserts(3);
        this.doTest(queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            var originalCount = this.eventCallback.callCount;
            this.mediaPlayer.play();
            assertEquals(MediaPlayer.STATE.PLAYING, this.mediaPlayer.getState());
            assertEquals(originalCount, this.eventCallback.callCount);
        });
    };

    mixins.testWhenCallPlayFromWhilePlayingGoesToBufferingState = function (queue) {
        expectAsserts(8);
        this.doTest(queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            this.mediaPlayer.playFrom(90);
            this.assertBuffering(MediaPlayer, MediaPlayer.STATE.PLAYING);
        });
    };

    mixins.testWhenCallingPauseWhilePlayingGoesToPausedState = function (queue) {
        expectAsserts(9);
        this.doTest(queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            this.mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, this.mediaPlayer.getState());
            this.assertLatestEvent({
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
        this.doTest(queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            this.mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, this.mediaPlayer.getState());
            this.assertLatestEvent({
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
        this.doTest(queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            deviceMockingHooks.emitPlaybackError(this.mediaPlayer);
            this.assertMediaPlayerError(MediaPlayer);
        });
    };

    mixins.testWhenMediaFinishesWhenPlayingThenGoesToCompleteState = function (queue) {
        expectAsserts(7);
        this.doTest(queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            deviceMockingHooks.reachEndOfMedia(this.mediaPlayer);
            assertEquals(MediaPlayer.STATE.COMPLETE, this.mediaPlayer.getState());
            this.assertLatestEvent({
                state: MediaPlayer.STATE.COMPLETE,
                // Availability of currentTime/range at this point is device-specific.
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.COMPLETE
            });
        });
    };

    mixins.testWhenBufferingStartsWhilePlayingGoesToBufferingState = function (queue) {
        expectAsserts(10);
        this.doTest(queue, function (MediaPlayer) {
            getToPlayingState.call(this, MediaPlayer);
            deviceMockingHooks.startBuffering(this.mediaPlayer);
            assertEquals(MediaPlayer.STATE.BUFFERING, this.mediaPlayer.getState());
            this.assertLatestEvent({
                state: MediaPlayer.STATE.BUFFERING,
                currentTime: 0,
                range: { start: 0, end: 100 },
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.BUFFERING
            });
            deviceMockingHooks.finishBuffering(this.mediaPlayer);
            assertEquals(MediaPlayer.STATE.PLAYING, this.mediaPlayer.getState());
        });
    };

    mixins.testGetRegularStatusEventWhenPlaying = function (queue) {
        expectAsserts(8);
        this.doTest(queue, function (MediaPlayer) {
            deviceMockingHooks.mockTime(this.mediaPlayer);
            getToPlayingState.call(this, MediaPlayer);
            var originalCount = this.eventCallback.callCount;
            deviceMockingHooks.makeOneSecondPass(this.mediaPlayer);
            this.assertLatestEvent({
                state: MediaPlayer.STATE.PLAYING,
                // Cannot test current time as it will be updating
                range: { start: 0, end: 100 },
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.STATUS
            });
            deviceMockingHooks.makeOneSecondPass(this.mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this.mediaPlayer);
            assertTrue(this.eventCallback.callCount - originalCount >= 3); // Three seconds so must have had at least three status messages
            deviceMockingHooks.unmockTime(this.mediaPlayer);
        });
    };

    // *******************************************
    // ********* PAUSED state tests **************
    // *******************************************

    var getToPausedState = function (MediaPlayer) {
        this.mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
        this.mediaPlayer.play();
        this.mediaPlayer.pause();
        deviceMockingHooks.finishBuffering(this.mediaPlayer, 0, { start: 0, end: 100 });
        assertEquals(MediaPlayer.STATE.PAUSED, this.mediaPlayer.getState());
    };

    mixins.testGetSourceReturnsExpectedValueInPausedState = makeGetMethodReturnsExpectedValueTest(getToPausedState, "getSource", "testUrl");
    mixins.testGetMimeTypeReturnsExpectedValueInPausedState = makeGetMethodReturnsExpectedValueTest(getToPausedState, "getMimeType", "testMimeType");
    mixins.testGetCurrentTimeReturnsExpectedValueInPausedState = makeGetMethodReturnsExpectedValueTest(getToPausedState, "getCurrentTime", 0);
    mixins.testGetRangeReturnsExpectedValueInPausedState = makeGetMethodReturnsExpectedValueTest(getToPausedState, "getRange", { start: 0, end: 100 });

    mixins.testCallingSetSourceInPausedStateIsAnError = makeApiCallCausesErrorTest(getToPausedState, "setSource");
    mixins.testCallingResetInPausedStateIsAnError = makeApiCallCausesErrorTest(getToPausedState, "reset");

    mixins.testWhenCallingPlayWhilePausedGoesToPlayingState = function (queue) {
        expectAsserts(9);
        this.doTest(queue, function (MediaPlayer) {
            getToPausedState.call(this, MediaPlayer);
            this.mediaPlayer.play();
            assertEquals(MediaPlayer.STATE.PLAYING, this.mediaPlayer.getState());
            this.assertLatestEvent({
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
        this.doTest(queue, function (MediaPlayer) {
            getToPausedState.call(this, MediaPlayer);
            this.mediaPlayer.playFrom(90);
            this.assertBuffering(MediaPlayer, MediaPlayer.STATE.PLAYING);
        });
    };

    mixins.testWhenCallPauseWhileAlreadyPausedThenRemainInPausedState = function (queue) {
        expectAsserts(3);
        this.doTest(queue, function (MediaPlayer) {
            getToPausedState.call(this, MediaPlayer);
            var originalCount = this.eventCallback.callCount;
            this.mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, this.mediaPlayer.getState());
            assertEquals(originalCount, this.eventCallback.callCount);
        });
    };

    mixins.testWhenCallingStopWhilePausedGoesToStoppedState = function (queue) {
        expectAsserts(9);
        this.doTest(queue, function (MediaPlayer) {
            getToPausedState.call(this, MediaPlayer);
            this.mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, this.mediaPlayer.getState());
            this.assertLatestEvent({
                state: MediaPlayer.STATE.STOPPED,
                currentTime: undefined,
                range: undefined,
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.STOPPED
            });
        });
    };

    // If we finish buffering when paused then make sure we're still paused.

    // *******************************************
    // ********* COMPLETE state tests ************
    // *******************************************

    // getToCompleteState (assert state is correct in here)

    // getSource()
    // getMimeType()
    // getCurrentTime()
    // getRange()

    // setSource(url, mimeType)
    // play()
    // playFrom(time)
    // pause()
    // stop()
    // reset()

    // *******************************************
    // ********* ERROR state tests ***************
    // *******************************************

    // getToErrorState (assert state is correct in here)

    // getSource()
    // getMimeType()
    // getCurrentTime()
    // getRange()

    // setSource(url, mimeType)
    // play()
    // playFrom(time)
    // pause()
    // stop()
    // reset()


    mixins.testWhenBufferingFinishesDuringErrorWeContinueToBeInError = function (queue) {
        expectAsserts(3);
        this.doTest(queue, function (MediaPlayer) {
            getToBufferingState.call(this, MediaPlayer);
            this.mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "myURL", "mime/type");
            assertEquals(MediaPlayer.STATE.ERROR, this.mediaPlayer.getState());
            deviceMockingHooks.finishBuffering(this.mediaPlayer, 0, { start: 0, end: 100 });
            assertEquals(MediaPlayer.STATE.ERROR, this.mediaPlayer.getState());
        });
    };


    // *******************************************
    // ********* Mixin the functions *************
    // *******************************************

    // Make sure we don't mix in over the top of an existing function!
    for (name in mixins) {
        if (mixins.hasOwnProperty(name)) {
            if (testCase.prototype[name]) {
                throw "Trying to mixin '"+name+"' but that already exists!";
            }
            testCase.prototype[name] = mixins[name];
        }
    };
 };