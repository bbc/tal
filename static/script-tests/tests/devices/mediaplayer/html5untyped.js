/**
 * @preserve Copyright (c) 2015 British Broadcasting Corporation
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
    this.HTML5UntypedMediaPlayerTests = AsyncTestCase("HTML5UntypedMediaPlayer");

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/mediaplayer/html5untyped"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    // ---------------
    // Mix in the base HTML5 tests to make sure the sub-modifier doesn't break basic functionality
    // ---------------
    window.commonTests.mediaPlayer.html5.mixinTests(this.HTML5UntypedMediaPlayerTests, "antie/devices/mediaplayer/html5untyped", config);

    // ---------------
    // Remove tests that are irrelevant for this sub-modifier.
    // ---------------
    delete this.HTML5UntypedMediaPlayerTests.prototype.testSourceURLSetAsChildElementOnSetSource;

    // ---------------
    // Additional tests for this sub-modifier.
    // ---------------
    this.HTML5UntypedMediaPlayerTests.prototype.testSourceURLSetAsChildElementWithoutTypeOnSetSource = function(queue) {
        expectAsserts(5);
        var self = this;
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            assertEquals(0, self.stubCreateElementResults.video.children.length);
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assertEquals(1, self.stubCreateElementResults.video.children.length);
            var childElement = self.stubCreateElementResults.video.firstChild;
            assertEquals('source', childElement.nodeName.toLowerCase());
            assertEquals('http://testurl/', childElement.src);
            assertFalse(!!childElement.type);
        });
    };

})();
