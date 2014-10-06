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
    // jshint newcap: false
    this.HTML5ErrorOnCompleteFixMediaPlayerTests = AsyncTestCase("HTML5ErrorOnCompleteFixMediaPlayer");

    //---------------
    // Mix in the base HTML5 tests to make sure the sub-modifier doesn't break basic functionality
    //---------------

    var mixins = this.HTML5MediaPlayerTests.prototype;
    for (var name in mixins) {
        this.HTML5ErrorOnCompleteFixMediaPlayerTests.prototype[name] = mixins[name];
    };
    this.HTML5ErrorOnCompleteFixMediaPlayerTests.prototype.config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/html5erroroncompletefix"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    //---------------
    // Tests specific to the sub-modifier
    //---------------

    this.HTML5ErrorOnCompleteFixMediaPlayerTests.prototype.testErrorOnEndOfMediaGoesToCompleteState = function(queue) {
        var mediaLength = 100;
        var currentTimeAtMediaEnd = 100;
        this.doTestErrorOnEndOfMediaGoesToCompleteState(queue, mediaLength, currentTimeAtMediaEnd);
    };

    this.HTML5ErrorOnCompleteFixMediaPlayerTests.prototype.testErrorWithinToleranceOfEndOfMediaGoesToCompleteState = function(queue) {
        var mediaLength = 100;
        var currentTimeAtMediaEnd = 98;
        this.doTestErrorOnEndOfMediaGoesToCompleteState(queue, mediaLength, currentTimeAtMediaEnd);
    };

    this.HTML5ErrorOnCompleteFixMediaPlayerTests.prototype.doTestErrorOnEndOfMediaGoesToCompleteState = function(queue, mediaLength, currentTimeAtMediaEnd) {
        expectAsserts(3);
        this.runMediaPlayerTest(queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            this.deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: mediaLength });
            this.deviceMockingHooks.finishBuffering(this._mediaPlayer);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            this.stubCreateElementResults.video.currentTime = currentTimeAtMediaEnd;
            this.deviceMockingHooks.emitPlaybackError(this._mediaPlayer);

            assertEquals(MediaPlayer.EVENT.COMPLETE, eventHandler.lastCall.args[0].type);
            assertEquals(MediaPlayer.STATE.COMPLETE, this._mediaPlayer.getState());
            assert(eventHandler.withArgs({ type: MediaPlayer.EVENT.ERROR}).notCalled);
        });
    };

    this.HTML5ErrorOnCompleteFixMediaPlayerTests.prototype.testErrorBeforeEndIsReportedAsError = function(queue) {
        expectAsserts(2);
        this.runMediaPlayerTest(queue, function (MediaPlayer) {
            this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            this._mediaPlayer.playFrom(0);
            this.deviceMockingHooks.sendMetadata(this._mediaPlayer, 0, { start: 0, end: 100 });
            this.deviceMockingHooks.finishBuffering(this._mediaPlayer);

            var eventHandler = this.sandbox.stub();
            this._mediaPlayer.addEventCallback(null, eventHandler);

            this.stubCreateElementResults.video.currentTime = 97;
            this.deviceMockingHooks.emitPlaybackError(this._mediaPlayer);

            assertEquals(MediaPlayer.EVENT.ERROR, eventHandler.lastCall.args[0].type);
            assertEquals(MediaPlayer.STATE.ERROR, this._mediaPlayer.getState());
        });
    };

    // TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO
    // Refcator/comment/improve the way we bring in the base html5 tests
    // TODO: Non network errors are still reported as errors even when complete
    // TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO

})();
