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
    var clock;
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
                media.seekable.start.returns(range.start);
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
            if(clock !== undefined) {
                throw "Trying to mock time twice";
            }
            clock = sinon.useFakeTimers();
        },
        makeOneSecondPass: function(mediaplayer) {
            var timeUpdateEvent = {
                type: "timeupdate"
            };
            mediaEventListeners.timeupdate(timeUpdateEvent);
        },
        unmockTime: function(mediaplayer) {
            if(clock === undefined) {
                throw "Trying to unmock time twice";
            }
            clock.restore();
            clock = undefined;
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
                deviceMockingHooks.mockTime(self._mediaPlayer);

                self._createElementStub = stubCreateElement(self.sandbox, application);
                self._device = application.getDevice();
                self._mediaPlayer = self._device.getMediaPlayer();
                self._application = application;

                self._eventCallback = self.sandbox.stub();
                self._mediaPlayer.addEventCallback(null, self._eventCallback);

                try {
                    action.call(self, MediaPlayer);
                }
                finally {
                    deviceMockingHooks.unmockTime(self._mediaPlayer);
                }
            }, config);
    };

    var fireSentinels = function (self) {
        clock.tick(1100);
    };

    var fireAllSentinels = function(self) {
        clock.tick(5000);
    };

    var getToBuffering = function(self, MediaPlayer, startTime) {
        self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
        self._mediaPlayer.playFrom(startTime || 0);
        deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
    };

    var getToPlaying = function (self, MediaPlayer, startTime) {
        getToBuffering(self, MediaPlayer, startTime);
        deviceMockingHooks.finishBuffering(self._mediaPlayer);
    };

    var getToPlayingAtEnd = function (self, MediaPlayer) {
        getToPlaying(self, MediaPlayer);
        stubCreateElementResults.video.currentTime = 100;
        fireSentinels(self);
    };

    var getToPlayingWithBeginPlayback = function (self, MediaPlayer, time) {
        self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
        self._mediaPlayer.beginPlayback();
        deviceMockingHooks.sendMetadata(self._mediaPlayer, time, { start: 0, end: 100 });
        deviceMockingHooks.finishBuffering(self._mediaPlayer);
    };

    var assertState = function(self, expectedState) {
        assertEquals(expectedState, self._mediaPlayer.getState());
    };

    var eventWasFired = function(self, eventType) {
        for( i = 0; i < self._eventCallback.args.length; i++) {
            if(eventType === self._eventCallback.args[i][0].type) {
                return true;
            }
        }
        return false;
    }

    var assertEvent = function(self, eventType) {
        assertTrue(eventWasFired(self, eventType));
    };

    var assertNoEvent = function(self, eventType) {
        assertFalse(eventWasFired(self, eventType));
    }

    var assertNoEvents = function(self) {
        assert(self._eventCallback.notCalled);
    };

    var clearEvents = function(self) {
        self._eventCallback.reset();
    };

    var advancePlayTime = function(self) {
        stubCreateElementResults.video.currentTime += 1;
    };

    var setPlayTimeToZero = function (self) {
        stubCreateElementResults.video.currentTime = 0;
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

    mixins.testCreatedVideoElementIsPutInRootWidget = function(queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            var appElement = self._application.getRootWidget().outputElement;
            assertSame(stubCreateElementResults.video, appElement.firstChild);
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

    mixins.testCreatedAudioElementIsPutInRootWidget = function(queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.AUDIO, 'testURL', 'audio/mp4');
            var appElement = self._application.getRootWidget().outputElement;
            assertSame(stubCreateElementResults.audio, appElement.firstChild);
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

    mixins.testIfDurationAndSeekableRangeIsMissingGetSeekableRangeReturnsUndefinedAndLogsAWarning = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            var warnStub = self.sandbox.stub();
            self.sandbox.stub(self._device, "getLogger").returns({warn: warnStub});
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            delete stubCreateElementResults.video.seekable;
            delete stubCreateElementResults.video.duration;
            assertUndefined(self._mediaPlayer.getSeekableRange());
            assert(warnStub.calledWith("No 'duration' or 'seekable' on media element"));
        });
    };

    mixins.testSeekableRangeTakesPrecedenceOverDurationOnMediaElement = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 10, end: 30 });
            stubCreateElementResults.video.duration = 60;
            assertEquals({ start: 10, end: 30 }, self._mediaPlayer.getSeekableRange());
            assertEquals(60, self._mediaPlayer.getDuration());
        });
    };

    mixins.testSeekableIsNotUsedUntilMetadataIsSet = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            stubCreateElementResults.video.seekable.start.returns(0);
            stubCreateElementResults.video.seekable.end.returns(100);
            assertUndefined(self._mediaPlayer.getSeekableRange());
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            assertEquals({ start: 0, end: 100 }, self._mediaPlayer.getSeekableRange());
        });
    };

    mixins.testGetSeekableRangeGetsEndTimeFromDurationWhenNoSeekableProperty = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            delete stubCreateElementResults.video.seekable;
            stubCreateElementResults.video.duration = 60;
            assertEquals({ start: 0, end: 60 }, self._mediaPlayer.getSeekableRange());
            assertEquals(60, self._mediaPlayer.getDuration());
        });
    };

    mixins.testGetSeekableRangeGetsEndTimeFromDurationWhenNoTimeRangesInSeekableProperty = function(queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            stubCreateElementResults.video.seekable = [];
            stubCreateElementResults.video.duration = 60;
            assertEquals({ start: 0, end: 60 }, self._mediaPlayer.getSeekableRange());
        });
    };

    mixins.testGetSeekableRangeGetsEndTimeFromFirstTimeRangeInSeekableProperty = function(queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 60 });
            stubCreateElementResults.video.seekable.start.withArgs(1).returns(333);
            stubCreateElementResults.video.seekable.end.withArgs(1).returns(666);

            assertEquals({ start: 0, end: 60 }, self._mediaPlayer.getSeekableRange());
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

    mixins.testErrorEventFromMediaElementCausesErrorLogWithCode = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {

            var errorStub = self.sandbox.stub();
            self.sandbox.stub(self._device, "getLogger").returns({error: errorStub});

            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            assertFunction(mediaEventListeners.error);

            stubCreateElementResults.video.error =  { code: 2 }; // MEDIA_ERR_NETWORK - http://www.w3.org/TR/2011/WD-html5-20110405/video.html#dom-media-error

            deviceMockingHooks.emitPlaybackError(self._mediaPlayer);

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

    mixins.testPlayCalledOnMediaElementWhenResumeInBufferingState = function(queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            self._mediaPlayer.pause();
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });

            stubCreateElementResults.video.play.reset();

            self._mediaPlayer.resume();

            assert(stubCreateElementResults.video.play.calledOnce);
        });
    };

    mixins.testPlayNotCalledOnMediaElementWhenResumeInBufferingStateBeforeMetadata = function(queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            self._mediaPlayer.pause();

            stubCreateElementResults.video.play.reset();

            self._mediaPlayer.resume();

            assert(stubCreateElementResults.video.play.notCalled);
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

            assertEquals(98.9, stubCreateElementResults.video.currentTime);
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
            assertEquals(98.9, stubCreateElementResults.video.currentTime);
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

            assertEquals(98.9, stubCreateElementResults.video.currentTime);
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

            assertEquals(98.9, stubCreateElementResults.video.currentTime);
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

    mixins.testCallingStopInStoppedStateDoesNotCallPauseOnTheDevice = function(queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            stubCreateElementResults.video.pause.reset();
            self._mediaPlayer.stop();

            assert(stubCreateElementResults.video.pause.notCalled);
        });
    };

    // Sentinels
    mixins.testEnterBufferingSentinelCausesTransitionToBufferingWhenPlaybackHaltsForMoreThanOneSentinelIterationSinceStateChanged = function(queue) {
        expectAsserts(3);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);
            advancePlayTime(self);
            advancePlayTime(self);

            clearEvents(self);
            fireSentinels(self);
            fireSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_ENTER_BUFFERING);
            assertEvent(self, MediaPlayer.EVENT.BUFFERING);
            assertState(self, MediaPlayer.STATE.BUFFERING);
        });
    };

    mixins.testEnterBufferingSentinelDoesNotActivateWhenPlaybackHaltsWhenOnlyOneSentinelIterationSinceStateChanged = function(queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer);
            advancePlayTime(self);

            clearEvents(self);
            fireSentinels(self);

            assertNoEvents(self);
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
        expectAsserts(1);
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
        expectAsserts(1);
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
        expectAsserts(3);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToBuffering(self, MediaPlayer);

            advancePlayTime(self);
            clearEvents(self);
            fireSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_EXIT_BUFFERING);
            assertEvent(self, MediaPlayer.EVENT.PLAYING);
            assertState(self, MediaPlayer.STATE.PLAYING);
        });
    };

    mixins.testExitBufferingSentinelCausesTransitionToPausedWhenDeviceReportsPaused = function(queue) {
        expectAsserts(3);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToBuffering(self, MediaPlayer);
            self._mediaPlayer.pause();

            clearEvents(self);
            stubCreateElementResults.video.paused = true;
            fireSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_EXIT_BUFFERING);
            assertEvent(self, MediaPlayer.EVENT.PAUSED);
            assertState(self, MediaPlayer.STATE.PAUSED);
        });
    };

    mixins.testSeekSentinelSetsCurrentTime = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 50);
            setPlayTimeToZero(self);

            clearEvents(self);
            fireSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_SEEK);
            assertEquals(50, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testSeekSentinelClampsTargetSeekTimeWhenRequired = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToBuffering(self, MediaPlayer, 110);
            setPlayTimeToZero(self);
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            clearEvents(self);
            fireSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_SEEK);
            assertEquals(98.9, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testSeekSentinelDoesNotReseekToInitialSeekTimeAfter15s = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 10);

            clearEvents(self);
            for( var i = 0; i < 20; i++) {
                advancePlayTime(self);
                fireSentinels(self);
            }

            assertNoEvents(self);
            assertEquals(30, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testSeekSentinelDoesNotReseekToInitialSeekTimeAfter15sWhenPlaybackLeavesSeekableRange = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 95);

            clearEvents(self);
            for (var i = 0; i < 20; i++) {
                advancePlayTime(self);
                fireSentinels(self);
            }

            assertNoEvents(self);
            assertEquals(115, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testSeekSentinelSetsCurrentTimeWhenPaused = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 50);
            self._mediaPlayer.pause();
            setPlayTimeToZero(self);

            clearEvents(self);
            fireSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_SEEK);
            assertEquals(50, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testSeekSentinelDoesNotSeekWhenBeginPlaybackCalled = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlayingWithBeginPlayback(self, MediaPlayer, 0);

            clearEvents(self);
            advancePlayTime(self);
            fireSentinels(self);

            assertNoEvents(self);
            assertEquals(1, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testSeekSentinelDoesNotSeekWhenBeginPlaybackStartsPlayingHalfWayThroughMedia = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlayingWithBeginPlayback(self, MediaPlayer, 50);

            clearEvents(self);
            advancePlayTime(self);
            fireSentinels(self);

            assertNoEvents(self);
            assertEquals(51, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testSeekSentinelDoesNotSeekWhenBeginPlaybackAfterPreviouslySeeking = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 50);
            this._mediaPlayer.stop();
            this._mediaPlayer.beginPlayback();
            setPlayTimeToZero(self);
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            clearEvents(self);
            advancePlayTime(self);
            fireSentinels(self);

            assertNoEvents(self);
            assertEquals(1, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testPauseSentinelRetriesPauseIfPauseFails = function(queue) {
        expectAsserts(3);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 0);
            this._mediaPlayer.pause();

            advancePlayTime(self);
            clearEvents(self);
            stubCreateElementResults.video.pause.reset();
            fireSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_PAUSE);
            assert(stubCreateElementResults.video.pause.calledOnce);
            assertState(self, MediaPlayer.STATE.PAUSED);
        });
    };

    mixins.testPauseSentinelDoesNotRetryPauseIfPauseSucceeds = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 0);
            this._mediaPlayer.pause();

            clearEvents(self);
            fireSentinels(self);

            assertNoEvents(self);
            assertState(self, MediaPlayer.STATE.PAUSED);
        });
    };

    mixins.testEndOfMediaSentinelGoesToCompleteIfTimeIsNotAdvancingAndNoCompleteEventFired = function(queue) {
        expectAsserts(3);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlayingAtEnd(self, MediaPlayer);

            clearEvents(self);
            fireSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_COMPLETE);
            assertEvent(self, MediaPlayer.EVENT.COMPLETE);
            assertState(self, MediaPlayer.STATE.COMPLETE);
        });
    };

    mixins.testEndOfMediaSentinelDoesNotActivateIfTimeIsNotAdvancingWhenOutsideASecondOfEndAndNoCompleteEventFired = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 98);

            clearEvents(self);
            fireAllSentinels(self);

            assertNoEvent(self, MediaPlayer.EVENT.SENTINEL_COMPLETE);
            assertNoEvent(self, MediaPlayer.EVENT.COMPLETE);
        });
    };

    mixins.testEndOfMediaSentinelDoesNotActivateIfTimeIsNotAdvancingWhenOutsideSeekableRangeButWithinDuration = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 100);
            stubCreateElementResults.video.duration = 150;

            clearEvents(self);
            fireAllSentinels(self);

            assertNoEvent(self, MediaPlayer.EVENT.SENTINEL_COMPLETE);
            assertNoEvent(self, MediaPlayer.EVENT.COMPLETE);
        });
    };

    mixins.testEndOfMediaSentinelDoesNotActivateIfReachEndOfMediaNormally = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 100);
            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);

            clearEvents(self);
            fireSentinels(self);

            assertNoEvents(self);
            assertState(self, MediaPlayer.STATE.COMPLETE);
        });
    };

    mixins.testEndOfMediaSentinelDoesNotActivateIfTimeIsAdvancingNearEndOfMediaAndNoCompleteEventFired = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 98);

            clearEvents(self);
            advancePlayTime(self);
            fireSentinels(self);

            assertNoEvent(self, MediaPlayer.EVENT.SENTINEL_COMPLETE);
            assertNoEvent(self, MediaPlayer.EVENT.COMPLETE);
        });
    };

    mixins.testOnlyOneSentinelFiredAtATimeWhenBothSeekAndPauseSentinelsAreNeeded = function(queue) {
        expectAsserts(6);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 0);
            self._mediaPlayer.playFrom(30);
            setPlayTimeToZero(self);
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            self._mediaPlayer.pause();

            clearEvents(self);
            advancePlayTime(self);
            fireSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_SEEK);
            assertNoEvent(self, MediaPlayer.EVENT.SENTINEL_PAUSE);
            assertState(self, MediaPlayer.STATE.PAUSED);

            clearEvents(self);
            advancePlayTime(self);
            fireSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_PAUSE);
            assertNoEvent(self, MediaPlayer.EVENT.SENTINEL_SEEK);
            assertState(self, MediaPlayer.STATE.PAUSED);
        });
    };

    function resetStubsThenAdvanceTimeThenRunSentinels(self) {
        clearEvents(self);
        stubCreateElementResults.video.pause.reset();
        advancePlayTime(self);
        fireSentinels(self);
    }

    mixins.testPauseSentinelRetriesPauseTwice = function(queue) {
        expectAsserts(6);

        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 0);
            self._mediaPlayer.pause();

            resetStubsThenAdvanceTimeThenRunSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_PAUSE);
            assertState(self, MediaPlayer.STATE.PAUSED);
            assert(stubCreateElementResults.video.pause.calledOnce);

            resetStubsThenAdvanceTimeThenRunSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_PAUSE);
            assertState(self, MediaPlayer.STATE.PAUSED);
            assert(stubCreateElementResults.video.pause.calledOnce);
        });
    };

    mixins.testPauseSentinelEmitsFailureEventAndGivesUpOnThirdAttempt = function(queue) {
        expectAsserts(6);

        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 0);
            self._mediaPlayer.pause();

            resetStubsThenAdvanceTimeThenRunSentinels(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_PAUSE_FAILURE);
            assertState(self, MediaPlayer.STATE.PAUSED);
            assert(stubCreateElementResults.video.pause.notCalled);

            resetStubsThenAdvanceTimeThenRunSentinels(self);

            assertNoEvents(self);
            assertState(self, MediaPlayer.STATE.PAUSED);
            assert(stubCreateElementResults.video.pause.notCalled);
        });
    };

    mixins.testPauseSentinelAttemptCountIsNotResetByCallingPauseWhenAlreadyPaused = function(queue) {
        expectAsserts(3);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 0);

            self._mediaPlayer.pause();
            resetStubsThenAdvanceTimeThenRunSentinels(self);
            self._mediaPlayer.pause();

            resetStubsThenAdvanceTimeThenRunSentinels(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_PAUSE_FAILURE);
            assertState(self, MediaPlayer.STATE.PAUSED);
            assert(stubCreateElementResults.video.pause.notCalled);
        });
    };

    mixins.testPauseSentinelAttemptCountIsResetByCallingPauseWhenNotPaused = function(queue) {
        expectAsserts(3);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 0);
            self._mediaPlayer.pause();

            resetStubsThenAdvanceTimeThenRunSentinels(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);

            self._mediaPlayer.resume();
            self._mediaPlayer.pause();

            resetStubsThenAdvanceTimeThenRunSentinels(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_PAUSE);
            assertState(self, MediaPlayer.STATE.PAUSED);
            assert(stubCreateElementResults.video.pause.calledOnce);
        });
    };

    mixins.testSeekSentinelRetriesSeekTwice = function(queue) {
        expectAsserts(4);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 50);

            setPlayTimeToZero(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_SEEK);
            assertEquals(50, stubCreateElementResults.video.currentTime);

            setPlayTimeToZero(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_SEEK);
            assertEquals(50, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testSeekSentinelEmitsFailureEventAndGivesUpOnThirdAttemptWhenDeviceDoesNotEnterBufferingUponSeek = function(queue) {
        expectAsserts(5);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 50);

            setPlayTimeToZero(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);

            setPlayTimeToZero(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);

            setPlayTimeToZero(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_SEEK_FAILURE);
            assertEquals(1, stubCreateElementResults.video.currentTime);

            resetStubsThenAdvanceTimeThenRunSentinels(self);

            assertNoEvent(self, MediaPlayer.EVENT.SENTINEL_SEEK);
            assertNoEvent(self, MediaPlayer.EVENT.SENTINEL_SEEK_FAILURE);
            assertEquals(2, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testSeekSentinelEmitsFailureEventAndGivesUpOnThirdAttemptWhenDeviceEntersBufferingUponSeek = function(queue) {
        expectAsserts(4);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 50);

            setPlayTimeToZero(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);
            deviceMockingHooks.startBuffering(this._mediaPlayer);
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            setPlayTimeToZero(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);
            deviceMockingHooks.startBuffering(this._mediaPlayer);
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            setPlayTimeToZero(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);
            deviceMockingHooks.startBuffering(this._mediaPlayer);
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_SEEK_FAILURE);
            assertEquals(1, stubCreateElementResults.video.currentTime);

            resetStubsThenAdvanceTimeThenRunSentinels(self);

            assertNoEvents(self);
            assertEquals(2, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testSeekSentinelGivingUpDoesNotPreventPauseSentinelActivation = function(queue) {
        expectAsserts(6);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 50);
            self._mediaPlayer.pause();

            setPlayTimeToZero(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);
            setPlayTimeToZero(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);

            assertNoEvent(self, MediaPlayer.EVENT.SENTINEL_PAUSE);
            assertState(self, MediaPlayer.STATE.PAUSED);

            setPlayTimeToZero(self);
            advancePlayTime(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_PAUSE);
            assert(stubCreateElementResults.video.pause.calledOnce);

            setPlayTimeToZero(self);
            advancePlayTime(self);
            advancePlayTime(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);

            // Ensure that pause has a second attempt (rather than seek returning, etc)
            assertEvent(self, MediaPlayer.EVENT.SENTINEL_PAUSE);
            assert(stubCreateElementResults.video.pause.calledOnce);
        });
    };

    mixins.testSeekSentinelAttemptCountIsResetByCallingPlayFrom = function(queue) {
        expectAsserts(2);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(self, MediaPlayer, 50);

            setPlayTimeToZero(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);

            setPlayTimeToZero(self);
            resetStubsThenAdvanceTimeThenRunSentinels(self);
            setPlayTimeToZero(self);

            this._mediaPlayer.playFrom(50);
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            setPlayTimeToZero(self);

            resetStubsThenAdvanceTimeThenRunSentinels(self);

            assertEvent(self, MediaPlayer.EVENT.SENTINEL_SEEK);
            assertEquals(50, stubCreateElementResults.video.currentTime);
        });
    };

    mixins.testWhenPlayFromGetsClampedFromStoppedADebugMessageIsLogged = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            var debugStub = this.sandbox.stub();
            var warnStub = this.sandbox.stub();
            this.sandbox.stub(this._device, "getLogger").returns({
                debug: debugStub,
                warn: warnStub
            });

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(50);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 60, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(debugStub.withArgs("playFrom 50 clamped to 60 - seekable range is { start: 60, end: 100 }").calledOnce);
        });
    };

    // TODO: Remove references to 'self' that are unecessary due to the use of '.call' in runMediaPlayerTest
    // TODO: Consider whether the ordering of the pause and seek sentinels is important, and if not we should not assert the order in the tests.

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