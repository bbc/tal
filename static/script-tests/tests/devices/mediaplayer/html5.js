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
    this.HTML5MediaPlayerTests = AsyncTestCase("HTML5MediaPlayer");

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/html5"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    this.HTML5MediaPlayerTests.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.HTML5MediaPlayerTests.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.HTML5MediaPlayerTests.prototype.testGettingMediaPlayerGivesHTML5VersionWhenModifierProvider = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/html5"],
            function(application, HTML5MediaPlayer) {

                var device = application.getDevice();
                var instance = device.getMediaPlayer();

                assertInstanceOf(HTML5MediaPlayer, instance);
            }, config);
    };

    this.HTML5MediaPlayerTests.prototype.testGettingMediaPlayerRepeatedlyReturnsSameObject = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/html5"],
            function(application, HTML5MediaPlayer) {

                var device = application.getDevice();
                var instance = device.getMediaPlayer();
                var instance2 = device.getMediaPlayer();

                assertSame(instance, instance2);

            }, config);
    };


    // Helpers for standard MediaPlayer tests : These helpers and most of the tests will be shareable with the other implementations...

    this.HTML5MediaPlayerTests.prototype.doTest = function (queue, test) {
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

    this.HTML5MediaPlayerTests.prototype.assertMediaPlayerError = function (MediaPlayer) {
        assertEquals(MediaPlayer.STATE.ERROR, this.mediaPlayer.getState());
        assertEquals(1, this.eventCallback.callCount);
        assertEquals({
            state: MediaPlayer.STATE.ERROR,
            currentTime: undefined,
            range: undefined,
            url: undefined,
            mimeType: undefined,
            type: MediaPlayer.EVENT.ERROR
        }, this.eventCallback.getCall(0).args[0]);
    };

    var makeGetUndefinedTest = function (apiCall) {
        var test = function (queue) {
            expectAsserts(1);
            this.doTest(queue, function (MediaPlayer) {
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

    // Empty state tests

    this.HTML5MediaPlayerTests.prototype.testMediaPlayerStartsInEmptyState = function (queue) {
        expectAsserts(1); 
        this.doTest(queue, function (MediaPlayer) {
            assertEquals(MediaPlayer.STATE.EMPTY, this.mediaPlayer.getState());
        });
    };

    this.HTML5MediaPlayerTests.prototype.testGetSourceReturnsUndefinedInEmptyState = makeGetUndefinedTest("getSource");
    this.HTML5MediaPlayerTests.prototype.testGetMimeTypeReturnsUndefinedInEmptyState = makeGetUndefinedTest("getMimeType");
    this.HTML5MediaPlayerTests.prototype.testGetCurrentTimeReturnsUndefinedInEmptyState = makeGetUndefinedTest("getCurrentTime");
    this.HTML5MediaPlayerTests.prototype.testGetRangeReturnsUndefinedInEmptyState = makeGetUndefinedTest("getRange");

    this.HTML5MediaPlayerTests.prototype.testCallingPlayInEmptyStateIsAnError = makeErrorCallTest("play");
    this.HTML5MediaPlayerTests.prototype.testCallingPlayFromInEmptyStateIsAnError = makeErrorCallTest("playFrom");
    this.HTML5MediaPlayerTests.prototype.testCallingPauseInEmptyStateIsAnError = makeErrorCallTest("pause");
    this.HTML5MediaPlayerTests.prototype.testCallingStopInEmptyStateIsAnError = makeErrorCallTest("stop");
    this.HTML5MediaPlayerTests.prototype.testCallingResetInEmptyStateIsAnError = makeErrorCallTest("reset");

    this.HTML5MediaPlayerTests.prototype.testCallingSetSourceInEmptyStateGoesToStoppedState = function (queue) {
        expectAsserts(3); 
        this.doTest(queue, function (MediaPlayer) {
            this.mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType")
            assertEquals(MediaPlayer.STATE.STOPPED, this.mediaPlayer.getState());
            assertEquals("testUrl", this.mediaPlayer.getSource());
            assertEquals("testMimeType", this.mediaPlayer.getMimeType());
        });
    };

})();
