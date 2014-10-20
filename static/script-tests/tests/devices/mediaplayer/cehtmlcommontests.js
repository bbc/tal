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
    var deviceMockingHooks = {
        setup: function(sandbox, application) {
            mockData = {};
            fakeCEHTMLObject.playPosition = 0;
            stubCreateElement(sandbox, application);
            fakeCEHTMLObject.seek = function(milliseconds) {
                fakeCEHTMLObject.playPosition = milliseconds;
            }
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
            if (fakeCEHTMLObject.onPlayStateChange) {
                fakeCEHTMLObject.onPlayStateChange();
            }
        },
        emitPlaybackError: function(mediaPlayer) {
            fakeCEHTMLObject.playState = fakeCEHTMLObject.PLAY_STATE_ERROR;
            fakeCEHTMLObject.onPlayStateChange();
        },
        reachEndOfMedia: function(mediaPlayer) {
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
            clock = sinon.useFakeTimers();
        },
        makeOneSecondPass: function(mediaPlayer) {
            clock.tick(1000);
        },
        unmockTime: function(mediaplayer) {
           clock.restore();
        }
    };

    mixins.setUp = function() {
        this.sandbox = sinon.sandbox.create();

        mockData = {};
        fakeCEHTMLObject = document.createElement("div");
        fakeCEHTMLObject.play = this.sandbox.stub();
        fakeCEHTMLObject.stop = this.sandbox.stub();
        fakeCEHTMLObject.seek = this.sandbox.stub();
        fakeCEHTMLObject.onPlayStateChange = this.sandbox.stub();
        fakeCEHTMLObject.setFullScreen = this.sandbox.stub();
        fakeCEHTMLObject.seek.returns(true);

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
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/cehtml", "antie/devices/mediaplayer/mediaplayer"],
            function(application, MediaPlayerImpl, MediaPlayer) {
                self._createElementStub = stubCreateElement(self.sandbox, application);
                self._device = application.getDevice();
                self._mediaPlayer = self._device.getMediaPlayer();
                action.call(self, MediaPlayer);
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

            assert(fakeCEHTMLObject.play.calledWith(1));
        });
    };

    mixins.testPlayFromWhilePlayingSeeksToCorrectTime = function(queue) {
        expectAsserts(3);
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(fakeCEHTMLObject.play.withArgs(1).calledOnce);
            this._mediaPlayer.playFrom(20);

            assert(fakeCEHTMLObject.seek.calledWith(20000));
            assert(fakeCEHTMLObject.play.withArgs(1).calledTwice);
        });
    };

    mixins.testPlayFromWhilePlayingReturnsToPlayingStateWhenSeekFails = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            fakeCEHTMLObject.seek.returns(false);
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
            assert(fakeCEHTMLObject.play.calledWith(0));
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
            assert(fakeCEHTMLObject.play.calledThrice);
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
            assert(clearIntervalSpy.calledOnce);
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

            assert(fakeCEHTMLObject.seek.calledWith(10000));
        });
    };

    mixins.testPlayFromWhenCompleteStopsMediaBeforeSeekingAndPlaying = function(queue) {
        expectAsserts(5);
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            deviceMockingHooks.reachEndOfMedia(this._mediaPlayer);
            this._mediaPlayer.playFrom(10);

            assert(fakeCEHTMLObject.seek.calledWith(10000));
            assert(fakeCEHTMLObject.stop.calledOnce);
            assert(fakeCEHTMLObject.play.calledAfter(fakeCEHTMLObject.stop));
            assert(fakeCEHTMLObject.play.calledBefore(fakeCEHTMLObject.seek));
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
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

            assert(fakeCEHTMLObject.seek.notCalled);
        });
    };

    mixins.testPlayFromWhenStoppedSeeksToCorrectTime = function(queue) {
        expectAsserts(1);
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(10);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(fakeCEHTMLObject.seek.calledWith(10000));
        });
    };

    mixins.testPlayFromZeroWhenStoppedDoesNotSeek = function(queue) {
        expectAsserts(1);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(fakeCEHTMLObject.seek.notCalled);
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
            assert(fakeCEHTMLObject.seek.calledWith(99.9*1000));
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            this._mediaPlayer.playFrom(-1);
            assertEquals(0, fakeCEHTMLObject.seek.lastCall.args[0]);
        });
    };

    mixins.testPlayFromWhileBufferingAtStartOfMediaSeeksToCorrectTime = function(queue) {
        expectAsserts(3);
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(10);
            this._mediaPlayer.playFrom(20);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(fakeCEHTMLObject.seek.calledWith(20000));
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());

            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
        });
    };

    mixins.testPlayFromThenPauseWhileBufferingAtStartOfMediaPrioritisesSeekingOverPausing = function(queue) {
        expectAsserts(5);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(10);
            this._mediaPlayer.playFrom(20);
            this._mediaPlayer.pause();

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assert(fakeCEHTMLObject.seek.calledWith(20000));
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            // We don't want to tell the device to pause yet - otherwise it will transition to CE-HTML's paused state
            // after the seek, rather than playing, and as a result we won't exit our BUFFERING state.
            assert(fakeCEHTMLObject.play.withArgs(0).notCalled);

            deviceMockingHooks.finishBuffering(this._mediaPlayer);
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
            assert(fakeCEHTMLObject.play.calledOnce);
            assert(fakeCEHTMLObject.play.calledWith(1));

            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);
            assert(fakeCEHTMLObject.play.calledTwice);
            assert(fakeCEHTMLObject.play.calledWith(0));
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
        expectAsserts(3);
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            var errorStub = this.sandbox.stub();
            this.sandbox.stub(this._device, "getLogger").returns({error: errorStub});

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            fakeCEHTMLObject.error = 2;
            deviceMockingHooks.emitPlaybackError(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.ERROR, this._mediaPlayer.getState());
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

    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all MediaPlayer implementations (last, so it can detect conflicts)
    window.commonTests.mediaPlayer.all.mixinTests(testCase, "antie/devices/mediaplayer/cehtml", config, deviceMockingHooks);

}
