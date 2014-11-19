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
            }

            fakeCEHTMLObject.play = function(playSpeed) {
                if (playSpeed === 1 && fakeCEHTMLObject.playState === fakeCEHTMLObject.PLAY_STATE_PAUSED) {
                    fakeCEHTMLObject.playState = fakeCEHTMLObject.PLAY_STATE_PLAYING;
                }

                if (playSpeed === 0 && fakeCEHTMLObject.playState === fakeCEHTMLObject.PLAY_STATE_PLAYING) {
                    fakeCEHTMLObject.playState = fakeCEHTMLObject.PLAY_STATE_PAUSED;
                }
            }

            seekSpy = sandbox.spy(fakeCEHTMLObject, 'seek');
            playSpy = sandbox.spy(fakeCEHTMLObject, 'play');
        },
        sendMetadata: function(mediaPlayer, currentTime, range) {
            // CEHTML has no 'metadata' event, so keep these values for later
            mockData.range = range;
        },
        finishBuffering: function(mediaPlayer) {
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
        emitPlaybackError: function(mediaPlayer) {
            fakeCEHTMLObject.playState = fakeCEHTMLObject.PLAY_STATE_ERROR;
            fakeCEHTMLObject.onPlayStateChange();
        },
        reachEndOfMedia: function(mediaPlayer) {
            mockData.loaded = false;
            fakeCEHTMLObject.playTime = 0;
            fakeCEHTMLObject.playPosition = 0;

            fakeCEHTMLObject.playState = fakeCEHTMLObject.PLAY_STATE_FINISHED;
            fakeCEHTMLObject.onPlayStateChange();
        },
        startBuffering: function(mediaPlayer) {
            fakeCEHTMLObject.playState = fakeCEHTMLObject.PLAY_STATE_BUFFERING;
            fakeCEHTMLObject.onPlayStateChange();
        },
        mockTime: function(mediaPlayer) {
            if(clock !== undefined) {
                throw "Trying to mock time twice";
            }
            clock = sinon.useFakeTimers();
        },
        makeOneSecondPass: function (mediaPlayer) {
            clock.tick(1000);
            if (fakeCEHTMLObject.playState === fakeCEHTMLObject.PLAY_STATE_PLAYING) {
                fakeCEHTMLObject.playPosition += 1000;
            }
        },
        unmockTime: function(mediaplayer) {
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

            //assert(fakeCEHTMLObject.setFullScreen.calledWith(true));
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
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(playSpy.withArgs(1).calledOnce);
            this._mediaPlayer.playFrom(20);

            assert(seekSpy.calledWith(20000));
            assert(playSpy.withArgs(1).calledOnce);
        });
    };

    mixins.testPlayFromWhilePlayingReturnsToPlayingStateWhenSeekFails = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            fakeCEHTMLObject.seek = function(milliseconds) {
                fakeCEHTMLObject.playPosition = milliseconds;
                return false;
            }
            this._mediaPlayer.playFrom(10);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
        });
    };

    mixins.testCallingPauseWhilePlayingCallsPlayWithZero = function(queue) {
        expectAsserts(3);
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            this._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assert(playSpy.calledWith(0));
        });
    };

    mixins.testCallingResumeFromPausedCallsPlay = function(queue) {
        expectAsserts(3);
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

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
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            this._mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, this._mediaPlayer.getState());
            assert(fakeCEHTMLObject.stop.calledOnce);
        });
    };

    mixins.testCallingStopFromPausedCallsStop = function(queue) {
        expectAsserts(2);
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
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
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            this._mediaPlayer.pause();
            this._mediaPlayer.playFrom(10);

            assert(seekSpy.calledWith(10000));
        });
    };

    mixins.testPlayFromWhenCompleteStopsMediaBeforeSeekingAndPlaying = function(queue) {
        expectAsserts(8);
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

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
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);
            this._mediaPlayer.playFrom(0);

            assert(seekSpy.notCalled);
        });
    };

    mixins.testPlayFromWhenStoppedSeeksToCorrectTime = function(queue) {
        expectAsserts(1);
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(10);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(seekSpy.calledWith(10000));
        });
    };

    mixins.testPlayFromZeroWhenStoppedDoesNotSeek = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

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
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            this._mediaPlayer.playFrom(110);
            assert(seekSpy.calledWith(99.9*1000));
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
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);

            assert(eventHandler.calledOnce);
            assertEquals(MediaPlayer.EVENT.COMPLETE, eventHandler.lastCall.args[0].type);

            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);

            assert(eventHandler.calledOnce);
        });
    };

    mixins.testSentinelTimerCleanedUpOnReset = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            var clearIntervalSpy = this.sandbox.spy(window,'clearInterval');
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering();

            clock.tick(1100);
            clearIntervalSpy.reset();

            assert(clearIntervalSpy.notCalled);
            this._mediaPlayer.reset();
            assert(clearIntervalSpy.calledWith(this._mediaPlayer._sentinelInterval));
        });
    };

    mixins.testGoesToBufferingWhenDeviceBufferingAndNoBufferingEventFired = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering();

            clock.tick(1100);

            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
        });
    };

    mixins.testGoesToPlayingFromBufferingWhenNoExitBufferingEventFired = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering();
            deviceMockingHooks.startBuffering();

            clock.tick(1000);
            fakeCEHTMLObject.playPosition += 1000;
            clock.tick(1000);
            fakeCEHTMLObject.playPosition += 1000;

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
        });
    };

    mixins.testUnsuccessfulSeekIsRetried = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {

            // Override mock seek function to be unsuccessful
            fakeCEHTMLObject.seek = function(milliseconds) {
                return true;
            }
            seekSpy = this.sandbox.spy(fakeCEHTMLObject, 'seek');

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(30);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(0, this._mediaPlayer.getCurrentTime());

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assert(seekSpy.calledTwice);
            assertEquals(30000, seekSpy.args[1][0]);
        });
    };

    mixins.testRetriedSeekIsClamped = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {

            // Override mock seek function to be unsuccessful
            fakeCEHTMLObject.seek = function(milliseconds) {
                return true;
            }
            seekSpy = this.sandbox.spy(fakeCEHTMLObject, 'seek');

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(110);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(0, this._mediaPlayer.getCurrentTime());

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assert(seekSpy.calledTwice);
            assertEquals(99900, seekSpy.args[1][0]);
        });
    };

    mixins.testSuccessfulInaccurateSeekIsNotRetried = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {

            // Override mock seek function to be inaccurate by 14 seconds
            fakeCEHTMLObject.seek = function(milliseconds) {
                fakeCEHTMLObject.playPosition = milliseconds + 14000;
                return true;
            }
            seekSpy = this.sandbox.spy(fakeCEHTMLObject, 'seek');

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(30);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assertEquals(45, this._mediaPlayer.getCurrentTime());

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assert(seekSpy.calledOnce);
        });
    };

    mixins.testTimeAdvancingBeyondSeekToleranceDoesNotRetrySeek = function(queue) {
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

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
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(116);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(99.9, this._mediaPlayer.getCurrentTime());
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
            }

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(30);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

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
            this._mediaPlayer.beginPlayback();

            this._mediaPlayer.reset();
            // Some (possibly all) CEHTML devices will reset their playPosition upon reset
            fakeCEHTMLObject.playPosition = 0;

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.beginPlayback();
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(0, this._mediaPlayer.getCurrentTime());
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());

            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);
            deviceMockingHooks.makeOneSecondPass(this._mediaPlayer);

            assert(seekSpy.calledOnce);
        });
    };

    mixins.testUnsuccessfulPauseIsRetried = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering();
            this._mediaPlayer.pause();

            assert(playSpy.withArgs(0).calledOnce);

            clock.tick(1000);
            fakeCEHTMLObject.playPosition += 1000;
            clock.tick(1000);
            fakeCEHTMLObject.playPosition += 1000;

            assert(playSpy.withArgs(0).calledTwice);
        });
    };

    mixins.testSuccessfulPauseIsNotRetried = function(queue) {
        expectAsserts(2);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering();
            this._mediaPlayer.pause();

            assert(fakeCEHTMLObject.play.withArgs(0).calledOnce);

            clock.tick(1100);

            assert(fakeCEHTMLObject.play.withArgs(0).calledOnce);
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

}
