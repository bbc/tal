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
window.commonTests.mediaPlayer.html5 = window.commonTests.mediaPlayer.html5 || { };

window.commonTests.mediaPlayer.html5.mixinTests = function (testCase, mediaPlayerDeviceModifierRequireName, config) {


    var mixins = { };

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
                media.seekable.start.returns(0);
                media.seekable.end.returns(range.end);
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
            var mediaElements = [stubCreateElementResults.video, stubCreateElementResults.audio];
            for (var i = 0; i < mediaElements.length; i++) {
                var media = mediaElements[i];
                media.currentTime = media.duration;
            }
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

    mixins.mixTestsIntoSubModifier = function(destination) {
        var source = this;
        for (var name in source) {
            if (source.hasOwnProperty(name)) {
                destination[name] = source[name];
            }
        }
    };

    mixins.setUp = function() {
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
        var mediaElements = [stubCreateElementResults.video, stubCreateElementResults.audio];
        for (var i = 0; i < mediaElements.length; i++) {
            var media = mediaElements[i];
            media.play = this.sandbox.stub();
            media.pause = this.sandbox.stub();
            media.load = this.sandbox.stub();
            media.currentTime = 0;

            media.seekable = ['timeRange'];
            media.seekable.start = this.sandbox.stub();
            media.seekable.end = this.sandbox.stub();

            media.addEventListener = function (event, callback) {
                if (mediaEventListeners[event]) { throw "Listener already registered on media mock for event: " + event; }
                mediaEventListeners[event] = callback;
            };
            media.removeEventListener = this.sandbox.stub();
        }

        this.stubCreateElementResults = stubCreateElementResults;
        this.deviceMockingHooks = deviceMockingHooks;
        this.runMediaPlayerTest = runMediaPlayerTest;
    };

    mixins.tearDown = function() {
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

                self._eventCallback = self.sandbox.stub();
                self._mediaPlayer.addEventCallback(null, self._eventCallback);

                self._clock = sinon.useFakeTimers();
                try {
                    action.call(self, MediaPlayer);
                }
                finally {
                    self._clock.restore();
                }
            }, config);
    };

    var fireSentinels = function (self) {
        self._clock.tick(1100);
    };

    var getToBuffering = function(self, MediaPlayer) {
        self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
        self._mediaPlayer.playFrom(0);
        deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
    };

    var getToPlaying = function (self, MediaPlayer) {
        getToBuffering(self, MediaPlayer);
        deviceMockingHooks.finishBuffering(self._mediaPlayer);
    };

    var assertState = function(self, expectedState) {
        assertEquals(expectedState, self._mediaPlayer.getState());
    };

    var assertEvent = function(self, eventType) {
        var found = false
        for( i = 0; i < self._eventCallback.args.length; i++) {
            if(eventType === self._eventCallback.args[i][0].type) {
                found = true;
                break;
            }
        }
        assert(found);
    };

    var assertNoEvents = function(self) {
        assert(self._eventCallback.notCalled);
    };

    var clearEvents = function(self) {
        self._eventCallback.reset();
    };

    var advancePlayTime = function(self) {
        stubCreateElementResults.video.currentTime += 1;
    };

    //---------------------
    // HTML5 specific tests
    //---------------------

    mixins.testVideoElementCreatedWhenSettingSourceWithVideoType = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            assert(self._createElementStub.calledWith("video", "mediaPlayerVideo"));
        });
    };

    mixins.testAudioElementCreatedWhenSettingSourceWithAudioType = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.AUDIO, 'testURL', 'audio/mp4');

            assert(self._createElementStub.calledWith("audio", "mediaPlayerAudio"));
        });
    };

    mixins.testCreatedVideoElementIsPutAtBackOfDOM = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var body = document.getElementsByTagName("body")[0];
            assertSame(stubCreateElementResults.video, body.firstChild);
        });
    };

    mixins.testVideoElementIsRemovedFromDOMOnReset = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            self._mediaPlayer.reset();

            var searchResult = document.getElementById('mediaPlayerVideo');

            assertNull(searchResult);
        });
    };

    mixins.testCreatedAudioElementIsPutAtBackOfDOM = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.AUDIO, 'testURL', 'audio/mp4');

            var body = document.getElementsByTagName("body")[0];
            assertSame(stubCreateElementResults.audio, body.firstChild);
        });
    };

    mixins.testAudioElementIsRemovedFromDOMOnReset = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.AUDIO, 'testURL', 'audio/mp4');
            self._mediaPlayer.reset();

            var searchResult = document.getElementById('mediaPlayerAudio');

            assertNull(searchResult);
        });
    };

    mixins.testSourceURLSetOnSetSource = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            assertEquals('http://testurl/', stubCreateElementResults.video.src);
        });
    };

    mixins.testIfDurationAndSeekableRangeIsMissingGetRangeReturnsUndefinedAndLogsAWarning = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            var warnStub = self.sandbox.stub();
            self.sandbox.stub(self._device, "getLogger").returns({warn: warnStub});
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            delete stubCreateElementResults.video.seekable;
            delete stubCreateElementResults.video.duration;
            assertUndefined(self._mediaPlayer.getRange());
            assert(warnStub.calledWith("No 'duration' or 'seekable' on media element"));
        });
    };

    mixins.testSeekableRangeTakesPrecedenceOverDurationOnMediaElement = function(queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            stubCreateElementResults.video.seekable.start.returns(10);
            stubCreateElementResults.video.seekable.end.returns(30);
            stubCreateElementResults.video.duration = 60;
            assertEquals({ start: 10, end: 30 }, self._mediaPlayer.getRange());
        });
    };

    mixins.testGetRangeGetsEndTimeFromDurationWhenNoSeekableProperty = function(queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            delete stubCreateElementResults.video.seekable;
            stubCreateElementResults.video.duration = 60;
            assertEquals({ start: 0, end: 60 }, self._mediaPlayer.getRange());
        });
    };

    mixins.testGetRangeGetsEndTimeFromDurationWhenNoTimeRangesInSeekableProperty = function(queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            stubCreateElementResults.video.seekable = [];
            stubCreateElementResults.video.duration = 60;
            assertEquals({ start: 0, end: 60 }, self._mediaPlayer.getRange());
        });
    };

    mixins.testGetRangeGetsEndTimeFromFirstTimeRangeInSeekableProperty = function(queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            stubCreateElementResults.video.seekable.start.withArgs(0).returns(0);
            stubCreateElementResults.video.seekable.end.withArgs(0).returns(60);
            stubCreateElementResults.video.seekable.start.withArgs(1).returns(333);
            stubCreateElementResults.video.seekable.end.withArgs(1).returns(666);

            assertEquals({ start: 0, end: 60 }, self._mediaPlayer.getRange());
        });
    };

    mixins.testVideoElementIsFullScreen = function(queue) {
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

    mixins.testAutoplayIsTurnedOffOnMediaElementCreation = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assertBoolean(stubCreateElementResults.video.autoplay);
            assertFalse(stubCreateElementResults.video.autoplay);
        });
    };

    mixins.testErrorEventFromMediaElementCausesErrorTransitionWithCodeLogged = function(queue) {
        expectAsserts(3);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {

            var errorStub = self.sandbox.stub();
            self.sandbox.stub(self._device, "getLogger").returns({error: errorStub});

            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            assertFunction(mediaEventListeners.error);

            stubCreateElementResults.video.error =  { code: 2 }; // MEDIA_ERR_NETWORK - http://www.w3.org/TR/2011/WD-html5-20110405/video.html#dom-media-error

            deviceMockingHooks.emitPlaybackError(self._mediaPlayer);

            assertState(self, MediaPlayer.STATE.ERROR);
            assert(errorStub.calledWith("Media element emitted error with code: 2"));
        });
    };

    mixins.testPausePassedThroughToMediaElementWhenInPlayingState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);
            self._mediaPlayer.pause();

            assert(stubCreateElementResults.video.pause.calledOnce);
        });
    };

    mixins.testPlayCalledOnMediaElementWhenResumeInPausedState = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            self._mediaPlayer.pause();
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            assertState(self, MediaPlayer.STATE.PAUSED);

            stubCreateElementResults.video.play.reset();

            self._mediaPlayer.resume();

            assert(stubCreateElementResults.video.play.calledOnce);
        });
    };

    mixins.testPausePassedThroughToMediaElementWhenInBufferedState = function(queue) {
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

    mixins.testLoadCalledOnMediaElementWhenSetSourceIsCalled = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assert(stubCreateElementResults.video.load.calledOnce);
        });
    };

      mixins.testMediaElementPreloadAttributeIsSetToAuto = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assertEquals("auto", stubCreateElementResults.video.preload);
        });
    };

    mixins.testPlayFromSetsCurrentTimeAndCallsPlayOnMediaElementWhenInPlayingState = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);

            stubCreateElementResults.video.play.reset();

            self._mediaPlayer.playFrom(10);

            assert(stubCreateElementResults.video.play.called);
            assertEquals(10, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testPlayFromClampsWhenCalledInPlayingState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);
            self._mediaPlayer.playFrom(110);

            assertEquals(99.9, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testPlayFromSetsCurrentTimeAndCallsPlayOnMediaElementWhenInCompleteState = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);
            deviceMockingHooks.reachEndOfMedia(self._mediaPlayer);

            stubCreateElementResults.video.play.reset();

            self._mediaPlayer.playFrom(10);

            assert(stubCreateElementResults.video.play.called);
            assertEquals(10, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testPlayFromSetsCurrentTimeAndCallsPlayOnMediaElementWhenInPausedState = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);
            self._mediaPlayer.pause();

            stubCreateElementResults.video.play.reset();

            self._mediaPlayer.playFrom(10);

            assert(stubCreateElementResults.video.play.called);
            assertEquals(10, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testPlayFromSetsCurrentTimeAndCallsPlayOnMediaElementWhenInStoppedState = function(queue) {
        expectAsserts(6);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(50);
            assertFalse(stubCreateElementResults.video.play.called);
            assertState(self, MediaPlayer.STATE.BUFFERING);

            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            assert(stubCreateElementResults.video.play.called);
            assertState(self, MediaPlayer.STATE.BUFFERING);
            assertEquals(50, stubCreateElementResults.video.currentTime);

            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            assertState(self, MediaPlayer.STATE.PLAYING);
        });
    };

    mixins.testBeginPlaybackCallsPlayOnMediaElementWhenInStoppedState = function(queue) {
        expectAsserts(4);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.beginPlayback();
            assert(stubCreateElementResults.video.play.called);
            assertState(self, MediaPlayer.STATE.BUFFERING);


            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            assertState(self, MediaPlayer.STATE.BUFFERING);

            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            assertState(self, MediaPlayer.STATE.PLAYING);
        });
    };

    mixins.testPlayFromClampsWhenCalledInStoppedState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(110);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            assertEquals(99.9, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testPlayFromThenPauseSetsCurrentTimeAndCallsPauseOnMediaElementWhenInStoppedState = function(queue) {
        expectAsserts(7);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(50);
            self._mediaPlayer.pause();

            assertFalse(stubCreateElementResults.video.play.called);
            assertFalse(stubCreateElementResults.video.pause.called);
            assertState(self, MediaPlayer.STATE.BUFFERING);

            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            assert(stubCreateElementResults.video.pause.called);
            assertState(self, MediaPlayer.STATE.BUFFERING);
            assertEquals(50, stubCreateElementResults.video.currentTime);
            sinon.assert.callOrder(stubCreateElementResults.video.play, stubCreateElementResults.video.pause);

            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            assertState(self, MediaPlayer.STATE.PAUSED);
        });
    };

    mixins.testPlayFromZeroThenPauseDefersCallToPauseOnMediaElementWhenInStoppedState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            self._mediaPlayer.pause();
            assertFalse(stubCreateElementResults.video.pause.called);
        });
    };

    mixins.testPlayFromDefersSettingCurrentTimeAndCallingPlayOnMediaElementUntilWeHaveMetadata = function(queue) {
        expectAsserts(3);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            self._mediaPlayer.playFrom(10);

            assert(stubCreateElementResults.video.play.notCalled);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });

            assert(stubCreateElementResults.video.play.called);
            assertEquals(10, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testPlayFromClampsWhenCalledInBufferingStateAndDontHaveMetadata = function(queue) {
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

     mixins.testPlayFromSetsCurrentTimeAndCallsPlayOnMediaElementWhenInBufferingStateAndHasMetadata = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });

            stubCreateElementResults.video.play.reset();

            self._mediaPlayer.playFrom(10);

            assert(stubCreateElementResults.video.play.called);
            assertEquals(10, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testPlayFromClampsWhenCalledInBufferingStateAndHasMetadata = function(queue) {
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

     mixins.testStopWhenInBufferingState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            self._mediaPlayer.playFrom(0);
            self._mediaPlayer.stop();

            assert(stubCreateElementResults.video.pause.calledOnce);
        });
    };

     mixins.testStopWhenInPlayingState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);
            self._mediaPlayer.stop();

            assert(stubCreateElementResults.video.pause.calledOnce);
        });
    };

     mixins.testStopWhenInPausedState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);
            self._mediaPlayer.pause();
            self._mediaPlayer.stop();

            assert(stubCreateElementResults.video.pause.calledTwice);
        });
    };

     mixins.testStopWhenInCompleteState = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);
            deviceMockingHooks.reachEndOfMedia(self._mediaPlayer);
            self._mediaPlayer.stop();

            assert(stubCreateElementResults.video.pause.calledOnce);
        });
    };

    mixins.testResetRemoveAllEventListenersFromTheMediaElement = function(queue) {
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

    mixins.testPlayFromCurrentTimeWhenPlayingGoesToBufferingThenToPlaying = function(queue) {
        var currentAndTargetTime = 50;
        doTestPlayFromNearCurrentTimeWhenPlayingGoesToBufferingThenToPlaying(this, queue, currentAndTargetTime, currentAndTargetTime);
    };

    mixins.testPlayFromJustBeforeCurrentTimeWhenPlayingGoesToBufferingThenToPlaying = function(queue) {
        var currentTime = 50.999;
        var targetTime = 50;
        doTestPlayFromNearCurrentTimeWhenPlayingGoesToBufferingThenToPlaying(this, queue, currentTime, targetTime);
    };

    mixins.testPlayFromJustAfterCurrentTimeWhenPlayingGoesToBufferingThenToPlaying = function(queue) {
        var currentTime = 50;
        var targetTime = 50.999;
        doTestPlayFromNearCurrentTimeWhenPlayingGoesToBufferingThenToPlaying(this, queue, currentTime, targetTime);
    };

    var doTestPlayFromNearCurrentTimeWhenPlayingGoesToBufferingThenToPlaying = function(self, queue, currentTime, targetTime) {
        expectAsserts(4);
        runMediaPlayerTest(self, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);

            assertState(self, MediaPlayer.STATE.PLAYING);

            clearEvents(self);
            stubCreateElementResults.video.currentTime = currentTime;

            self._mediaPlayer.playFrom(targetTime);

            assert(self._eventCallback.calledTwice);
            assertEvent(self, MediaPlayer.EVENT.BUFFERING);
            assertEvent(self, MediaPlayer.EVENT.PLAYING);
        });
    };

    mixins.testPlayFromCurrentTimeWhenPausedGoesToBufferingThenToPlaying = function(queue) {
        expectAsserts(6);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);

            stubCreateElementResults.video.play.reset();

            stubCreateElementResults.video.currentTime = 50;

            self._mediaPlayer.pause();

            assertState(self, MediaPlayer.STATE.PAUSED);

            clearEvents(self);

            self._mediaPlayer.playFrom(50);

            assert(stubCreateElementResults.video.play.called);

            assert(self._eventCallback.calledOnce);
            assertEvent(self, MediaPlayer.EVENT.BUFFERING);

            mediaEventListeners.playing();

            assert(self._eventCallback.calledTwice);
            assertEvent(self, MediaPlayer.EVENT.PLAYING);
        });
    };

    mixins.testPlayFromAfterMetadata = function(queue) {
        expectAsserts(3);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });

            self._mediaPlayer.playFrom(50);
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assertState(self, MediaPlayer.STATE.PLAYING);
            assertEquals(50, stubCreateElementResults.video.currentTime);
            assert(stubCreateElementResults.video.play.called);
        });
    };

    mixins.testPlayFromCurrentTimeWhenPlayedThenStoppedGoesToBufferingThenToPlaying = function(queue) {
        expectAsserts(5);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);
            stubCreateElementResults.video.currentTime = 50;

            self._mediaPlayer.stop();

            stubCreateElementResults.video.play.reset();

            clearEvents(self);

            self._mediaPlayer.playFrom(50);

            assert(stubCreateElementResults.video.play.called);

            assert(self._eventCallback.calledOnce);
            assertEvent(self, MediaPlayer.EVENT.BUFFERING);

            mediaEventListeners.playing();

            assert(self._eventCallback.calledTwice);
            assertEvent(self, MediaPlayer.EVENT.PLAYING);
        });
    };

    mixins.testPlayFromBufferedTimeWhenPlayingGoesToBufferingThenToPlaying = function(queue) {
        expectAsserts(4);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);

            clearEvents(self);
            stubCreateElementResults.video.currentTime = 50;

            self._mediaPlayer.playFrom(25);

            assert(self._eventCallback.calledOnce);
            assertEvent(self, MediaPlayer.EVENT.BUFFERING);

            mediaEventListeners.seeked();

            assert(self._eventCallback.calledTwice);
            assertEvent(self, MediaPlayer.EVENT.PLAYING);
        });
    };

    mixins.testWaitingHtml5EventWhileBufferingOnlyGivesSingleBufferingEvent = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            clearEvents(self);

            self._mediaPlayer.playFrom(0);
            mediaEventListeners.waiting();

            assert(self._eventCallback.calledOnce);
            assertEvent(self, MediaPlayer.EVENT.BUFFERING);
        });
    };

    mixins.testResetUnloadsMediaElementSourceAsPerGuidelines = function(queue) {
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

    // Sentinels
    mixins.testEnterBufferingSentinelCausesTransitionToBufferingWhenPlaybackHalts = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);

            clearEvents(self);
            fireSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_ENTER_BUFFERING);
            assertState(self, MediaPlayer.STATE.BUFFERING);
        });
    };

    mixins.testEnterBufferingSentinelDoesNothingWhenPlaybackIsWorking = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);

            advancePlayTime(self);
            clearEvents(self);
            fireSentinels(self);

            assertNoEvents(self);
            assertState(self, MediaPlayer.STATE.PLAYING);
        });
    };

    mixins.testEnterBufferingSentinelDoesNothingWhenDeviceReportsBufferingCorrectly = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);

            deviceMockingHooks.startBuffering(self._mediaPlayer);

            clearEvents(self);
            fireSentinels(self);

            assertNoEvents(self);
        });
    };

    mixins.testEnterBufferingSentinelDoesNothingWhenDeviceIsPaused = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);
            self._mediaPlayer.pause();

            clearEvents(self);
            fireSentinels(self);

            assertNoEvents(self);
        });
    };

     mixins.testExitBufferingSentinelCausesTransitionToPlayingWhenPlaybackStarts = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToBuffering(self, MediaPlayer);

            advancePlayTime(self);
            clearEvents(self);
            fireSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_EXIT_BUFFERING);
            assertState(self, MediaPlayer.STATE.PLAYING);
        });
    };

    // *******************************************
    // ********* Mixin the functions *************
    // *******************************************

    // Make sure we don't mix in over the top of an existing function, except for setUp and tearDown, for which both
    // the specific and generic setUp/tearDown should be called
    for (var name in mixins) {
        if (mixins.hasOwnProperty(name)) {
            if (testCase.prototype[name]) {
                if (name !== "setUp" && name !== "tearDown") {
                    throw "Trying to mixin '"+name+"' but that already exists!";
                }
            }
            testCase.prototype[name] = mixins[name];
        }
    };

    // Mixin the common tests shared by all MediaPlayer implementations (last, so it can detect conflicts)
    window.commonTests.mediaPlayer.all.mixinTests(testCase, mediaPlayerDeviceModifierRequireName, config, deviceMockingHooks);
}