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
    this.SamsungMapleMediaPlayerTests = AsyncTestCase("SamsungMapleMediaPlayer");

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/samsung_maple"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    var playerPlugin = null;

    // Setup device specific mocking
    var deviceMockingHooks = {
        setup: function(sandbox, application) {

            // Override ResumePlay to update the time for the common tests only - although the Samsung specific tests
            // do use these mocking hooks, they do not call setup.
            playerPlugin.ResumePlay = function (source, seconds) {
                window.SamsungMapleOnCurrentPlayTime(seconds * 1000);
            }
        },
        sendMetadata: function(mediaPlayer, currentTime, range) {
            playerPlugin.GetDuration = function() {
                return range.end * 1000;
            };
            if (window.SamsungMapleOnStreamInfoReady) {
                // Make sure we have the event listeners before calling them (we may have torn down during onError)
                window.SamsungMapleOnStreamInfoReady();
            }
        },
        finishBuffering: function(mediaPlayer) {
            if (window.SamsungMapleOnBufferingComplete) {
                // Make sure we have the event listener before calling it (we may have torn down during onError)
                window.SamsungMapleOnBufferingComplete();
            }
        },
        emitPlaybackError: function(mediaPlayer) {
            window.SamsungMapleOnRenderError();
        },
        reachEndOfMedia: function(mediaPlayer) {
            window.SamsungMapleOnRenderingComplete();
        },
        startBuffering: function(mediaPlayer) {
            window.SamsungMapleOnBufferingStart();
        },
        mockTime: function(mediaplayer) {

        },
        makeOneSecondPass: function(mediaplayer) {
            window.SamsungMapleOnCurrentPlayTime((mediaplayer.getCurrentTime() + 1) * 1000);
        },
        unmockTime: function(mediaplayer) {

        }
    };

    this.SamsungMapleMediaPlayerTests.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();

        playerPlugin = {
            ResumePlay: this.sandbox.stub(),
            Resume: this.sandbox.stub()
        };

        var originalGetElementById = document.getElementById;
        this.sandbox.stub(document, "getElementById", function(id) {
           switch(id) {
               case "playerPlugin":
                   return playerPlugin;
                   break;
               default:
                   return originalGetElementById.call(document, id);
           }
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.SamsungMapleMediaPlayerTests.prototype.runMediaPlayerTest = function (queue, action) {
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/mediaplayer/samsung_maple", "antie/devices/mediaplayer/mediaplayer"],
            function(application, MediaPlayerImpl, MediaPlayer) {
                this._device = application.getDevice();
                self._mediaPlayer = this._device.getMediaPlayer();
                action.call(self, MediaPlayer);
            }, config);
    };

    //---------------------
    // Samsung Maple specific tests
    //---------------------

    var listenerFunctions = [
        'SamsungMapleOnRenderError',
        'SamsungMapleOnRenderingComplete',
        'SamsungMapleOnBufferingStart',
        'SamsungMapleOnBufferingComplete',
        'SamsungMapleOnStreamInfoReady',
        'SamsungMapleOnCurrentPlayTime'
    ];

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionsAddedDuringSetSource = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            var i;
            var func;

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertUndefined("Expecting " + func + " to be undefined", window[func]);
            }

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertFunction("Expecting " + func + " to be a function", window[func]);
            }
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionsRemovedOnError = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var i;
            var func;

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertFunction("Expecting " + func + " to be a function", window[func]);
            }

            deviceMockingHooks.emitPlaybackError(this._mediaPlayer);

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertUndefined("Expecting " + func + " to be undefined", window[func]);
            }
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionsRemovedOnReset = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            var i;
            var func;

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertFunction("Expecting " + func + " to be a function", window[func]);
            }

            this._mediaPlayer.reset();

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                assertUndefined("Expecting " + func + " to be undefined", window[func]);
            }
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionsReferencedOnObjectDuringSetSource = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            var i;
            var func;
            var hook;

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring("SamsungMaple".length);
                assertUndefined(playerPlugin[hook]);
            }

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring("SamsungMaple".length);
                assertEquals(func, playerPlugin[hook]);
            }
        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionReferencesOnObjectRemovedOnError= function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            var i;
            var func;
            var hook;

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring("SamsungMaple".length);
                assertEquals(func, playerPlugin[hook]);
            }

            deviceMockingHooks.emitPlaybackError(this._mediaPlayer);

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring("SamsungMaple".length);
                assertUndefined(playerPlugin[hook]);
            }

        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testSamsungMapleListenerFunctionReferencesOnObjectRemovedOnReset = function(queue) {
        expectAsserts(listenerFunctions.length * 2);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            var i;
            var func;
            var hook;

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring("SamsungMaple".length);
                assertEquals(func, playerPlugin[hook]);
            }

            this._mediaPlayer.reset();

            for (i = 0; i < listenerFunctions.length; i++){
                func = listenerFunctions[i];
                hook = func.substring("SamsungMaple".length);
                assertUndefined(playerPlugin[hook]);
            }

        });
    };

    this.SamsungMapleMediaPlayerTests.prototype.testResumePlayCalledOnDeviceWhenPlayFromCalledInStoppedState = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assertTrue(playerPlugin.ResumePlay.notCalled);
            this._mediaPlayer.playFrom(0);
            assertTrue(playerPlugin.ResumePlay.calledWith('testURL', 0));
            assertTrue(playerPlugin.ResumePlay.calledOnce);
        })
    };

    this.SamsungMapleMediaPlayerTests.prototype.testResumePlayCalledWithTimePassedIntoPlayingFrom = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            assertTrue(playerPlugin.ResumePlay.notCalled);
            this._mediaPlayer.playFrom(19);
            assertTrue(playerPlugin.ResumePlay.calledWith('testURL', 19));
            assertTrue(playerPlugin.ResumePlay.calledOnce);
        })
    };

    this.SamsungMapleMediaPlayerTests.prototype.testResumePlayCalledOnDeviceWhenPlayFromCalledInBufferingState = function(queue) {
        expectAsserts(4);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            assertTrue(playerPlugin.ResumePlay.calledWith('testUrl', 0));
            assertTrue(playerPlugin.ResumePlay.calledOnce);
            this._mediaPlayer.playFrom(50);
            assertTrue(playerPlugin.ResumePlay.calledWith('testUrl', 50));
            assertTrue(playerPlugin.ResumePlay.calledTwice);
        })
    };

    this.SamsungMapleMediaPlayerTests.prototype.testNoSecondBufferingEventWhenPlayingFromABufferingState = function(queue) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            var numEvents = eventHandler.callCount;
            this._mediaPlayer.playFrom(10);
            assertEquals(MediaPlayer.STATE.BUFFERING, this._mediaPlayer.getState());
            assertEquals(numEvents, eventHandler.callCount);
        })
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromCurrentTimeInPlayingStateBuffersThenPlays = function(queue) {
        expectAsserts(5);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            assertEquals(MediaPlayer.STATE.PLAYING, this._mediaPlayer.getState());
            window.SamsungMapleOnCurrentPlayTime(50000);
            assertEquals(50, this._mediaPlayer.getCurrentTime());

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            this._mediaPlayer.playFrom(50);
            assert(eventHandler.calledTwice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.args[1][0].type);
        })
    };

    this.SamsungMapleMediaPlayerTests.prototype.testPlayFromCurrentTimeInPausedStateBuffersThenPlays = function(queue) {
        expectAsserts(7);
        this.runMediaPlayerTest(queue, function(MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "testUrl", "testMimeType");
            this._mediaPlayer.playFrom(0);
            deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 60 });
            deviceMockingHooks.finishBuffering(this._mediaPlayer);

            window.SamsungMapleOnCurrentPlayTime(50000);
            this._mediaPlayer.pause();
            assertEquals(MediaPlayer.STATE.PAUSED, this._mediaPlayer.getState());
            assertEquals(50, this._mediaPlayer.getCurrentTime());

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            assert(playerPlugin.Resume.notCalled);
            this._mediaPlayer.playFrom(50);
            assert(playerPlugin.Resume.calledOnce);
            assert(eventHandler.calledTwice);
            assertEquals(MediaPlayer.EVENT.BUFFERING, eventHandler.args[0][0].type);
            assertEquals(MediaPlayer.EVENT.PLAYING, eventHandler.args[1][0].type);
        })
    };

    // TODO: Make sure we've handled each state correctly for playFrom
    // - Paused (when seeking to current time)

    // **** WARNING **** WARNING **** WARNING: These TODOs are NOT complete/exhaustive
    // TODO: Make setSource actually set the source and start the media loading
    // TODO: Make playFrom actually seek
    // TODO: Make playFrom actually play
    // TODO: Make pause actually pause
    // TODO: Make stop actually stop
    // TODO: Make resume actually resume
    // TODO: Ensure reset actually clears the state
    // TODO: Ensure errors are handled
    //      - on connection failed
    //      - on network disconnected
    //      - on stream not found
    // TODO: Ensure errors are logged.
    // TODO: Ensure playFrom(...) and play() both clamp to the available range (there's a _getClampedTime helper in the MediaPlayer)
    // -- Edge case: when we playFrom beyond end of video from stopped state we need to clamp after metadata is loaded
    // TODO: Check if we should comment in implementation that only one video component can be added to the design at a time - http://www.samsungdforum.com/Guide/tut00078/index.html
    // -- Not clear at time of writing if the tutorial is limiting it based on some sort of SDK/WYSIWYG restriction, or a Samsung Maple restriction
    // TODO: See if all three plugins required by the media/samsung_maple modifier are required
    // TODO: Investigate if we should keep a reference to the original player plugin and restore on tear-down in the same way media/samsung_maple modifier
    // TODO: Ensure we stop and tear-down the media object on error / reset (particularly that references to the event handlers we tear down from Window are removed)
    // TODO: Clean up methods added to window (for use as e.g. playerPlugin.OnRenderingComplete) on tear-down
    // TODO: Investigate if we should do the teardown in window.hide that is done in the media/samsung_maple modifier
    // -- "hide" is needed for newer devices
    // -- "unload" is needed for older devices - media/samsung_maple_unload
    // BE AWARE: Properties are set on the plugin that contain the name of a function on window which are the callback to call when the given event happens (e.g. media/samsung_maple.js:125)
    // TODO: Determine if we need to call our own time update method - media/samsung_maple calls it in a ocuple of places (onRenderingComplete and onCurrentPlayTime)
    // TODO: Determine if we should be disabling the screen saver (this is commented out in media/samsung_maple and the associated URL now 404s.
    // TODO: Determine if calls (e.g. JumpForward) are blocking
    // BE AWARE: JumpForward does not work consistently between either different points in the playback cycle, or depending on the age of the device: see media/samsung_maple:279-281
    // TODO: Investigate when millisenconds should be used

    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all MediaPlayer implementations (last, so it can detect conflicts)
    MixinCommonMediaTests(this.SamsungMapleMediaPlayerTests, "antie/devices/mediaplayer/samsung_maple", config, deviceMockingHooks);

})();
