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
window.commonTests.mediaPlayer.cehtml = window.commonTests.mediaPlayer.cehtml || { };

window.commonTests.mediaPlayer.cehtml.mixinTests = function (testCase, mediaPlayerDeviceModifierRequireName, config) {

    var mixins = { };

    var fakeCEHTMLObject;
    var stubCreateElement = function (sandbox, application) {
        var device = application.getDevice();

        var stubFunc = function(type, id) {
            if (id && fakeCEHTMLObject) {
                fakeCEHTMLObject.id = id;
            }

            return fakeCEHTMLObject;
        };

        return sandbox.stub(device, "_createElement", stubFunc);
    };

    // Setup device specific mocking
    var mockData;
    var clock;
    var seekSpy;
    var playSpy;
    var deviceMockingHooks = {
        setup: function(sandbox, application) {
            mockData = {};
            fakeCEHTMLObject.playPosition = 0;
            this._createElementStub = stubCreateElement(sandbox, application);

            fakeCEHTMLObject.seek = function(milliseconds) {
                fakeCEHTMLObject.playPosition = milliseconds;
                return true;
            };

            fakeCEHTMLObject.play = function(playSpeed) {
                if (playSpeed === 1 && fakeCEHTMLObject.playState === fakeCEHTMLObject.PLAY_STATE_PAUSED) {
                    fakeCEHTMLObject.playState = fakeCEHTMLObject.PLAY_STATE_PLAYING;
                }

                if (playSpeed === 0 && fakeCEHTMLObject.playState === fakeCEHTMLObject.PLAY_STATE_PLAYING) {
                    fakeCEHTMLObject.playState = fakeCEHTMLObject.PLAY_STATE_PAUSED;
                }
            };

            seekSpy = sandbox.spy(fakeCEHTMLObject, 'seek');
            playSpy = sandbox.spy(fakeCEHTMLObject, 'play');
        },
        sendMetadata: function(mediaPlayer, currentTime, range) {
            // CEHTML has no 'metadata' event, so keep these values for later
            mockData.range = range;
        },
        finishBuffering: function(/* mediaPlayer */) {
            if (!mockData.loaded && mockData.range) {
                fakeCEHTMLObject.playTime = mockData.range.end * 1000;
                mockData.loaded = true;
            }
            fakeCEHTMLObject.playState = fakeCEHTMLObject.PLAY_STATE_PLAYING;

            var timesSeekCalled = seekSpy.callCount;

            if (fakeCEHTMLObject.onPlayStateChange) {
                fakeCEHTMLObject.onPlayStateChange();

                // A deferred seek puts us back into the buffering state until the seek has been successful, so in this
                // mock, we want to immediately report a successful seek if a deferred seek has been performed.
                if (seekSpy.callCount > timesSeekCalled) {
                    fakeCEHTMLObject.onPlayStateChange();
                }
            }
        },
        emitPlaybackError: function(/* mediaPlayer */) {
            fakeCEHTMLObject.playState = fakeCEHTMLObject.PLAY_STATE_ERROR;
            fakeCEHTMLObject.onPlayStateChange();
        },
        reachEndOfMedia: function(/* mediaPlayer */) {
            mockData.loaded = false;
            fakeCEHTMLObject.playTime = 0;
            fakeCEHTMLObject.playPosition = 0;

            fakeCEHTMLObject.playState = fakeCEHTMLObject.PLAY_STATE_FINISHED;
            fakeCEHTMLObject.onPlayStateChange();
        },
        startBuffering: function(/* mediaPlayer */) {
            fakeCEHTMLObject.playState = fakeCEHTMLObject.PLAY_STATE_BUFFERING;
            fakeCEHTMLObject.onPlayStateChange();
        },
        mockTime: function(/* mediaPlayer */) {
            if(clock !== undefined) {
                throw "Trying to mock time twice";
            }
            clock = sinon.useFakeTimers();
        },
        makeOneSecondPass: function (/* mediaPlayer */) {
            clock.tick(1000);
            if (fakeCEHTMLObject.playState === fakeCEHTMLObject.PLAY_STATE_PLAYING) {
                fakeCEHTMLObject.playPosition += 1000;
            }
        },
        unmockTime: function(/* mediaPlayer */) {
            if (clock === undefined) {
                throw "Trying to unmock time twice";
            }
            clock.restore();
            clock = undefined;
        }
    };

    mixins.setUp = function() {
        this.sandbox = sinon.sandbox.create();

        mockData = {};
        fakeCEHTMLObject = document.createElement("div");
        fakeCEHTMLObject.stop = this.sandbox.stub();
        fakeCEHTMLObject.onPlayStateChange = this.sandbox.stub();
        fakeCEHTMLObject.setFullScreen = this.sandbox.stub();

        fakeCEHTMLObject.PLAY_STATE_STOPPED = 0;
        fakeCEHTMLObject.PLAY_STATE_PLAYING = 1;
        fakeCEHTMLObject.PLAY_STATE_PAUSED = 2;
        fakeCEHTMLObject.PLAY_STATE_CONNECTING = 3;
        fakeCEHTMLObject.PLAY_STATE_BUFFERING = 4;
        fakeCEHTMLObject.PLAY_STATE_FINISHED = 5;
        fakeCEHTMLObject.PLAY_STATE_ERROR = 6;

        this.runMediaPlayerTest = runMediaPlayerTest;
        this.fakeCEHTMLObject = fakeCEHTMLObject;
        this.deviceMockingHooks = deviceMockingHooks;
    };

    mixins.tearDown = function() {
        this.sandbox.restore();

        // Clean up after ourselves in case we haven't reset() the media player
        var element = document.getElementById("mediaPlayer");
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }

    };

    var runMediaPlayerTest = function (self, queue, action) {
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/mediaplayer"],
            function(application, MediaPlayer) {
                deviceMockingHooks.setup.call(self, self.sandbox, application);
                deviceMockingHooks.mockTime();
                self._device = application.getDevice();
                self._mediaPlayer = self._device.getMediaPlayer();
                try {
                    action.call(self, MediaPlayer);
                }
                finally {
                    deviceMockingHooks.unmockTime();
                }

            }, config);
    };

    var getToBuffering = function(self, MediaPlayer, startTime) {
        self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
        self._mediaPlayer.playFrom(startTime || 0);
        deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
    };

    var getToPlaying = function (self, MediaPlayer, startTime) {
        getToBuffering(self, MediaPlayer, startTime);
        deviceMockingHooks.finishBuffering(self._mediaPlayer);
    };

    var getToPlayingAtEnd = function (self, MediaPlayer) {
        getToPlaying(self, MediaPlayer);
        fakeCEHTMLObject.playPosition = 100000;
        fireSentinels(self);
    };

    var getToPlayingWithBeginPlayback = function (self, MediaPlayer, time) {
        self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
        self._mediaPlayer.beginPlayback();
        deviceMockingHooks.sendMetadata(self._mediaPlayer, time, { start: 0, end: 100 });
        deviceMockingHooks.finishBuffering(self._mediaPlayer);
    };

    var fireSentinels = function () {
        clock.tick(1100);
    };

    var configureSeekToFail = function() {
        fakeCEHTMLObject.seek = sinon.stub();
        fakeCEHTMLObject.seek.returns(true);
        seekSpy = fakeCEHTMLObject.seek;
    };

    var advancePlayTime = function() {
        fakeCEHTMLObject.playPosition += 1000;
    };

    var assertEventTypeHasFired = function (eventHandler, eventType) {
        assert(eventTypeHasFired(eventHandler, eventType));
    };

    var assertEventTypeHasNotBeenFired = function (eventHandler, eventType) {
        assertFalse(eventTypeHasFired(eventHandler, eventType));
    };

    var eventTypeHasFired = function(eventHandler, eventType) {
        for(var i = 0; i < eventHandler.callCount; i++) {
            if(eventHandler.getCall(i).args[0].type === eventType) {
                return true;
            }
        }
        return false;
    };

    //---------------------
    // CEHTML specific tests
    //---------------------

    mixins.testSetSourceCreatesCEHTMLObjectElement = function (queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            assert(this._createElementStub.calledWith("object", "mediaPlayer"));
        });
    };

    mixins.testCreatedElementIsPutAtBackOfDOM = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var body = document.getElementsByTagName("body")[0];
            assertSame(fakeCEHTMLObject, body.firstChild);
        });
    };

    mixins.testCreatedElementIsRemovedFromDOMOnReset = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            this._mediaPlayer.reset();

            var searchResult = document.getElementById("mediaPlayer");

            assertNull(searchResult);
        });
    };

    mixins.testEventHandlersAreRegisteredAfterMediaElementIsAddedToDOM = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._device.prependChildElement = function() {
                fakeCEHTMLObject.onPlayStateChange = undefined;
            };
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assertFunction(fakeCEHTMLObject.onPlayStateChange);
        });
    };

    mixins.testDataAttributeSetAfterMediaElementIsAddedToDOM = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._device.prependChildElement = function() {
                fakeCEHTMLObject.data = null;
            };
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assertEquals(fakeCEHTMLObject.data,'testURL');
        });
    };

    mixins.testElementIsFullScreen = function(queue) {
        expectAsserts(6);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            assertEquals("absolute", fakeCEHTMLObject.style.position);
            assertEquals("0px", fakeCEHTMLObject.style.top);
            assertEquals("0px", fakeCEHTMLObject.style.left);
            assertEquals("100%", fakeCEHTMLObject.style.width);
            assertEquals("100%", fakeCEHTMLObject.style.height);
            assertEquals("", fakeCEHTMLObject.style.zIndex);
        });
    };

    mixins.testElementHasCorrectContentType = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assertEquals("video/mp4", fakeCEHTMLObject.type);
        });
    };

    mixins.testElementHasCorrectSourceURL = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assertEquals("http://testurl/", fakeCEHTMLObject.data);
        });
    };

    mixins.testPlayFromWhenStoppedCallsPlay = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);

            assert(playSpy.calledWith(1));
        });
    };

    mixins.testBeginPlaybackWhenStoppedCallsPlay = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.beginPlayback();

            assert(playSpy.calledWith(1));
        });
    };

    mixins.testPlayFromWhilePlayingSeeksToCorrectTime = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);

            assert(playSpy.withArgs(1).calledOnce);
            this._mediaPlayer.playFrom(20);

            assert(seekSpy.calledWith(20000));
            assert(playSpy.withArgs(1).calledOnce);
        });
    };

    mixins.testPlayFromWhilePlayingReturnsToPlayingStateWhenSeekFails = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);

            fakeCEHTMLObject.seek = function(milliseconds) {
                fakeCEHTMLObject.playPosition = milliseconds;
                return false;
            };
            this._mediaPlayer.playFrom(10);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
        });
    };

    mixins.testCallingPauseWhilePlayingCallsPlayWithZero = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            this._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assert(playSpy.calledWith(0));
        });
    };

    mixins.testCallingResumeFromPausedCallsPlay = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);

            this._mediaPlayer.pause();
            this._mediaPlayer.resume();
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            assert(playSpy.calledThrice);
            assertEquals(1, fakeCEHTMLObject.play.lastCall.args[0]);
        });
    };

    mixins.testCallingStopFromPlayingCallsStop = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);

            this._mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
            assert(fakeCEHTMLObject.stop.calledOnce);
        });
    };

    mixins.testCallingStopFromPausedCallsStop = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);
            this._mediaPlayer.pause();

            this._mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
            assert(fakeCEHTMLObject.stop.calledOnce);
        });
    };

    mixins.testStatusEventTimerCleanedUpOnReset = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            var clearIntervalSpy = this.sandbox.spy(window,'clearInterval');
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assert(clearIntervalSpy.notCalled);
            this._mediaPlayer.reset();
            assert(clearIntervalSpy.calledWith(this._mediaPlayer._updateInterval));
        });
    };

    mixins.testPlayFromWhenPausedSeeksToCorrectPoint = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);

            this._mediaPlayer.pause();
            this._mediaPlayer.playFrom(10);

            assert(seekSpy.calledWith(10000));
        });
    };

    mixins.testPlayFromWhenCompleteStopsMediaBeforeSeekingAndPlaying = function(queue) {
        expectAsserts(8);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);

            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);
            this._mediaPlayer.playFrom(10);
            assert(seekSpy.notCalled);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assert(seekSpy.calledOnce);
            assert(seekSpy.calledWith(10000));

            assert(fakeCEHTMLObject.stop.calledOnce);
            assert(playSpy.calledAfter(fakeCEHTMLObject.stop));
            assert(playSpy.calledBefore(seekSpy));
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
        });
    };

    mixins.testPlayFromWhenCompleteThenPlayFromZeroDoesNotSeek = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);

            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);
            this._mediaPlayer.playFrom(0);

            assert(seekSpy.notCalled);
        });
    };

    mixins.testPlayFromWhenStoppedSeeksToCorrectTime = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 10);
            assert(seekSpy.calledWith(10000));
        });
    };

    mixins.testPlayFromZeroWhenStoppedDoesNotSeek = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);
            assert(seekSpy.notCalled);
        });
    };

    mixins.testPlayFromWhenStoppedDefersSeekUntilFinishedBuffering = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(10);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });

            assert(seekSpy.notCalled);

            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(seekSpy.calledOnce);
        });
    };

    mixins.testPlayFromClampsWhenCalledInPlayingState = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);

            this._mediaPlayer.playFrom(110);
            assert(seekSpy.calledWith(98.9*1000));
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            this._mediaPlayer.playFrom(-1);
            assertEquals(0, seekSpy.lastCall.args[0]);
        });
    };

    mixins.testPlayFromWhileBufferingAtStartOfMediaSeeksToCorrectTime = function(queue) {
        expectAsserts(7);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            this._mediaPlayer.playFrom(10);
            this._mediaPlayer.playFrom(20);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });

            assert(eventHandler.calledOnce);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);

            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(seekSpy.calledWith(20000));
            assert(eventHandler.calledThrice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[1][0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.args[2][0].type);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
        });
    };

    mixins.testPlayFromThenPauseWhileBufferingAtStartOfMediaPrioritisesSeekingOverPausing = function(queue) {
        expectAsserts(9);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            this._mediaPlayer.playFrom(10);
            this._mediaPlayer.playFrom(20);
            this._mediaPlayer.pause();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });

            assert(eventHandler.calledOnce);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);
            assert(playSpy.withArgs(0).notCalled);

            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(seekSpy.calledWith(20000));
            assert(eventHandler.calledThrice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[1][0].type);
            assertEquals(MediaPlayer.EVENT.PAUSED, eventHandler.args[2][0].type);
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assert(fakeCEHTMLObject.play.withArgs(0).calledOnce);
        });
    };

    mixins.testPauseWhileBufferingCallsPlayWithZeroWhenBufferingEnds = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            this._mediaPlayer.pause();
            assert(playSpy.calledOnce);
            assert(playSpy.calledWith(1));

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assert(playSpy.calledTwice);
            assert(playSpy.calledWith(0));
        });
    };

    mixins.testOnPlayStateChangeFunctionIsDeletedOnWipe = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assert(fakeCEHTMLObject.hasOwnProperty("onPlayStateChange"));
            this._mediaPlayer.reset();
            assertFalse(fakeCEHTMLObject.hasOwnProperty("onPlayStateChange"));
        });
    };

    mixins.testDeviceErrorIsReportedWithErrorCode = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            var errorStub = this.sandbox.stub();
            this.sandbox.stub(this._device, "getLogger").returns({error: errorStub});

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            fakeCEHTMLObject.error = 2;
            deviceMockingHooks.emitPlaybackError(this._mediaPlayer);

            assertEquals(MediaPlayer.EVENT.ERROR, eventHandler.lastCall.args[0].type);
            assertEquals('Media element emitted error with code: 2', errorStub.lastCall.args[0]);
        });
    };

    mixins.testOnlyOneCompleteEventFiredWhenDeviceReportsMultipleCompleteEvents = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);

            assert(eventHandler.calledOnce);
            assertEquals(MediaPlayer.EVENT.COMPLETE, eventHandler.lastCall.args[0].type);

            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);

            assert(eventHandler.calledOnce);
        });
    };

    mixins.testCallingStopFromStoppedStateDoesNotCallDeviceStop = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            fakeCEHTMLObject.stop.reset();

            this._mediaPlayer.stop();
            assert(fakeCEHTMLObject.stop.notCalled);
        });
    };

    mixins.testSentinelTimerCleanedUpOnReset = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            var clearIntervalSpy = this.sandbox.spy(window,'clearInterval');
            getToPlaying(this, MediaPlayer, 0);

            clearIntervalSpy.reset();

            assert(clearIntervalSpy.notCalled);
            this._mediaPlayer.stop();
            this._mediaPlayer.reset();
            assert(clearIntervalSpy.calledWith(this._mediaPlayer._sentinelInterval));
        });
    };

    mixins.testGoesToBufferingAndSentinelEventFiredOnSecondSentinelIntervalWhenDeviceBufferingAndNoBufferingEventFired = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            fireSentinels();
            assertEventTypeHasNotBeenFired(eventHandler, MediaPlayer.EVENT.SENTINEL_ENTER_BUFFERING);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());

            fireSentinels();
            assertEventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_ENTER_BUFFERING);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
        });
    };

    mixins.testGoesToPlayingAndSentinelEventFiredFromBufferingWhenNoExitBufferingEventFired = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);
            deviceMockingHooks.startBuffering();

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            clock.tick(1000);
            fakeCEHTMLObject.playPosition += 1000;
            clock.tick(1000);
            fakeCEHTMLObject.playPosition += 1000;

            assertEventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_EXIT_BUFFERING);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
        });
    };

    mixins.testUnsuccessfulSeekIsRetriedAndSentinelSeekEventIsFiredFromPlayingState = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            configureSeekToFail();
            getToPlaying(this, MediaPlayer, 30);

            assertEquals(0, this._mediaPlayer.getCurrentTime());

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assertEventTypeHasFired(eventHandler,MediaPlayer.EVENT.SENTINEL_SEEK);
            assert(seekSpy.calledTwice);
            assertEquals(30000, seekSpy.args[1][0]);
        });
    };

    mixins.testUnsuccessfulSeekIsRetriedAndSentinelSeekEventIsFiredFromPausedState = function(queue) {
        expectAsserts(5);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            configureSeekToFail();

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(30);
            this._mediaPlayer.pause();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(0, this._mediaPlayer.getCurrentTime());
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assertEventTypeHasFired(eventHandler,MediaPlayer.EVENT.SENTINEL_SEEK);
            assert(seekSpy.calledTwice);
            assertEquals(30000, seekSpy.args[1][0]);
        });
    };

    mixins.testRetriedSeekIsClamped = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            configureSeekToFail();
            getToPlaying(this, MediaPlayer, 110);

            assertEquals(0, this._mediaPlayer.getCurrentTime());

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assert(seekSpy.calledTwice);
            assertEquals(98900, seekSpy.args[1][0]);
        });
    };

    mixins.testSuccessfulInaccurateSeekIsNotRetried = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {

            // Override mock seek function to be inaccurate by 14 seconds
            fakeCEHTMLObject.seek = function(milliseconds) {
                fakeCEHTMLObject.playPosition = milliseconds + 14000;
                return true;
            };
            seekSpy = this.sandbox.spy(fakeCEHTMLObject, 'seek');

            getToPlaying(this, MediaPlayer, 30);

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assertEquals(45, this._mediaPlayer.getCurrentTime());

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assert(seekSpy.calledOnce);
        });
    };

    mixins.testTimeAdvancingBeyondSeekToleranceDoesNotRetrySeek = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);

            assert(seekSpy.notCalled);

            for(var i = 0; i <= 16; i++) {
                deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            }

            assertEquals(17, this._mediaPlayer.getCurrentTime());
            assert(seekSpy.notCalled);
        });
    };

    mixins.testSeekNotRetriedWhenSeekTimeHasBeenClamped = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 116);

            assertEquals(98.9, this._mediaPlayer.getCurrentTime());
            assert(seekSpy.calledOnce);

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assert(seekSpy.calledOnce);
        });
    };

    mixins.testSeekNotRetriedWhenMediaIsStoppedAndThenBeginPlaybackIsCalled = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {

            fakeCEHTMLObject.stop = function() {
                fakeCEHTMLObject.playPosition = 0;
            };

            getToPlaying(this, MediaPlayer, 30);

            assert(seekSpy.calledOnce);

            this._mediaPlayer.stop();
            this._mediaPlayer.beginPlayback();
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(0, this._mediaPlayer.getCurrentTime());
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assert(seekSpy.calledOnce);
        });
    };

    mixins.testSeekNotRetriedWhenMediaGoesToErrorThenResetAndBeginPlaybackIsCalled = function(queue) {
        expectAsserts(4);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(30);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(seekSpy.calledOnce);

            // Transition to error state via invalid API call
            try {
                this._mediaPlayer.beginPlayback();
            } catch (e) {}

            this._mediaPlayer.reset();
            // Some (possibly all) CEHTML devices will reset their playPosition upon reset
            fakeCEHTMLObject.playPosition = 0;

            getToPlayingWithBeginPlayback(this, MediaPlayer, 0);

            assertEquals(0, this._mediaPlayer.getCurrentTime());
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assert(seekSpy.calledOnce);
        });
    };

    mixins.testUnsuccessfulPauseIsRetriedAndSentinelPauseEventIsFired = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);
            this._mediaPlayer.pause();

            assert(playSpy.withArgs(0).calledOnce);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            clock.tick(1000);
            fakeCEHTMLObject.playPosition += 1000;
            clock.tick(1000);
            fakeCEHTMLObject.playPosition += 1000;

            assertEventTypeHasFired(eventHandler,MediaPlayer.EVENT.SENTINEL_PAUSE);
            assert(playSpy.withArgs(0).calledTwice);
        });
    };

    mixins.testSuccessfulPauseIsNotRetried = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);
            this._mediaPlayer.pause();

            assert(fakeCEHTMLObject.play.withArgs(0).calledOnce);

            fireSentinels();

            assert(fakeCEHTMLObject.play.withArgs(0).calledOnce);
        });
    };

    mixins.testGoesToCompleteWithCompleteAndSentinelEventsWhenTimeIsNotAdvancingAndIsNearToEnd = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlayingAtEnd(this, MediaPlayer);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            fireSentinels();

            assertEventTypeHasFired(eventHandler, MediaPlayer.EVENT.COMPLETE);
            assertEventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_COMPLETE);
            assertEquals(MediaPlayer.STATE.COMPLETE, this._mediaPlayer.getState());
        });
    };

    mixins.testStaysPlayingWhenTimeIsAdvancingAndIsNearToEnd = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 99);

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
        });
    };

    mixins.testGoesToCompleteWhenTimeIsUndefinedAndTimeAtLastIntervalIsNearToEnd = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlayingAtEnd(this, MediaPlayer);

            clock.tick(1000);
            fakeCEHTMLObject.playPosition = undefined;
            clock.tick(1000);

            assertEquals(MediaPlayer.STATE.COMPLETE, this._mediaPlayer.getState());
        });
    };

    mixins.testSentinelCompleteEventNotFiredAfterSuccessfulTransitionToComplete = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 100);
            fakeCEHTMLObject.playState = fakeCEHTMLObject.PLAY_STATE_FINISHED;
            fakeCEHTMLObject.onPlayStateChange();

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            fireSentinels();

            assertEventTypeHasNotBeenFired(eventHandler, MediaPlayer.EVENT.SENTINEL_COMPLETE);
        });
    };

    mixins.testStateDoesNotMoveToBufferingWhenStopped = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);
            this._mediaPlayer.stop();

            fireSentinels();

            assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
        });
    };

    mixins.testUnsuccessfulSeekAndUnsuccessfulPauseFiresOneSentineEventOnInterval = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            configureSeekToFail();

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(30);
            this._mediaPlayer.pause();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            clock.tick(1000);
            fakeCEHTMLObject.playPosition += 1000;

            eventHandler.reset();
            clock.tick(100);

            assertEquals(1, eventHandler.callCount);
        });
    };

    mixins.testUnsuccessfulSeekAndBufferingWithoutBufferingEventFiresOneSentinelEventOnInterval = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            configureSeekToFail();
            getToPlaying(this, MediaPlayer, 30);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            clock.tick(1000);
            eventHandler.reset();
            clock.tick(100);

            assertNotSame("Only seek or buffering sentinel event should fire, not both",
                eventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_ENTER_BUFFERING),
                eventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_SEEK));
        });
    };

    mixins.testUnsuccessfulSeekAndCompleteWithoutCompleteEventFiresSeekSentinelEventOnlyOnInterval = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 99);
            configureSeekToFail();

            this._mediaPlayer.playFrom(30);
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            clock.tick(1000);
            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);
            clock.tick(100);

            assertEventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_SEEK);
            assertEventTypeHasNotBeenFired(eventHandler, MediaPlayer.EVENT.SENTINEL_COMPLETE);
        });
    };

    var resetStubsThenAdvanceTimeThenRunSentinels = function(eventHandler) {
        if (eventHandler) {
            eventHandler.reset();
        }
        fakeCEHTMLObject.play.reset();
        seekSpy.reset();

        advancePlayTime();
        fireSentinels();
    };

    mixins.testPauseSentinelRetriesPauseTwice = function(queue) {
        expectAsserts(6);

        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);
            this._mediaPlayer.pause();

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            resetStubsThenAdvanceTimeThenRunSentinels();

            assertEventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_PAUSE);
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assert(fakeCEHTMLObject.play.withArgs(0).calledOnce);

            resetStubsThenAdvanceTimeThenRunSentinels();

            assertEventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_PAUSE);
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assert(fakeCEHTMLObject.play.withArgs(0).calledOnce);
        });
    };

    mixins.testPauseSentinelEmitsFailureEventAndGivesUpOnThirdAttempt = function(queue) {
        expectAsserts(6);

        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);
            this._mediaPlayer.pause();

            resetStubsThenAdvanceTimeThenRunSentinels();
            resetStubsThenAdvanceTimeThenRunSentinels();

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            resetStubsThenAdvanceTimeThenRunSentinels();

            assertEventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_PAUSE_FAILURE);
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assert(fakeCEHTMLObject.play.withArgs(0).notCalled);

            resetStubsThenAdvanceTimeThenRunSentinels(eventHandler);

            assert(eventHandler.notCalled);
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assert(fakeCEHTMLObject.play.withArgs(0).notCalled);
        });
    };

    mixins.testPauseSentinelAttemptCountIsNotResetByCallingPauseWhenAlreadyPaused = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);

            this._mediaPlayer.pause();
            resetStubsThenAdvanceTimeThenRunSentinels();
            this._mediaPlayer.pause();

            resetStubsThenAdvanceTimeThenRunSentinels();

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            resetStubsThenAdvanceTimeThenRunSentinels();

            assertEventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_PAUSE_FAILURE);
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assert(fakeCEHTMLObject.play.withArgs(0).notCalled);
        });
    };

    mixins.testPauseSentinelAttemptCountIsResetByCallingPauseWhenNotPaused = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            getToPlaying(this, MediaPlayer, 0);
            this._mediaPlayer.pause();

            resetStubsThenAdvanceTimeThenRunSentinels();
            resetStubsThenAdvanceTimeThenRunSentinels();

            this._mediaPlayer.resume();
            this._mediaPlayer.pause();

            resetStubsThenAdvanceTimeThenRunSentinels();

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            resetStubsThenAdvanceTimeThenRunSentinels();

            assertEventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_PAUSE);
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assert(fakeCEHTMLObject.play.withArgs(0).calledOnce);
        });
    };

    mixins.testSeekSentinelRetriesSeekTwice = function(queue) {
        expectAsserts(6);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            configureSeekToFail();
            getToPlaying(this, MediaPlayer, 50);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            resetStubsThenAdvanceTimeThenRunSentinels();

            assertEventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_SEEK);
            assert(seekSpy.calledOnce);
            assertEquals(50000, seekSpy.getCall(0).args[0]);

            resetStubsThenAdvanceTimeThenRunSentinels(eventHandler);

            assertEventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_SEEK);
            assert(seekSpy.calledOnce);
            assertEquals(50000, seekSpy.getCall(0).args[0]);
        });
    };

    mixins.testSeekSentinelEmitsFailureEventAndGivesUpOnThirdAttemptWhenDeviceDoesNotEnterBufferingUponSeek = function(queue) {
        expectAsserts(5);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            configureSeekToFail();
            getToPlaying(this, MediaPlayer, 50);

            resetStubsThenAdvanceTimeThenRunSentinels();
            resetStubsThenAdvanceTimeThenRunSentinels();

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            resetStubsThenAdvanceTimeThenRunSentinels();

            assertEventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_SEEK_FAILURE);
            assert(seekSpy.notCalled);

            resetStubsThenAdvanceTimeThenRunSentinels(eventHandler);

            assertEventTypeHasNotBeenFired(eventHandler, MediaPlayer.EVENT.SENTINEL_SEEK);
            assertEventTypeHasNotBeenFired(eventHandler, MediaPlayer.EVENT.SENTINEL_SEEK_FAILURE);
            assert(seekSpy.notCalled);
        });
    };

    mixins.testSeekSentinelEmitsFailureEventAndGivesUpOnThirdAttemptWhenDeviceEntersBufferingUponSeek = function(queue) {
        function enterExitBuffering(mediaPlayer) {
            deviceMockingHooks.startBuffering(mediaPlayer);
            deviceMockingHooks.finishBuffering(mediaPlayer);
        }

        expectAsserts(5);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            configureSeekToFail();
            getToPlaying(this, MediaPlayer, 50);

            resetStubsThenAdvanceTimeThenRunSentinels();
            enterExitBuffering(this._mediaPlayer);

            resetStubsThenAdvanceTimeThenRunSentinels();
            enterExitBuffering(this._mediaPlayer);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            resetStubsThenAdvanceTimeThenRunSentinels();
            enterExitBuffering(this._mediaPlayer);

            assertEventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_SEEK_FAILURE);
            assert(seekSpy.notCalled);

            resetStubsThenAdvanceTimeThenRunSentinels(eventHandler);

            assertEventTypeHasNotBeenFired(eventHandler, MediaPlayer.EVENT.SENTINEL_SEEK);
            assertEventTypeHasNotBeenFired(eventHandler, MediaPlayer.EVENT.SENTINEL_SEEK_FAILURE);
            assert(seekSpy.notCalled);
        });
    };

    mixins.testFirstSentinelGivingUpDoesNotPreventSecondSentinelActivation = function(queue) {
        function xor(a, b) {
            return a !== b;
        }

        expectAsserts(5);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            configureSeekToFail();
            getToPlaying(this, MediaPlayer, 50);
            this._mediaPlayer.pause();

            resetStubsThenAdvanceTimeThenRunSentinels();

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            resetStubsThenAdvanceTimeThenRunSentinels();

            var pauseSentinelFiredOne = eventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_PAUSE);
            var seekSentinelFiredOne = eventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_SEEK);

            // Expect either pause or seek sentinel to fire (last attempt before giving up)
            assert(xor(pauseSentinelFiredOne, seekSentinelFiredOne));

            resetStubsThenAdvanceTimeThenRunSentinels(eventHandler);

            var pauseSentinelFiredTwo = eventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_PAUSE);
            var seekSentinelFiredTwo = eventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_SEEK);

            // Sentinel A has given up, so sentinel B should now fire
            assert(xor(pauseSentinelFiredTwo, seekSentinelFiredTwo));

            // If sentinel A was fired first time, expect sentinel B this time (and vice versa)
            assert(pauseSentinelFiredOne === seekSentinelFiredTwo);

            resetStubsThenAdvanceTimeThenRunSentinels(eventHandler);

            var pauseSentinelFiredThree = eventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_PAUSE);
            var seekSentinelFiredThree = eventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_SEEK);

            // Sentinel A should not come back to life, but sentinel B should still be retrying
            assert(pauseSentinelFiredTwo === pauseSentinelFiredThree);
            assert(seekSentinelFiredTwo === seekSentinelFiredThree);
        });
    };

    mixins.testSeekSentinelAttemptCountIsResetByCallingPlayFrom = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            configureSeekToFail();
            getToPlaying(this, MediaPlayer, 50);

            resetStubsThenAdvanceTimeThenRunSentinels();
            resetStubsThenAdvanceTimeThenRunSentinels();

            this._mediaPlayer.playFrom(50);
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            resetStubsThenAdvanceTimeThenRunSentinels();

            assertEventTypeHasFired(eventHandler, MediaPlayer.EVENT.SENTINEL_SEEK);
            assert(seekSpy.calledOnce);
            assertEquals(50000, seekSpy.getCall(0).args[0]);
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
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 0 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(debugStub.withArgs("playFrom 50 clamped to 0 - seekable range is { start: 0, end: 0 }").calledOnce);
        });
    };

    // TODO: Consider whether the ordering of the pause and seek sentinels is important, and if so we need to assert the order in the tests.

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
    }

    // **** WARNING **** WARNING **** WARNING: These TODOs are NOT complete/exhaustive
    // TODO: Ensure the object element contains a dlna_res_attr param element (CEA-2014-A req 5.7.1.a (2))
    // TODO: Determine if it's possible to support CEA-2014-A req 5.7.1.a (3) - "An <object> element of type video… SHOULD contain a <param> element set to the aspect ratio"
    // TODO: Handle "seek" failing? (CEA-2014-A 5.7.1.F (13))
    // TODO: Consider altering the mock CEHTML object to have play position undefined initially, when stop() is called on the device, and when the media element is
    //       destroyed. This was observed on at least 1 device.


    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all MediaPlayer implementations (last, so it can detect conflicts)
    window.commonTests.mediaPlayer.all.mixinTests(testCase, "antie/devices/mediaplayer/cehtml", config, deviceMockingHooks);

};
