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
    this.SeekStateTest = AsyncTestCase("Devices.Media.SeekState");

    this.SeekStateTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.SeekStateTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.SeekStateTest.prototype.testSeekStateExtendsClass = function (queue) {
        queuedRequire(queue, ["antie/devices/media/seekstate", "antie/class"], function(SeekState, Class) {

            var eventHandlingCallback = this.sandbox.stub();
            var seekState = new SeekState(eventHandlingCallback);

            assertInstanceOf(Class, seekState);

        });
    }

    this.SeekStateTest.prototype.testSeekToGeneratesSeeking = function (queue) {
        queuedRequire(queue, ["antie/devices/media/seekstate"], function(SeekState) {

            var eventHandlingCallback = this.sandbox.stub();

            var seekState = new SeekState(eventHandlingCallback);
            seekState.seekTo( 10 );

            assertTrue(eventHandlingCallback.calledOnce);

            var event = eventHandlingCallback.args[0][0];

            assertEquals("seeking", event.type);
        });
    };

    this.SeekStateTest.prototype.testSeekToSamePointDoesNotGeneratesSeeking = function (queue) {
        queuedRequire(queue, ["antie/devices/media/seekstate"], function(SeekState) {

            var eventHandlingCallback = this.sandbox.stub();

            var seekState = new SeekState(eventHandlingCallback);
            seekState.seekTo(10);
            seekState.seekTo(10);

            assertTrue(eventHandlingCallback.calledOnce);
        });
    };

    this.SeekStateTest.prototype.testSeekThenPlayingGeneratesSeeked = function (queue) {
        queuedRequire(queue, ["antie/devices/media/seekstate"], function(SeekState) {

            var eventHandlingCallback = this.sandbox.stub();

            var seekState = new SeekState(eventHandlingCallback);
            seekState.seekTo(10);
            seekState.playing();

            assertTrue(eventHandlingCallback.calledTwice);

            var event = eventHandlingCallback.args[1][0];

            assertEquals("seeked", event.type);
        });
    };



})();
