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

    // Setup device specific mocking
    var deviceMockingHooks = {
        setup: function(sandbox, application) {

        },
        sendMetadata: function(mediaPlayer, currentTime, range) {
            mediaPlayer._range = range; // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
            mediaPlayer._currentTime = currentTime; // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        finishBuffering: function(mediaPlayer) {
            mediaPlayer._currentTime = mediaPlayer._targetSeekTime ? mediaPlayer._targetSeekTime : mediaPlayer._currentTime;  // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
            mediaPlayer._onFinishedBuffering(); // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        emitPlaybackError: function(mediaPlayer) {
            mediaPlayer._onDeviceError(); // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        reachEndOfMedia: function(mediaPlayer) {
            mediaPlayer._onEndOfMedia();  // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        startBuffering: function(mediaPlayer) {
            mediaPlayer._onDeviceBuffering();  // FIXME - do not do this in an actual implementation - replace it with proper event mock / whatever.
        },
        mockTime: function(mediaplayer) {
            // FIXME - Implementations can use this hook to set up fake timers if required
        },
        makeOneSecondPass: function(mediaplayer, time) {
            mediaplayer._onStatus();  // FIXME - do not do this in an actual implementation - replace it with proper event / setTimeout mock / whatever.
        },
        unmockTime: function(mediaplayer) {
            // FIXME - Implementations can use this hook to tear down fake timers if required
        }
    };

    this.CEHTMLMediaPlayerTests.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.CEHTMLMediaPlayerTests.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    //---------------------
    // Samsung Maple specific tests
    //---------------------

    // **** WARNING **** WARNING **** WARNING: These TODOs are NOT complete/exhaustive
    // TODO: Make setSource actually set the source and start the media loading
    // TODO: Make playFrom actually seek
    // TODO: Make playFrom actually seek
    // TODO: Make pause actually pause
    // TODO: Make stop actually stop
    // TODO: Make resume actually resume
    // TODO: Ensure reset actually clears the state
    // TODO: Ensure errore are handled
    // TODO: Ensure errors are logged.
    // TODO: Ensure playFrom(...) and play() both clamp to the available range (there's a _getClampedTime helper in the MediaPlayer)
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

    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all MediaPlayer implementations (last, so it can detect conflicts)
    MixinCommonMediaTests(this.CEHTMLMediaPlayerTests, "antie/devices/mediaplayer/cehtml", config, deviceMockingHooks);

})();
