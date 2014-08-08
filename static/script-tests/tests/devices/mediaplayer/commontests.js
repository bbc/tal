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
            function(application, HTML5MediaPlayer) {

                var device = application.getDevice();
                var instance = device.getMediaPlayer();

                assertInstanceOf(HTML5MediaPlayer, instance);
            }, config);
    };

    mixins.testGettingMediaPlayerRepeatedlyReturnsSameObject = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [mediaPlayerDeviceModifierRequireName],
            function(application, HTML5MediaPlayer) {

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
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer", "antie/devices/mediaplayer/html5"],
            function(application, MediaPlayer, HTML5MediaPlayer) {

                var device = application.getDevice();
                self.mediaPlayer = device.getMediaPlayer();

                self.eventCallback = self.sandbox.stub();
                self.mediaPlayer.addEventCallback(null, self.eventCallback);

                test.call(self, MediaPlayer);
            }, config);
    };

    mixins.assertEvent = function (eventData) {
        assertEquals(1, this.eventCallback.callCount);
        assertEquals(eventData, this.eventCallback.getCall(0).args[0]);
    };

    mixins.assertMediaPlayerError = function (MediaPlayer) {
        assertEquals(MediaPlayer.STATE.ERROR, this.mediaPlayer.getState());
        this.assertEvent({
            state: MediaPlayer.STATE.ERROR,
            currentTime: undefined,
            range: undefined,
            url: undefined,
            mimeType: undefined,
            type: MediaPlayer.EVENT.ERROR
        });
    };

    var makeGetUndefinedTest = function (setup, apiCall) {
        var test = function (queue) {
            expectAsserts(1);
            this.doTest(queue, function (MediaPlayer) {
                setup();
                assertEquals(undefined, this.mediaPlayer[apiCall]());
            });
        };
        test.bind(HTML5MediaPlayerTests);
        return test;
    };

    var makeErrorCallTest = function (apiCall) {
        var test = function (queue) {
            expectAsserts(3);
            this.doTest(queue, function (MediaPlayer) {
                this.mediaPlayer[apiCall]();
                this.assertMediaPlayerError(MediaPlayer);
            });
        };
        test.bind(HTML5MediaPlayerTests);
        return test;
    };


    // *******************************************
    // ********* EMPTY state tests ***************
    // *******************************************

    var getToEmptyState = function () {};

    mixins.testMediaPlayerStartsInEmptyState = function (queue) {
        expectAsserts(1); 
        this.doTest(queue, function (MediaPlayer) {
            assertEquals(MediaPlayer.STATE.EMPTY, this.mediaPlayer.getState());
        });
    };

    mixins.testGetSourceReturnsUndefinedInEmptyState = makeGetUndefinedTest(getToEmptyState, "getSource");
    mixins.testGetMimeTypeReturnsUndefinedInEmptyState = makeGetUndefinedTest(getToEmptyState, "getMimeType");
    mixins.testGetCurrentTimeReturnsUndefinedInEmptyState = makeGetUndefinedTest(getToEmptyState, "getCurrentTime");
    mixins.testGetRangeReturnsUndefinedInEmptyState = makeGetUndefinedTest(getToEmptyState, "getRange");

    mixins.testCallingPlayInEmptyStateIsAnError = makeErrorCallTest("play");
    mixins.testCallingPlayFromInEmptyStateIsAnError = makeErrorCallTest("playFrom");
    mixins.testCallingPauseInEmptyStateIsAnError = makeErrorCallTest("pause");
    mixins.testCallingStopInEmptyStateIsAnError = makeErrorCallTest("stop");
    mixins.testCallingResetInEmptyStateIsAnError = makeErrorCallTest("reset");

    mixins.testCallingSetSourceInEmptyStateGoesToStoppedState = function (queue) {
        expectAsserts(5); 
        this.doTest(queue, function (MediaPlayer) {
            this.mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType")
            assertEquals(MediaPlayer.STATE.STOPPED, this.mediaPlayer.getState());
            assertEquals("testUrl", this.mediaPlayer.getSource());
            assertEquals("testMimeType", this.mediaPlayer.getMimeType());
            this.assertEvent({
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

//    var getToStoppedState = function () {
//        this.mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType")
//    };

//    mixins.testGetCurrentTimeReturnsUndefinedInStoppedState = makeGetUndefinedTest(getToStoppedState, "getCurrentTime");
//    mixins.testGetRangeReturnsUndefinedInStoppedState = makeGetUndefinedTest(getToStoppedState, "getRange");

//    mixins.testCallingSetSourceInEmptyStateIsAnError = makeErrorCallTest("setSource");
//    mixins.testCallingStopInEmptyStateIsAnError = makeErrorCallTest("stop");
//    mixins.testCallingStopInEmptyStateIsAnError = makeErrorCallTest("stop");

    // Then similar tests to above...
    // Helper to get to the STOPPED state
    // Include test for reset() to go back to empty state...



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