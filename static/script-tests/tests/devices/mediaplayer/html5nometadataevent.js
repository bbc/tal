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
    this.HTML5NoMetadataEventMediaPlayerTests = AsyncTestCase("HTML5NoMetadataEventMediaPlayer");

    //---------------
    // Mix in the base HTML5 tests to make sure the sub-modifier doesn't break basic functionality
    //---------------

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/html5nometadataevent"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    //---------------
    // Tests specific to the sub-modifier
    //---------------
    /*

    this.HTML5NoMetadataEventMediaPlayerTests.prototype.testPlayFrom = function(queue) {
        var self = this;
        expectAsserts(2);
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'testURL', 'video/mp4');
            self.stubCreateElementResults.video.play = null;
            var currentTimesOnPlay = [];
            this.sandbox.stub(self.stubCreateElementResults.video, 'play', function () {
                currentTimesOnPlay.push(self.stubCreateElementResults.video.currentTime);
            });
            self._mediaPlayer.playFrom(50);
            self.deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            self.deviceMockingHooks.finishBuffering(self._mediaPlayer);
            assertSame(0,currentTimesOnPlay[0]);
            assertSame(50,currentTimesOnPlay[1]);
        });
    };
    */
    //---------------------
    // Common tests
    //---------------------

    // Mixin the common tests shared by all HTML5 MediaPlayer implementations (last, so it can detect conflicts)

    window.commonTests.mediaPlayer.html5.mixinTests(this.HTML5NoMetadataEventMediaPlayerTests, "antie/devices/mediaplayer/html5nometadataevent", config);

})();
