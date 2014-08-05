/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
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
    this.MediaPlayerInterfaceTest = AsyncTestCase("MediaPlayerInterfaceTest");

    this.MediaPlayerInterfaceTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.MediaPlayerInterfaceTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.MediaPlayerInterfaceTest.prototype.testMediaPlayerInterfaceInitDoesNotThrowAnExceptionWhenCalled = function (queue) {
        expectAsserts(1);
        queuedRequire(queue, ["antie/devices/media/mediaplayerinterface"], function(MediaPlayerInterface) {
            assertNoException(function() {
                new MediaPlayerInterface('video', function(evt){});
            });
        });
    };

    var testThatInterfaceFunctionThrowsError = function (action) {
        return function (queue) {
            expectAsserts(1);
            queuedRequire(queue, ["antie/devices/media/mediaplayerinterface"], function(MediaPlayerInterface) {
                var mediaPlayerInterface = new MediaPlayerInterface('video', function(evt){});
                assertException(function() {
                    action(mediaPlayerInterface);
                }, "Error");
            });
        };
    }

    this.MediaPlayerInterfaceTest.prototype.testMediaPlayerInterfaceSetSourceThrowsAnExceptionWhenNotOverridden = testThatInterfaceFunctionThrowsError(function(mediaPlayerInterface) {
        mediaPlayerInterface.setSource('url', 'mime');
    });

    this.MediaPlayerInterfaceTest.prototype.testMediaPlayerInterfacepPlayThrowsAnExceptionWhenNotOverridden = testThatInterfaceFunctionThrowsError(function(mediaPlayerInterface) {
        mediaPlayerInterface.play();
    });

    this.MediaPlayerInterfaceTest.prototype.testMediaPlayerInterfacePlayFromThrowsAnExceptionWhenNotOverridden = testThatInterfaceFunctionThrowsError(function(mediaPlayerInterface) {
        mediaPlayerInterface.playFrom("jumbo");
    });

    this.MediaPlayerInterfaceTest.prototype.testMediaPlayerInterfacePauseThrowsAnExceptionWhenNotOverridden = testThatInterfaceFunctionThrowsError(function(mediaPlayerInterface) {
        mediaPlayerInterface.pause();
    });

    this.MediaPlayerInterfaceTest.prototype.testMediaPlayerInterfaceStopThrowsAnExceptionWhenNotOverridden = testThatInterfaceFunctionThrowsError(function(mediaPlayerInterface) {
        mediaPlayerInterface.stop();
    });

})();
