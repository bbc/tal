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
MixinCommonMediaTests = function (testCase, mediaPlayerDeviceModifierRequireName, config) {
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

    var makeGetMethodReturnsUndefinedTest = function (setup, apiCall) {
        var test = function (queue) {
            expectAsserts(2);
            this.doTest(queue, function (MediaPlayer) {
                setup.call(this, MediaPlayer);
                assertEquals(undefined, this.mediaPlayer[apiCall]());
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
        expectAsserts(11); 
        this.doTest(queue, function (MediaPlayer) {
            getToEmptyState.call(this, MediaPlayer);
            this.mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            assertEquals(MediaPlayer.STATE.STOPPED, this.mediaPlayer.getState());
            assertEquals("testUrl", this.mediaPlayer.getSource());
            assertEquals("testMimeType", this.mediaPlayer.getMimeType());
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
        this.mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType")
        assertEquals(MediaPlayer.STATE.STOPPED, this.mediaPlayer.getState());
    };

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
        expectAsserts(7); 
        this.doTest(queue, function (MediaPlayer) {
            getToStoppedState.call(this, MediaPlayer);
            this.mediaPlayer.play();
            assertEquals(MediaPlayer.STATE.BUFFERING, this.mediaPlayer.getState());
            this.assertLatestEvent({
                state: MediaPlayer.STATE.BUFFERING,
                // Availability of range/currentTime at this point is device-specific.
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.BUFFERING
            });
        });
    };

    mixins.testCallingPlayFromInStoppedStateGoesToBufferingState = function (queue) {
        expectAsserts(7); 
        this.doTest(queue, function (MediaPlayer) {
            getToStoppedState.call(this, MediaPlayer);
            this.mediaPlayer.playFrom(0);
            assertEquals(MediaPlayer.STATE.BUFFERING, this.mediaPlayer.getState());
            this.assertLatestEvent({
                state: MediaPlayer.STATE.BUFFERING,
                // Availability of range/currentTime at this point is device-specific.
                url: "testUrl",
                mimeType: "testMimeType",
                type: MediaPlayer.EVENT.BUFFERING
            });
        });
    };

    // *******************************************
    // ********* BUFFERING state tests ***********
    // *******************************************

    // *******************************************
    // ********* PLAYING state tests *************
    // *******************************************

    // *******************************************
    // ********* PAUSED state tests **************
    // *******************************************

    // *******************************************
    // ********* COMPLETE state tests ************
    // *******************************************

    // *******************************************
    // ********* ERROR state tests ***************
    // *******************************************



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