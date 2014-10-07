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

    var stubCreateElementResults = undefined;
    var mediaEventListeners = undefined;
    var stubCreateElement = function (sandbox, application) {

        var device = application.getDevice();

        var stubFunc = function(type, id) {
            if (id && stubCreateElementResults[type]) {
                stubCreateElementResults[type].id = id;
            }

            return stubCreateElementResults[type];
        };

        return sandbox.stub(device, "_createElement", stubFunc);
    };

    // Setup device specific mocking
    var deviceMockingHooks = {
        setup: function(sandbox, application) {
            stubCreateElement(sandbox,application);
        },
        sendMetadata: function(mediaPlayer, currentTime, range) {
            var mediaElements = [stubCreateElementResults.video, stubCreateElementResults.audio];
            for (var i = 0; i < mediaElements.length; i++) {
                var media = mediaElements[i];
                media.duration = range.end;
                media.currentTime = currentTime;
            }
            mediaEventListeners.loadedmetadata();
        },
        finishBuffering: function(mediaPlayer) {
            mediaEventListeners.canplay();
        },
        emitPlaybackError: function(mediaPlayer, errorCode) {

            // MEDIA_ERR_NETWORK == 2
            errorCode = errorCode !== undefined ? errorCode : 2;
            // This code, or higher, is needed for the error event. A value of 1 should result in an abort event.
            // See http://www.w3.org/TR/2011/WD-html5-20110405/video.html
            stubCreateElementResults.video.error =  { code: errorCode };
            stubCreateElementResults.audio.error =  { code: errorCode };

            var errorEvent = {
                type: "error"
            };
            mediaEventListeners.error(errorEvent);
        },
        reachEndOfMedia: function(mediaPlayer) {
            var endedEvent = {
                type: "ended"
            };
            mediaEventListeners.ended(endedEvent);
        },
        startBuffering: function(mediaPlayer) {
            var waitingEvent = {
                type: "waiting"
            };
            mediaEventListeners.waiting(waitingEvent);
        },
        mockTime: function(mediaplayer) {
        },
        makeOneSecondPass: function(mediaplayer) {
            var timeUpdateEvent = {
                type: "timeupdate"
            };
            mediaEventListeners.timeupdate(timeUpdateEvent);
        },
        unmockTime: function(mediaplayer) {
        }
    };

    this.HTML5MediaPlayerTests.prototype.mixTestsIntoSubModifier = function(destination) {
        var source = this;
        for (var name in source) {
            if (source.hasOwnProperty(name)) {
                destination[name] = source[name];
            }
        }
    };

    this.HTML5MediaPlayerTests.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();

        // We will use a div to provide fake elements for video and audio elements. This is to get around browser
        // implementations of the media elements preventing you from doing particular things unless a video has been
        // loaded and is in the right state, for example you might receive:
        //      InvalidStateError: Failed to set the 'currentTime' property on 'HTMLMediaElement': The element's readyState is HAVE_NOTHING
        stubCreateElementResults = {
            video: document.createElement("div"),
            audio: document.createElement("div"),
        };
        mediaEventListeners = {};
        var self = this;
        var mediaElements = [stubCreateElementResults.video, stubCreateElementResults.audio];
        for (var i = 0; i < mediaElements.length; i++) {
            var media = mediaElements[i];
            media.play = this.sandbox.stub();
            media.pause = this.sandbox.stub();
            media.load = this.sandbox.stub();
            media.addEventListener = function (event, callback) {
                if (mediaEventListeners[event]) { throw "Listener already registered on media mock for event: " + event; }
                mediaEventListeners[event] = callback;
            };
            media.removeEventListener = this.sandbox.stub();
        }

        this.stubCreateElementResults = stubCreateElementResults;
        this.deviceMockingHooks = deviceMockingHooks;
    };

    this.HTML5MediaPlayerTests.prototype.tearDown = function() {
        this.sandbox.restore();

        // Ensure we have a clean DOM
        var elementsToRemove = [ 'mediaPlayerVideo', 'mediaPlayerAudio' ];
        for (var i = 0; i < elementsToRemove.length; i++) {
            var element = document.getElementById(elementsToRemove[i]);
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }

    };

    var runMediaPlayerTest = function (self, queue, action) {
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer"],
            function(application, MediaPlayer) {
                self._createElementStub = stubCreateElement(self.sandbox, application);
                self._device = application.getDevice();
                self._mediaPlayer = self._device.getMediaPlayer();
                self._clock = sinon.useFakeTimers();
                try {
                    action.call(self, MediaPlayer);
                }
                finally {
                    self._clock.restore();
                }
            }, config);
    };

    //---------------------
    // HTML5 specific tests
    //---------------------

    this.HTML5MediaPlayerTests.prototype.testVideoElementCreatedWhenSettingSourceWithVideoType = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            assert(self._createElementStub.calledWith("video", "mediaPlayerVideo"));
        });
    };

    this.HTML5MediaPlayerTests.prototype.testAudioElementCreatedWhenSettingSourceWithAudioType = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.AUDIO, 'testURL', 'audio/mp4');

            assert(self._createElementStub.calledWith("audio", "mediaPlayerAudio"));
        });
    };

    this.HTML5MediaPlayerTests.prototype.testCreatedVideoElementIsPutAtBackOfDOM = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var body = document.getElementsByTagName("body")[0];
            assertSame(stubCreateElementResults.video, body.firstChild);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testVideoElementIsRemovedFromDOMOnReset = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            self._mediaPlayer.reset();

            var searchResult = document.getElementById('mediaPlayerVideo');

            assertNull(searchResult);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testCreatedAudioElementIsPutAtBackOfDOM = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.AUDIO, 'testURL', 'audio/mp4');

            var body = document.getElementsByTagName("body")[0];
            assertSame(stubCreateElementResults.audio, body.firstChild);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testAudioElementIsRemovedFromDOMOnReset = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.AUDIO, 'testURL', 'audio/mp4');
            self._mediaPlayer.reset();

            var searchResult = document.getElementById('mediaPlayerAudio');

            assertNull(searchResult);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testSourceURLSetOnSetSource = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            assertEquals('http://testurl/', stubCreateElementResults.video.src);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testIfDurationIsMissingGetRangeReturnsUndefinedAndLogsAWarning = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            var warnStub = self.sandbox.stub();
            self.sandbox.stub(self._device, "getLogger").returns({warn: warnStub});
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            delete stubCreateElementResults.video.duration;
            assertUndefined(self._mediaPlayer.getRange());
            assert(warnStub.calledWith("'duration' property missing from media element"));
        });
    };

    this.HTML5MediaPlayerTests.prototype.testGetRangeGetsEndTimeFromDuration = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            stubCreateElementResults.video.duration = 60;
            assertEquals({ start: 0, end: 60 }, self._mediaPlayer.getRange());
        });
    };

    this.HTML5MediaPlayerTests.prototype.testVideoElementIsFullScreen = function(queue) {
        expectAsserts(6);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assertEquals("absolute", stubCreateElementResults.video.style.position);
            assertEquals("0px", stubCreateElementResults.video.style.top);
            assertEquals("0px", stubCreateElementResults.video.style.left);
            assertEquals("100%", stubCreateElementResults.video.style.width);
            assertEquals("100%", stubCreateElementResults.video.style.height);
            assertEquals("", stubCreateElementResults.video.style.zIndex);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testAutoplayIsTurnedOffOnMediaElementCreation = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assertBoolean(stubCreateElementResults.video.autoplay);
            assertFalse(stubCreateElementResults.video.autoplay);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testErrorEventFromMediaElementCausesErrorTransitionWithCodeLogged = function(queue) {
        expectAsserts(3);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {

            var errorStub = self.sandbox.stub();
            self.sandbox.stub(self._device, "getLogger").returns({error: errorStub});

            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            assertFunction(mediaEventListeners.error);

            stubCreateElementResults.video.error =  { code: 2 }; // MEDIA_ERR_NETWORK - http://www.w3.org/TR/2011/WD-html5-20110405/video.html#dom-media-error

            deviceMockingHooks.emitPlaybackError(self._mediaPlayer);

            assertEquals(MediaPlayer.STATE.ERROR, self._mediaPlayer.getState());
            assert(errorStub.calledWith("Media element emitted error with code: 2"));
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPausePassedThroughToMediaElementWhenInPlayingState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            self._mediaPlayer.pause();

            assert(stubCreateElementResults.video.pause.calledOnce);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayCalledOnMediaElementWhenResumeInPausedState = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            self._mediaPlayer.pause();
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            assertEquals(MediaPlayer.STATE.PAUSED, self._mediaPlayer.getState());

            self._mediaPlayer.resume();

            assert(stubCreateElementResults.video.play.calledTwice);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPausePassedThroughToMediaElementWhenInBufferedState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            self._mediaPlayer.pause();
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            assert(stubCreateElementResults.video.pause.calledOnce);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testLoadCalledOnMediaElementWhenSetSourceIsCalled = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assert(stubCreateElementResults.video.load.calledOnce);
        });
    };

      this.HTML5MediaPlayerTests.prototype.testMediaElementPreloadAttributeIsSetToAuto = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assertEquals("auto", stubCreateElementResults.video.preload);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromSetsCurrentTimeAndCallsPlayOnMediaElementWhenInPlayingState = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            self._mediaPlayer.playFrom(10);

            assert(stubCreateElementResults.video.play.calledTwice);
            assertEquals(10, stubCreateElementResults.video.currentTime);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromClampsWhenCalledInPlayingState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            self._mediaPlayer.playFrom(110);

            assertEquals(99.9, stubCreateElementResults.video.currentTime);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromSetsCurrentTimeAndCallsPlayOnMediaElementWhenInCompleteState = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            deviceMockingHooks.reachEndOfMedia(self._mediaPlayer);
            self._mediaPlayer.playFrom(10);

            assert(stubCreateElementResults.video.play.calledTwice);
            assertEquals(10, stubCreateElementResults.video.currentTime);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromSetsCurrentTimeAndCallsPlayOnMediaElementWhenInPausedState = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            self._mediaPlayer.pause();
            self._mediaPlayer.playFrom(10);

            assert(stubCreateElementResults.video.play.calledTwice);
            assertEquals(10, stubCreateElementResults.video.currentTime);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromSetsCurrentTimeAndCallsPlayOnMediaElementWhenInStoppedState = function(queue) {
        expectAsserts(7);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(50);
            assertFalse(stubCreateElementResults.video.play.called);
            assertEquals(MediaPlayer.STATE.BUFFERING, self._mediaPlayer.getState());
            assertUndefined(stubCreateElementResults.video.currentTime);

            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            assert(stubCreateElementResults.video.play.called);
            assertEquals(MediaPlayer.STATE.BUFFERING, self._mediaPlayer.getState());
            assertEquals(50, stubCreateElementResults.video.currentTime);

            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            assertEquals(MediaPlayer.STATE.PLAYING, self._mediaPlayer.getState());
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromClampsWhenCalledInStoppedState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(110);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            assertEquals(99.9, stubCreateElementResults.video.currentTime);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromThenPauseSetsCurrentTimeAndCallsPauseOnMediaElementWhenInStoppedState = function(queue) {
        expectAsserts(8);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(50);
            self._mediaPlayer.pause();

            assertFalse(stubCreateElementResults.video.play.called);
            assertFalse(stubCreateElementResults.video.pause.called);
            assertEquals(MediaPlayer.STATE.BUFFERING, self._mediaPlayer.getState());
            assertUndefined(stubCreateElementResults.video.currentTime);

            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            assert(stubCreateElementResults.video.pause.called);
            assertEquals(MediaPlayer.STATE.BUFFERING, self._mediaPlayer.getState());
            assertEquals(50, stubCreateElementResults.video.currentTime);
            sinon.assert.callOrder(stubCreateElementResults.video.play, stubCreateElementResults.video.pause);

            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            assertEquals(MediaPlayer.STATE.PAUSED, self._mediaPlayer.getState());
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromZeroThenPauseDefersCallToPauseOnMediaElementWhenInStoppedState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            self._mediaPlayer.pause();
            assertFalse(stubCreateElementResults.video.pause.called);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromSetsCurrentTimeAndCallsPlayOnMediaElementWhenInBufferingStateAndDontHaveMetadata = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            self._mediaPlayer.playFrom(10);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assert(stubCreateElementResults.video.play.calledOnce);
            assertEquals(10, stubCreateElementResults.video.currentTime);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromClampsWhenCalledInBufferingStateAndDontHaveMetadata = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            self._mediaPlayer.playFrom(110);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assertEquals(99.9, stubCreateElementResults.video.currentTime);
        });
    };

     this.HTML5MediaPlayerTests.prototype.testPlayFromSetsCurrentTimeAndCallsPlayOnMediaElementWhenInBufferingStateAndHasMetadata = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            self._mediaPlayer.playFrom(10);
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assert(stubCreateElementResults.video.play.calledTwice);
            assertEquals(10, stubCreateElementResults.video.currentTime);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromClampsWhenCalledInBufferingStateAndHasMetadata = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            self._mediaPlayer.playFrom(110);
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assertEquals(99.9, stubCreateElementResults.video.currentTime);
        });
    };

     this.HTML5MediaPlayerTests.prototype.testStopWhenInBufferingState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            self._mediaPlayer.stop();

            assert(stubCreateElementResults.video.pause.calledOnce);
        });
    };

     this.HTML5MediaPlayerTests.prototype.testStopWhenInPlayingState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            self._mediaPlayer.stop();

            assert(stubCreateElementResults.video.pause.calledOnce);
        });
    };

     this.HTML5MediaPlayerTests.prototype.testStopWhenInPausedState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            self._mediaPlayer.pause();
            self._mediaPlayer.stop();

            assert(stubCreateElementResults.video.pause.calledTwice);
        });
    };

     this.HTML5MediaPlayerTests.prototype.testStopWhenInCompleteState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            deviceMockingHooks.reachEndOfMedia(self._mediaPlayer);
            self._mediaPlayer.stop();

            assert(stubCreateElementResults.video.pause.calledOnce);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testResetRemoveAllEventListenersFromTheMediaElement = function(queue) {
        expectAsserts(8);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.reset();

            for (var eventName in mediaEventListeners) {
                if (mediaEventListeners.hasOwnProperty(eventName)) {
                    assert('Removed listener for ' + eventName, stubCreateElementResults.video.removeEventListener.withArgs(eventName).called);
                }
            }
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromCurrentTimeWhenPlayingGoesToBufferingThenToPlaying = function(queue) {
        var currentAndTargetTime = 50;
        doTestPlayFromNearCurrentTimeWhenPlayingGoesToBufferingThenToPlaying(this, queue, currentAndTargetTime, currentAndTargetTime);
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromJustBeforeCurrentTimeWhenPlayingGoesToBufferingThenToPlaying = function(queue) {
        var currentTime = 50.999;
        var targetTime = 50;
        doTestPlayFromNearCurrentTimeWhenPlayingGoesToBufferingThenToPlaying(this, queue, currentTime, targetTime);
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromJustAfterCurrentTimeWhenPlayingGoesToBufferingThenToPlaying = function(queue) {
        var currentTime = 50;
        var targetTime = 50.999;
        doTestPlayFromNearCurrentTimeWhenPlayingGoesToBufferingThenToPlaying(this, queue, currentTime, targetTime);
    };

    var doTestPlayFromNearCurrentTimeWhenPlayingGoesToBufferingThenToPlaying = function(self, queue, currentTime, targetTime) {
        expectAsserts(4);
        runMediaPlayerTest(self, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PLAYING, self._mediaPlayer.getState());

            var eventCallback = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventCallback);
            stubCreateElementResults.video.currentTime = currentTime;

            self._mediaPlayer.playFrom(targetTime);

            assert(eventCallback.calledTwice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventCallback.args[0][0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventCallback.args[1][0].type);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromCurrentTimeWhenPausedGoesToBufferingThenToPlaying = function(queue) {
        expectAsserts(7);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assert(stubCreateElementResults.video.play.calledOnce);

            stubCreateElementResults.video.currentTime = 50;

            self._mediaPlayer.pause();

            assertEquals(MediaPlayer.STATE.PAUSED, self._mediaPlayer.getState());

            var eventCallback = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventCallback);

            self._mediaPlayer.playFrom(50);

            assert(stubCreateElementResults.video.play.calledTwice);

            assert(eventCallback.calledOnce);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventCallback.args[0][0].type);

            mediaEventListeners.playing();

            assert(eventCallback.calledTwice);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventCallback.args[1][0].type);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromAfterMetadata = function(queue) {
        expectAsserts(3);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });

            self._mediaPlayer.playFrom(50);
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PLAYING, self._mediaPlayer.getState());
            assertEquals(50, stubCreateElementResults.video.currentTime);
            assert(stubCreateElementResults.video.play.calledOnce);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromCurrentTimeWhenPlayedThenStoppedGoesToBufferingThenToPlaying = function(queue) {
        expectAsserts(5);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            stubCreateElementResults.video.currentTime = 50;

            self._mediaPlayer.stop();

            var eventCallback = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventCallback);

            self._mediaPlayer.playFrom(50);

            assert(stubCreateElementResults.video.play.calledTwice);

            assert(eventCallback.calledOnce);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventCallback.args[0][0].type);

            mediaEventListeners.playing();

            assert(eventCallback.calledTwice);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventCallback.args[1][0].type);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testPlayFromBufferedTimeWhenPlayingGoesToBufferingThenToPlaying = function(queue) {
        expectAsserts(4);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            var eventCallback = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventCallback);
            stubCreateElementResults.video.currentTime = 50;

            self._mediaPlayer.playFrom(25);

            assert(eventCallback.calledOnce);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventCallback.args[0][0].type);

            mediaEventListeners.seeked();

            assert(eventCallback.calledTwice);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventCallback.args[1][0].type);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testWaitingHtml5EventWhileBufferingOnlyGivesSingleBufferingEvent = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            var eventCallback = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventCallback);

            self._mediaPlayer.playFrom(0);
            mediaEventListeners.waiting();

            assert(eventCallback.calledOnce);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventCallback.args[0][0].type);
        });
    };

    this.HTML5MediaPlayerTests.prototype.testResetUnloadsMediaElementSourceAsPerGuidelines = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            stubCreateElementResults.video.load.reset();
            self.sandbox.stub(stubCreateElementResults.video, 'removeAttribute');

            self._mediaPlayer.reset();

            assert(stubCreateElementResults.video.removeAttribute.withArgs('src').calledOnce);
            assert(stubCreateElementResults.video.load.calledOnce);
        });
    };

    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all MediaPlayer implementations (last, so it can detect conflicts)
    window.mixinCommonMediaTests(this.HTML5MediaPlayerTests, "antie/devices/mediaplayer/html5", this.HTML5MediaPlayerTests.prototype.config, deviceMockingHooks);

})();
