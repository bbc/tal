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
    this.HTML5MemoryLeakUnfixMediaPlayerTests = AsyncTestCase("HTML5MemoryLeakUnfixMediaPlayer");

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/html5memoryleakunfix"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    // ---------------
    // Mix in the base HTML5 tests to make sure the sub-modifier doesn't break basic functionality
    // ---------------
    window.commonTests.mediaPlayer.html5.mixinTests(this.HTML5MemoryLeakUnfixMediaPlayerTests, "antie/devices/mediaplayer/html5memoryleakunfix", config);

    // ---------------
    // Remove tests that are irrelevant for this sub-modifier.
    // ---------------
    delete this.HTML5MemoryLeakUnfixMediaPlayerTests.prototype.testResetUnloadsMediaElementSourceAsPerGuidelines;

    // ---------------
    // Additional tests for this sub-modifier.
    // ---------------
    this.HTML5MemoryLeakUnfixMediaPlayerTests.prototype.testResetDoesNotUnloadMediaElementSourceAsPerNormalHtml5Guidelines = function(queue) {
        expectAsserts(2);
        var self = this;
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            self.stubCreateElementResults.video.load.reset();
            self.sandbox.stub(self.stubCreateElementResults.video, 'removeAttribute');

            self._mediaPlayer.reset();

            assert(self.stubCreateElementResults.video.removeAttribute.withArgs('src').notCalled);
            assert(self.stubCreateElementResults.video.load.notCalled);
        });
    };
})();
