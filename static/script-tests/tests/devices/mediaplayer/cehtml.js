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
    this.CEHTMLMediaPlayerTests = AsyncTestCase("CEHTMLMediaPlayer");

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/cehtml"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

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
            stubCreateElement(sandbox, application);
        },
        sendMetadata: function(mediaPlayer, currentTime, range) {
            // CEHTML has no 'metadata' event, so keep these values for later
            mockData.range = range;
            mockData.currentTime = currentTime;
        },
        finishBuffering: function(mediaPlayer) {
            if (!mockData.loaded) {
                fakeCEHTMLObject.playTime = mockData.range.end * 1000;
                fakeCEHTMLObject.playPosition = mockData.currentTime * 1000;
                mockData.loaded = true;
            }
            var currentTimeInSeconds = mediaPlayer._targetSeekTime ? mediaPlayer._targetSeekTime : mockData.currentTime;
            fakeCEHTMLObject.playPosition = currentTimeInSeconds * 1000;
            fakeCEHTMLObject.playState = fakeCEHTMLObject.PLAY_STATE_PLAYING;
            fakeCEHTMLObject.onPlayStateChange();
        },
        emitPlaybackError: function(mediaPlayer) {
            mediaPlayer._onDeviceError(); // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        reachEndOfMedia: function(mediaPlayer) {
            fakeCEHTMLObject.playState = fakeCEHTMLObject.PLAY_STATE_FINISHED;
            fakeCEHTMLObject.onPlayStateChange();  // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
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

    this.CEHTMLMediaPlayerTests.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();

        mockData = {};
        fakeCEHTMLObject = document.createElement("div");
        fakeCEHTMLObject.play = this.sandbox.stub();
        fakeCEHTMLObject.stop = this.sandbox.stub();
        fakeCEHTMLObject.seek = this.sandbox.stub();
        fakeCEHTMLObject.onPlayStateChange = this.sandbox.stub();

        fakeCEHTMLObject.PLAY_STATE_STOPPED = 0;
        fakeCEHTMLObject.PLAY_STATE_PLAYING = 1;
        fakeCEHTMLObject.PLAY_STATE_PAUSED = 2;
        fakeCEHTMLObject.PLAY_STATE_CONNECTING = 3;
        fakeCEHTMLObject.PLAY_STATE_BUFFERING = 4;
        fakeCEHTMLObject.PLAY_STATE_FINISHED = 5;
        fakeCEHTMLObject.PLAY_STATE_ERROR = 6;
    };

    this.CEHTMLMediaPlayerTests.prototype.tearDown = function() {
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

    this.CEHTMLMediaPlayerTests.prototype.testSetSourceCreatesCEHTMLObjectElement = function (queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            assert(self._createElementStub.calledWith("object", "mediaPlayer"));
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testCreatedElementIsPutAtBackOfDOM = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var body = document.getElementsByTagName("body")[0];
            assertSame(fakeCEHTMLObject, body.firstChild);
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testCreatedElementIsRemovedFromDOMOnReset = function(queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            self._mediaPlayer.reset();

            var searchResult = document.getElementById("mediaPlayer");

            assertNull(searchResult);
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testElementIsFullScreen = function(queue) {
        expectAsserts(6);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assertEquals("absolute", fakeCEHTMLObject.style.position);
            assertEquals("0px", fakeCEHTMLObject.style.top);
            assertEquals("0px", fakeCEHTMLObject.style.left);
            assertEquals("100%", fakeCEHTMLObject.style.width);
            assertEquals("100%", fakeCEHTMLObject.style.height);
            assertEquals("", fakeCEHTMLObject.style.zIndex);
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testElementHasCorrectContentType = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assertEquals("video/mp4", fakeCEHTMLObject.type);
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testElementHasCorrectSourceURL = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assertEquals("http://testurl/", fakeCEHTMLObject.data);
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testPlayFromCallsPlay = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);

            assert(fakeCEHTMLObject.play.calledWith(1));
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testPlayFromCallsSeekAndSeeksToCorrectTime = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            self._mediaPlayer.playFrom(20);

            assert(fakeCEHTMLObject.seek.calledWith(20000));
            assert(fakeCEHTMLObject.play.calledWith(1));
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testVideoGoesToPlayingWhenFinishedBuffering = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PLAYING, self._mediaPlayer.getState());
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testVideoGoesToBufferingFromPlaying = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PLAYING, self._mediaPlayer.getState());
            deviceMockingHooks.startBuffering(self._mediaPlayer);
            assertEquals(MediaPlayer.STATE.BUFFERING, self._mediaPlayer.getState());
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testCallingPauseWhilePlayingGoesToPaused = function(queue) {
        expectAsserts(3);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PLAYING, self._mediaPlayer.getState());
            self._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, self._mediaPlayer.getState());
            assert(fakeCEHTMLObject.play.calledWith(0));
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testCallingResumeFromPausedGoesToPlaying = function(queue) {
        expectAsserts(3);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            self._mediaPlayer.pause();
            self._mediaPlayer.resume();
            assertEquals(MediaPlayer.STATE.PLAYING, self._mediaPlayer.getState());
            assert(fakeCEHTMLObject.play.calledThrice);
            assertEquals(1, fakeCEHTMLObject.play.args[2][0]);
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testCallingStopFromPlayingGoesToStopped = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            self._mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, self._mediaPlayer.getState());
            assert(fakeCEHTMLObject.stop.calledOnce);
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testCallingStopFromPausedGoesToStopped = function(queue) {
        expectAsserts(2);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);
            self._mediaPlayer.pause();

            self._mediaPlayer.stop();
            assertEquals(MediaPlayer.STATE.STOPPED, self._mediaPlayer.getState());
            assert(fakeCEHTMLObject.stop.calledOnce);
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testVideoGoesIntoCompleteStateAtTheEnd = function(queue) {
        expectAsserts(1);
        var self = this;
		runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            deviceMockingHooks.reachEndOfMedia();

            assertEquals(MediaPlayer.STATE.COMPLETE, self._mediaPlayer.getState());
            //assert(fakeCEHTMLObject.stop.calledOnce);
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testStatusEventFirerCleanedUpOnReset = function(queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            var clearIntervalSpy = this.sandbox.spy(window,'clearInterval');
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            self._mediaPlayer.reset();
            var originalCount = window.clearInterval.callCount;
            assert(clearIntervalSpy.calledOnce);
        });
    };

    this.CEHTMLMediaPlayerTests.prototype.testPlayFromWhenPausedSeeksToCorrectPoint = function(queue) {
        expectAsserts(1);
        var self = this;
        runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            deviceMockingHooks.finishBuffering(self._mediaPlayer);

            self._mediaPlayer.pause();
            self._mediaPlayer.playFrom(10);

            assert(fakeCEHTMLObject.seek.calledWith(10000));
        });
    };

    // **** WARNING **** WARNING **** WARNING: These TODOs are NOT complete/exhaustive
    // TODO: Handle playstatechange to switch out of BUFFERING state ** check
    // TODO: Regular timeupdate event ** check
    // TODO: getRange ** check
    // TODO: Make pause actually pause
    //  When playing ** check
    //  When buffering
    // TODO: Make stop actually stop ** check
    // TODO: Make resume actually resume
    //  When paused ** check
    //  When buffering
    // TODO: Fix seek beyond end of video
    // TODO: Make playFrom actually seek
    //  When already buffering
    //  When playing ** check
    //  When paused
    //  When complete
    // TODO: Ensure reset actually clears the state
    //  Make sure setInterval is cleaned up
    // TODO: Ensure errors are handled
    // TODO: Ensure errors are logged.
    // TODO: Ensure everything is cleaned up: detach and destroy <object>, clean up event handlers
    // TODO: Ensure playFrom(...) and play() both clamp to the available range (there's a _getClampedTime helper in the MediaPlayer)
    // TODO: Following the completion of buffering, if we last called playFrom or resume then play and enter the playing state, if we last called pause then pause and enter the paused state.
    // TODO: Determine if status event 'ticks' need to be done through a setInterval method rather than as a result of events from the object (see media/cehtml.js)
    // TODO: Determine if the seekTo call blocks until it is complete (see media/cehtml.js:240)
    // TODO: media/cehtmlmediatypefix.js equivalent
    // TODO: Ensure the object data attribute is set tot the URL of the content (CEA-2014-A 5.7.1)
    // TODO: Ensure the object type attribute is set to the MIME-type of the content (CEA-2014-A 5.7.1.a (1))
    // TODO: Ensure the object element contains a dlna_res_attr param element (CEA-2014-A req 5.7.1.a (2))
    // TODO: Determine if it's possible to support CEA-2014-A req 5.7.1.a (3) - "An <object> element of type video… SHOULD contain a <param> element set to the aspect ratio"
    // TODO: Determine if we should use full screen or windowed mode, which are handled differently. (CEA-2014-A 5.7.1.c / 5.7.3)
    //    - 5.7.1.c - there are differences in full screen and windowed modes - fullscreen is 5.7.3
    //    - 5.7.1.g (5) - setFullScreen (default false, 5.7.1.g (3)) - changing modes SHALL not affect the Z-index. If the <overlay> capability is not none other element can be put on top.
    //    - 5.7.3.a (1) - [full screen] SHOULD scale the video content…
    //    - 5.7.3.b - Inside the browser area, full-screen video objects are regular video objects that SHALL cover the entire browser area
    //    - 5.7.3.c - If there is no longer a visible full-screen video object in the browser area … [it] SHALL switch to non-full-screen mode [which MAY scale the browser area - 5.7.3.d]
    // TODO: Handle "seek" failing (CEA-2014-A 5.7.1.F (13))
    // TODO: Handle "seek" not affecting play state (CEA-2014-A 5.7.1.F (13))
    // TODO: Handle "stop" reverting play position to 0 (CEA-2014-A req 5.7.1.f (12))
    // TODO: Create the object element using document.write or the DOM createElement method instead of directly including an oject tag in the CE-HTML page (CEA-2014-A 5.7.1.j)
    // TODO: ensure we are using XHTML 1.0 transitional and object tags (CEA-2014-1 5.4.a).
    // TODO: ensure that we provide non-CSS settings for properties that don't apply to <object> tags (CEA-2014-A Annex G, p 99 - <object>)
    // TODO: Handle that semantics change if the data is a playlist or a single media item (CEA-2014-A 5.7.1.f) - particularly playPosition, playTime
    // TODO: Handle the MediaTypeFix (see existing implementation). Certain devices require the media element to be remade if the media type is changed
    // TODO: Be aware that the media object API uses milliseconds rather than seconds


    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all MediaPlayer implementations (last, so it can detect conflicts)
    window.mixinCommonMediaTests(this.CEHTMLMediaPlayerTests, "antie/devices/mediaplayer/cehtml", config, deviceMockingHooks);

})();
