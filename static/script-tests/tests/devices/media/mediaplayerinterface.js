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
                new MediaPlayerInterface();
            });
        });
    };

    var createSubClass = function(MediaPlayerInterface) {
        return MediaPlayerInterface.extend({
            doEvent: function(type) {
                this._emitEvent(type);
            },
            getSource: function () { return "url"; },
            getMimeType: function () { return "mime/type"; },
            getCurrentTime: function () { return 0; },
            getRange: function () { return { start: 0, end: 100 }; },
            getState: function () { return MediaPlayerInterface.STATE.PLAYING; }
        });
    };

    this.MediaPlayerInterfaceTest.prototype.testEventsEmittedBySubclassGoToAddedCallbackWithAllMetadata = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/devices/media/mediaplayerinterface"], function(MediaPlayerInterface) {

            var SubClass = createSubClass(MediaPlayerInterface);
            var instance = new SubClass();
            var callback = this.sandbox.stub();

            instance.addEventCallback(null, callback);
            instance.doEvent(MediaPlayerInterface.EVENT.STATUS);

            assert(callback.calledOnce);
            assert(callback.calledWith({
                type: MediaPlayerInterface.EVENT.STATUS,
                currentTime: 0,
                range: { start: 0, end: 100 },
                url: "url",
                mimeType: "mime/type",
                state: MediaPlayerInterface.STATE.PLAYING
            }));
        });
    };

    this.MediaPlayerInterfaceTest.prototype.testEventsEmittedBySubclassHaveMetaDataCollectedFromAccessors = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/devices/media/mediaplayerinterface"], function(MediaPlayerInterface) {

            var SubClass = MediaPlayerInterface.extend({
                doEvent: function(type) {
                    this._emitEvent(type);
                },
                getSource: function () { return "url2"; },
                getMimeType: function () { return "mime/type2"; },
                getCurrentTime: function () { return 2; },
                getRange: function () { return { start: 22, end: 200 }; },
                getState: function () { return MediaPlayerInterface.STATE.BUFFERING; }
            });

            var instance = new SubClass();
            var callback = this.sandbox.stub();

            instance.addEventCallback(null, callback);
            instance.doEvent(MediaPlayerInterface.EVENT.BUFFERING);

            assert(callback.calledOnce);
            assert(callback.calledWith({
                type: MediaPlayerInterface.EVENT.BUFFERING,
                currentTime: 2,
                range: { start: 22, end: 200 },
                url: "url2",
                mimeType: "mime/type2",
                state: MediaPlayerInterface.STATE.BUFFERING
            }));
        });
    };

    this.MediaPlayerInterfaceTest.prototype.testEventsEmittedBySubclassDoNotGoToSpecificallyRemovedCallback = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/devices/media/mediaplayerinterface"], function(MediaPlayerInterface) {

            var SubClass = createSubClass(MediaPlayerInterface);
            var instance = new SubClass();
            var callback = this.sandbox.stub();
            var callback2 = this.sandbox.stub();

            instance.addEventCallback(null, callback);
            instance.addEventCallback(null, callback2);
            instance.removeEventCallback(null, callback);
            instance.doEvent(MediaPlayerInterface.EVENT.STATUS);

            assert(callback.notCalled);
            assert(callback2.calledOnce);
        });
    };

    this.MediaPlayerInterfaceTest.prototype.testEventsEmittedBySubclassDoNotGoToAnyRemovedCallback = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ["antie/devices/media/mediaplayerinterface"], function(MediaPlayerInterface) {

            var SubClass = createSubClass(MediaPlayerInterface);
            var instance = new SubClass();
            var callback = this.sandbox.stub();
            var callback2 = this.sandbox.stub();

            instance.addEventCallback(null, callback);
            instance.addEventCallback(null, callback2);
            instance.removeAllEventCallbacks();
            instance.doEvent(MediaPlayerInterface.EVENT.STATUS);

            assert(callback.notCalled);
            assert(callback2.notCalled);
        });
    };


    var testThatInterfaceFunctionThrowsError = function (action) {
        return function (queue) {
            expectAsserts(1);
            queuedRequire(queue, ["antie/devices/media/mediaplayerinterface"], function(MediaPlayerInterface) {
                var mediaPlayerInterface = new MediaPlayerInterface();
                assertException(function() {
                    action(mediaPlayerInterface);
                }, "Error");
            });
        };
    };

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

    this.MediaPlayerInterfaceTest.prototype.testMediaPlayerInterfaceResetThrowsAnExceptionWhenNotOverridden = testThatInterfaceFunctionThrowsError(function(mediaPlayerInterface) {
        mediaPlayerInterface.reset();
    });

    this.MediaPlayerInterfaceTest.prototype.testMediaPlayerInterfaceGetSourceThrowsAnExceptionWhenNotOverridden = testThatInterfaceFunctionThrowsError(function(mediaPlayerInterface) {
        mediaPlayerInterface.getSource();
    });

    this.MediaPlayerInterfaceTest.prototype.testMediaPlayerInterfaceGetMimeTypeThrowsAnExceptionWhenNotOverridden = testThatInterfaceFunctionThrowsError(function(mediaPlayerInterface) {
        mediaPlayerInterface.getMimeType();
    });

    this.MediaPlayerInterfaceTest.prototype.testMediaPlayerInterfaceGetCurrentTimeThrowsAnExceptionWhenNotOverridden = testThatInterfaceFunctionThrowsError(function(mediaPlayerInterface) {
        mediaPlayerInterface.getCurrentTime();
    });

    this.MediaPlayerInterfaceTest.prototype.testMediaPlayerInterfaceGetRangeThrowsAnExceptionWhenNotOverridden = testThatInterfaceFunctionThrowsError(function(mediaPlayerInterface) {
        mediaPlayerInterface.getRange();
    });

    this.MediaPlayerInterfaceTest.prototype.testMediaPlayerInterfaceGetStateThrowsAnExceptionWhenNotOverridden = testThatInterfaceFunctionThrowsError(function(mediaPlayerInterface) {
        mediaPlayerInterface.getState();
    });

})();
