/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
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
    this.MediaPlayerTest = AsyncTestCase("MediaPlayerTest");

    this.MediaPlayerTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.MediaPlayerTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.MediaPlayerTest.prototype.testMediaPlayerInitDoesNotThrowAnExceptionWhenCalled = function (queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/devices/mediaplayer/mediaplayer"], function(MediaPlayer) {
            assertNoException(function() {
                new MediaPlayer();
            });
        });
    };

    var createSubClass = function(MediaPlayer) {
        var range = { start: 0, end: 100 };
        var currentTime = 0;
        return MediaPlayer.extend({
            getClampedTime: function(seconds, within) {
                range = within;
                return this._getClampedTime(seconds);
            },
            isNearToCurrentTime: function (seconds, currentTimeOverride) {
                range = { start: -10000, end: 10000};
                currentTime = currentTimeOverride;
                return this._isNearToCurrentTime(seconds);
            },
            doEvent: function(type) {
                this._emitEvent(type);
            },
            getSource: function () { return "url"; },
            getMimeType: function () { return "mime/type"; },
            getCurrentTime: function () { return currentTime; },
            getSeekableRange: function () { return range; },
            getDuration: function () { return range.end; },
            getState: function () { return MediaPlayer.STATE.PLAYING; }
        });
    };

    var getConfig = function() {
        return {"modules":{"base":"antie/devices/browserdevice","modifiers":[]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};
    };

    this.MediaPlayerTest.prototype.testEventsEmittedBySubclassGoToAddedCallbackWithAllMetadata = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/devices/mediaplayer/mediaplayer"], function(MediaPlayer) {

            var SubClass = createSubClass(MediaPlayer);
            var instance = new SubClass();
            var callback = this.sandbox.stub();

            instance.addEventCallback(null, callback);
            instance.doEvent(MediaPlayer.EVENT.STATUS);

            assert(callback.calledOnce);
            assert(callback.calledWith({
                type: MediaPlayer.EVENT.STATUS,
                currentTime: 0,
                seekableRange: { start: 0, end: 100 },
                duration: 100,
                url: "url",
                mimeType: "mime/type",
                state: MediaPlayer.STATE.PLAYING
            }));
        });
    };

    this.MediaPlayerTest.prototype.testEventsEmittedBySubclassHaveMetaDataCollectedFromAccessors = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/devices/mediaplayer/mediaplayer"], function(MediaPlayer) {

            var SubClass = MediaPlayer.extend({
                doEvent: function(type) {
                    this._emitEvent(type);
                },
                getSource: function () { return "url2"; },
                getMimeType: function () { return "mime/type2"; },
                getCurrentTime: function () { return 2; },
                getSeekableRange: function () { return { start: 22, end: 200 }; },
                getDuration: function () { return 666; },
                getState: function () { return MediaPlayer.STATE.BUFFERING; }
            });

            var instance = new SubClass();
            var callback = this.sandbox.stub();

            instance.addEventCallback(null, callback);
            instance.doEvent(MediaPlayer.EVENT.BUFFERING);

            assert(callback.calledOnce);
            assert(callback.calledWith({
                type: MediaPlayer.EVENT.BUFFERING,
                currentTime: 2,
                seekableRange: { start: 22, end: 200 },
                duration: 666,
                url: "url2",
                mimeType: "mime/type2",
                state: MediaPlayer.STATE.BUFFERING
            }));
        });
    };

    this.MediaPlayerTest.prototype.testEventsEmittedBySubclassDoNotGoToSpecificallyRemovedCallback = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/devices/mediaplayer/mediaplayer"], function(MediaPlayer) {

            var SubClass = createSubClass(MediaPlayer);
            var instance = new SubClass();
            var callback = this.sandbox.stub();
            var callback2 = this.sandbox.stub();

            instance.addEventCallback(null, callback);
            instance.addEventCallback(null, callback2);
            instance.removeEventCallback(null, callback);
            instance.doEvent(MediaPlayer.EVENT.STATUS);

            assert(callback.notCalled);
            assert(callback2.calledOnce);
        });
    };

    this.MediaPlayerTest.prototype.testEventsEmittedBySubclassDoNotGoToAnyRemovedCallback = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/devices/mediaplayer/mediaplayer"], function(MediaPlayer) {

            var SubClass = createSubClass(MediaPlayer);
            var instance = new SubClass();
            var callback = this.sandbox.stub();
            var callback2 = this.sandbox.stub();

            instance.addEventCallback(null, callback);
            instance.addEventCallback(null, callback2);
            instance.removeAllEventCallbacks();
            instance.doEvent(MediaPlayer.EVENT.STATUS);

            assert(callback.notCalled);
            assert(callback2.notCalled);
        });
    };

    this.MediaPlayerTest.prototype.testClampingCalculation = function (queue) {
        expectAsserts(18);

        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer"], function(application, MediaPlayer) {

            var SubClass = createSubClass(MediaPlayer);
            var instance = new SubClass();

            assertEquals(0,   instance.getClampedTime(-100, {start:0, end:100}));
            assertEquals(0,   instance.getClampedTime(0,    {start:0, end:100}));
            assertEquals(1,   instance.getClampedTime(1,    {start:0, end:100}));
            assertEquals(50,  instance.getClampedTime(50,   {start:0, end:100}));
            assertEquals(98,  instance.getClampedTime(98,   {start:0, end:100}));
            assertEquals(98.9,  instance.getClampedTime(98.9, {start:0, end:100}));
            assertEquals(98.9,  instance.getClampedTime(100,  {start:0, end:100}));
            assertEquals(98.9,  instance.getClampedTime(101,  {start:0, end:100}));
            assertEquals(98.9,  instance.getClampedTime(200,  {start:0, end:100}));

            assertEquals(50, instance.getClampedTime(0,  {start:50, end:100}));
            assertEquals(50, instance.getClampedTime(49, {start:50, end:100}));
            assertEquals(50, instance.getClampedTime(50, {start:50, end:100}));
            assertEquals(51, instance.getClampedTime(51, {start:50, end:100}));

            assertEquals(148,   instance.getClampedTime(148,   {start:50, end:150}));
            assertEquals(148.9, instance.getClampedTime(148.9, {start:50, end:150}));
            assertEquals(148.9, instance.getClampedTime(150,   {start:50, end:150}));
            assertEquals(148.9, instance.getClampedTime(151,   {start:50, end:150}));

            assertEquals(0, instance.getClampedTime(1,   {start:0, end:0.05}));

        });
    };

    this.MediaPlayerTest.prototype.testClampingCalculationWithOverriddenEndTime = function (queue) {
        var config = getConfig();
        config.streaming = {
            overrides: {
                clampOffsetFromEndOfRange: 10
            }
        };

        expectAsserts(4);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer"], function(application, MediaPlayer) {

            var SubClass = createSubClass(MediaPlayer);
            var instance = new SubClass();

            assertEquals(89,  instance.getClampedTime(89,   {start:0, end:100}));
            assertEquals(90,  instance.getClampedTime(90, {start:0, end:100}));
            assertEquals(90,  instance.getClampedTime(90.1,  {start:0, end:100}));

            assertEquals(0, instance.getClampedTime(1,   {start:0, end:0.05}));
        }, config);
    };

    this.MediaPlayerTest.prototype.testClampingCalculationWithEndTimeOffsetOfZero = function (queue) {
        var config = getConfig();
        config.streaming = {
            overrides: {
                clampOffsetFromEndOfRange: 0
            }
        };

        expectAsserts(3);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer"], function(application, MediaPlayer) {

            var SubClass = createSubClass(MediaPlayer);
            var instance = new SubClass();

            assertEquals(99,  instance.getClampedTime(99,   {start:0, end:100}));
            assertEquals(100,  instance.getClampedTime(100, {start:0, end:100}));
            assertEquals(100,  instance.getClampedTime(100.1,  {start:0, end:100}));
        }, config);
    };

    this.MediaPlayerTest.prototype.testIsNearToCurrentTimeCalculation = function (queue) {
        expectAsserts(14);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer"], function(application, MediaPlayer) {

            var SubClass = createSubClass(MediaPlayer);
            var instance = new SubClass();

            assertEquals(true,   instance.isNearToCurrentTime(0,      0));
            assertEquals(true,   instance.isNearToCurrentTime(1,      0));
            assertEquals(true,   instance.isNearToCurrentTime(-1,     0));
            assertEquals(false,   instance.isNearToCurrentTime(1.1,   0));
            assertEquals(false,   instance.isNearToCurrentTime(-1.1,  0));
            assertEquals(false,   instance.isNearToCurrentTime(1000,  0));
            assertEquals(false,   instance.isNearToCurrentTime(-1000, 0));

            assertEquals(true,   instance.isNearToCurrentTime(10,     10));
            assertEquals(true,   instance.isNearToCurrentTime(11,     10));
            assertEquals(true,   instance.isNearToCurrentTime(9,      10));
            assertEquals(false,   instance.isNearToCurrentTime(11.1,  10));
            assertEquals(false,   instance.isNearToCurrentTime(8.9,   10));
            assertEquals(false,   instance.isNearToCurrentTime(1000,  10));
            assertEquals(false,   instance.isNearToCurrentTime(-1000, 10));
        });
    };

    var testThatMediaPlayerFunctionThrowsError = function (action) {
        return function (queue) {
            expectAsserts(1);
            queuedRequire(queue, ["antie/devices/mediaplayer/mediaplayer"], function(MediaPlayer) {
                var mediaPlayer = new MediaPlayer();
                assertException(function() {
                    action(mediaPlayer);
                }, "Error");
            });
        };
    };

    this.MediaPlayerTest.prototype.testMediaPlayerSetSourceThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.setSource('url', 'mime');
    });

    this.MediaPlayerTest.prototype.testMediaPlayerPlayFromThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.playFrom("jumbo");
    });

    this.MediaPlayerTest.prototype.testMediaPlayerPauseThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.pause();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerResumeThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.resume();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerStopThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.stop();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerResetThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.reset();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerGetSourceThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.getSource();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerGetMimeTypeThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.getMimeType();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerGetCurrentTimeThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.getCurrentTime();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerGetSeekableRangeThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.getSeekableRange();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerGetDurationThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.getDuration();
    });

    this.MediaPlayerTest.prototype.testMediaPlayerGetStateThrowsAnExceptionWhenNotOverridden = testThatMediaPlayerFunctionThrowsError(function(mediaPlayer) {
        mediaPlayer.getState();
    });

})();
