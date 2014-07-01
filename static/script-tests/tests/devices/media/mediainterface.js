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
    this.MediaInterfaceTest = AsyncTestCase("MediaInterfaceTest");

    this.MediaInterfaceTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.MediaInterfaceTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceInitDoesNotThrowAnExceptionWhenCalled = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            assertNoException(function() {
                new MediaInterface('id', 'video', function(evt){});
            });
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceRenderDoesNotThrowAnExceptionWhenCalled = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            var mockDevice = {};
            assertNoException(function() {
                mediaInterface.render(mockDevice);
            });
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceShowThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            var mockOptions = {};
            assertException(function() {
                mediaInterface.show(mockOptions);
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceHideThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            var mockOptions = {};
            assertException(function() {
                mediaInterface.hide(mockOptions);
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceMoveToThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            var mockOptions = {};
            assertException(function() {
                mediaInterface.moveTo(mockOptions);
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceSetWindowThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.setWindow(1, 2, 3, 4);
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetErrorThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getError();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceSetSourcesThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            var mockSources = [];
            var mockTags = {};
            assertException(function() {
                mediaInterface.setSources(mockSources, mockTags);
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetSourcesThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getSources();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetCurrentSourceThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getCurrentSource();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetNetworkStateThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getNetworkState();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetPreloadThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getPreload();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceSetPreloadThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.setPreload(false);
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetBufferedThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getBuffered();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceLoadThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.load();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceCanPlayTypeThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.canPlayType('video/mp4');
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetReadyStateThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getReadyState();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetSeekingThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getSeeking();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceSetCurrentTimeThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.setCurrentTime(0);
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetCurrentTimeThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getCurrentTime();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetInitialTimeThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getInitialTime();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetDurationThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getDuration();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetStartOffsetTimeThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getStartOffsetTime();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetPausedThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getPaused();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetDefaultPlaybackRateThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getDefaultPlaybackRate();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetPlaybackRateThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getPlaybackRate();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceSetPlaybackRateThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.setPlaybackRate(1);
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetPlayedThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getPlayed();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetSeekableThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getSeekable();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetEndedThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getEnded();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetAutoPlayThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getAutoPlay();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceSetAutoPlayThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.setAutoPlay(true);
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetLoopThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getLoop();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceSetLoopThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.setLoop(false);
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfacePlayThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.play();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceStopThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.stop();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfacePauseThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.pause();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceSetNativeControlsThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            var mockNativeControls = {};
            assertException(function() {
                mediaInterface.setNativeControls(mockNativeControls);
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceGetNativeControlsThrowsExceptionWhenNotOverridden = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertException(function() {
                mediaInterface.getNativeControls();
            }, "Error");
        });
    };

    this.MediaInterfaceTest.prototype.testMediaInterfaceDestroyDoesNotThrowAnExceptionWhenCalled = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface"], function(application, MediaInterface) {
            var mediaInterface = new MediaInterface('id', 'video', function(evt){});
            assertNoException(function() {
                mediaInterface.destroy();
            });
        });
    };



})();
