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
    this.MediaTest = AsyncTestCase("MediaTest");

    this.MediaTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.MediaTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.MediaTest.prototype.testEmbedModeConstantsMatchMediaInterfaceConstants = function (queue) {
        expectAsserts(3);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface", "antie/widgets/media"], function(application, MediaInterface, Media) {
            assertEquals(MediaInterface.EMBED_MODE_EXTERNAL, Media.EMBED_MODE_EXTERNAL);
            assertEquals(MediaInterface.EMBED_MODE_BACKGROUND, Media.EMBED_MODE_BACKGROUND);
            assertEquals(MediaInterface.EMBED_MODE_EMBEDDED, Media.EMBED_MODE_EMBEDDED);
        });
    };

    this.MediaTest.prototype.testNetworkConstantsMatchMediaInterfaceConstants = function (queue) {
        expectAsserts(4);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface", "antie/widgets/media"], function(application, MediaInterface, Media) {
            assertEquals(MediaInterface.NETWORK_EMPTY, Media.NETWORK_EMPTY);
            assertEquals(MediaInterface.NETWORK_IDLE, Media.NETWORK_IDLE);
            assertEquals(MediaInterface.NETWORK_LOADING, Media.NETWORK_LOADING);
            assertEquals(MediaInterface.NETWORK_NO_SOURCE, Media.NETWORK_NO_SOURCE);
        });
    };

    this.MediaTest.prototype.testDataPresenceConstantsMatchMediaInterfaceConstants = function (queue) {
        expectAsserts(5);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface", "antie/widgets/media"], function(application, MediaInterface, Media) {
            assertEquals(MediaInterface.MEDIA_ERR_UNKNOWN, Media.MEDIA_ERR_UNKNOWN);
            assertEquals(MediaInterface.MEDIA_ERR_ABORTED, Media.MEDIA_ERR_ABORTED);
            assertEquals(MediaInterface.MEDIA_ERR_NETWORK, Media.MEDIA_ERR_NETWORK);
            assertEquals(MediaInterface.MEDIA_ERR_DECODE, Media.MEDIA_ERR_DECODE);
            assertEquals(MediaInterface.MEDIA_ERR_SRC_NOT_SUPPORTED, Media.MEDIA_ERR_SRC_NOT_SUPPORTED);
        });
    };

    this.MediaTest.prototype.testReadyStateConstantsMatchMediaInterfaceConstants = function (queue) {
        expectAsserts(5);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/mediainterface", "antie/widgets/media"], function(application, MediaInterface, Media) {
            assertEquals(MediaInterface.HAVE_NOTHING, Media.HAVE_NOTHING);
            assertEquals(MediaInterface.HAVE_METADATA, Media.HAVE_METADATA);
            assertEquals(MediaInterface.HAVE_CURRENT_DATA, Media.HAVE_CURRENT_DATA);
            assertEquals(MediaInterface.HAVE_FUTURE_DATA, Media.HAVE_FUTURE_DATA);
            assertEquals(MediaInterface.HAVE_ENOUGH_DATA, Media.HAVE_ENOUGH_DATA);
        });
    };

    this.MediaTest.prototype.testMediaConstructorArgumentsPassedThroughToCreateMediaInterface = function (queue) {
        expectAsserts(4);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media"], function(application, Device, Media) {

            this.sandbox.stub(Device.prototype, "createMediaInterface");

            new Media("id", "audio");

            var stub = Device.prototype.createMediaInterface;

            assertTrue(stub.calledOnce);
            assertEquals("id", stub.args[0][0]);
            assertEquals("audio", stub.args[0][1]);
            assertFunction(stub.args[0][2]);
        });
    };


    this.MediaTest.prototype.testCreateMediaInterfaceCallbackCausesArgumentEventToBeBubbled = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/widgets/container", "antie/events/event"], function(application, Device, Media, Container, Event) {

            this.sandbox.stub(Device.prototype, "createMediaInterface");

            var media = new Media("id", "audio");

            var callback = Device.prototype.createMediaInterface.args[0][2];

            var parent = new Container("parent");
            this.sandbox.stub(parent, "bubbleEvent");

            parent.appendChildWidget(media);

            var event = new Event("first");

            callback(event);
            assertTrue(parent.bubbleEvent.calledOnce);
            assertTrue(parent.bubbleEvent.calledWith(event));
        });
    };

    this.MediaTest.prototype.testEventCallbackSetsEventTargetToMediaWidget = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/widgets/container", "antie/events/event"], function(application, Device, Media, Container, Event) {

            this.sandbox.stub(Device.prototype, "createMediaInterface");

            var media = new Media("id", "audio");

            var callback = Device.prototype.createMediaInterface.args[0][2];

            var parent = new Container("parent");
            this.sandbox.stub(parent, "bubbleEvent");

            parent.appendChildWidget(media);

            var event = new Event("first");

            callback(event);
            assertSame(media, event.target);

        });
    };

    this.MediaTest.prototype.testRenderDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.render(Device);

            assertTrue(stubMediaInterface.render.calledOnce);
            assertTrue(stubMediaInterface.render.calledWith(Device));

        });
    };

    this.MediaTest.prototype.testRenderReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.render.returns(object);

            var media = new Media("id", "audio");

            var result = media.render(Device);

	        assertSame(media.outputElement, result);
            assertSame(object, result);

        });
    };

    this.MediaTest.prototype.testShowDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.show({});

            assertTrue(stubMediaInterface.show.calledOnce);
            assertTrue(stubMediaInterface.show.calledWith({}));

        });
    };
    this.MediaTest.prototype.testHideDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.hide({});

            assertTrue(stubMediaInterface.hide.calledOnce);
            assertTrue(stubMediaInterface.hide.calledWith({}));

        });
    };
    this.MediaTest.prototype.testMoveToDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.moveTo({});

            assertTrue(stubMediaInterface.moveTo.calledOnce);
            assertTrue(stubMediaInterface.moveTo.calledWith({}));

        });
    };
    this.MediaTest.prototype.testSetWindowDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.setWindow(0,1,2,3);

            assertTrue(stubMediaInterface.setWindow.calledOnce);
            assertTrue(stubMediaInterface.setWindow.calledWith(0,1,2,3));

        });
    };

    this.MediaTest.prototype.testGetErrorDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getError();

            assertTrue(stubMediaInterface.getError.calledOnce);
            assertTrue(stubMediaInterface.getError.calledWith());

        });
    };

    this.MediaTest.prototype.testGetErrorReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getError.returns(object);

            var media = new Media("id", "audio");

            var result = media.getError();

            assertSame(object, result);

        });
    };

    this.MediaTest.prototype.testSetSourcesDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            var sources = [ ];
            var tags = { };

            media.setSources(sources, tags);

            assertTrue(stubMediaInterface.setSources.calledOnce);
            assertTrue(stubMediaInterface.setSources.calledWith(sources, tags));

        });
    };
    this.MediaTest.prototype.testGetSourcesDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getSources();

            assertTrue(stubMediaInterface.getSources.calledOnce);
            assertTrue(stubMediaInterface.getSources.calledWith());

        });
    };

    this.MediaTest.prototype.testGetSourcesReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getSources.returns(object);

            var media = new Media("id", "audio");

            var result = media.getSources();

            assertSame(object, result);

        });
    };
    this.MediaTest.prototype.testGetCurrentSourceDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getCurrentSource();

            assertTrue(stubMediaInterface.getCurrentSource.calledOnce);
            assertTrue(stubMediaInterface.getCurrentSource.calledWith());

        });
    };

    this.MediaTest.prototype.testGetCurrentSourceReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getCurrentSource.returns(object);

            var media = new Media("id", "audio");

            var result = media.getCurrentSource();

            assertSame(object, result);

        });
    };
    this.MediaTest.prototype.testGetNetworkStateDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getNetworkState();

            assertTrue(stubMediaInterface.getNetworkState.calledOnce);
            assertTrue(stubMediaInterface.getNetworkState.calledWith());

        });
    };

    this.MediaTest.prototype.testGetNetworkStateReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getNetworkState.returns(object);

            var media = new Media("id", "audio");

            var result = media.getNetworkState();

            assertSame(object, result);

        });
    };
    this.MediaTest.prototype.testGetPreloadDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getPreload();

            assertTrue(stubMediaInterface.getPreload.calledOnce);
            assertTrue(stubMediaInterface.getPreload.calledWith());

        });
    };

    this.MediaTest.prototype.testGetPreloadReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getPreload.returns(object);

            var media = new Media("id", "audio");

            var result = media.getPreload();

            assertSame(object, result);

        });
    };
    this.MediaTest.prototype.testSetPreloadDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.setPreload(true);

            assertTrue(stubMediaInterface.setPreload.calledOnce);
            assertTrue(stubMediaInterface.setPreload.calledWith(true));

        });
    };
    this.MediaTest.prototype.testGetBufferedDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getBuffered();

            assertTrue(stubMediaInterface.getBuffered.calledOnce);
            assertTrue(stubMediaInterface.getBuffered.calledWith());

        });
    };

    this.MediaTest.prototype.testGetBufferedReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getBuffered.returns(object);

            var media = new Media("id", "audio");

            var result = media.getBuffered();

            assertSame(object, result);

        });
    };

    this.MediaTest.prototype.testLoadDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.load();

            assertTrue(stubMediaInterface.load.calledOnce);
            assertTrue(stubMediaInterface.load.calledWith());

        });
    };
    this.MediaTest.prototype.testCanPlayTypeDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.canPlayType("video/mp4");

            assertTrue(stubMediaInterface.canPlayType.calledOnce);
            assertTrue(stubMediaInterface.canPlayType.calledWith("video/mp4"));

        });
    };

    this.MediaTest.prototype.testCanPlayTypeReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.canPlayType.returns(object);

            var media = new Media("id", "audio");

            var result = media.canPlayType("video/mp4");

            assertSame(object, result);

        });
    };
    this.MediaTest.prototype.testGetReadyStateDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getReadyState();

            assertTrue(stubMediaInterface.getReadyState.calledOnce);
            assertTrue(stubMediaInterface.getReadyState.calledWith());

        });
    };

    this.MediaTest.prototype.testGetReadyStateReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getReadyState.returns(object);

            var media = new Media("id", "audio");

            var result = media.getReadyState();

            assertSame(object, result);

        });
    };
    this.MediaTest.prototype.testGetSeekingDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getSeeking();

            assertTrue(stubMediaInterface.getSeeking.calledOnce);
            assertTrue(stubMediaInterface.getSeeking.calledWith());

        });
    };
    this.MediaTest.prototype.testGetSeekingReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getSeeking.returns(object);

            var media = new Media("id", "audio");

            var result = media.getSeeking();

            assertSame(object, result);

        });
    };

    this.MediaTest.prototype.testSetCurrentTimeDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.setCurrentTime(120);

            assertTrue(stubMediaInterface.setCurrentTime.calledOnce);
            assertTrue(stubMediaInterface.setCurrentTime.calledWith(120));

        });
    };
    this.MediaTest.prototype.testGetCurrentTimeDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getCurrentTime();

            assertTrue(stubMediaInterface.getCurrentTime.calledOnce);
            assertTrue(stubMediaInterface.getCurrentTime.calledWith());

        });
    };
    this.MediaTest.prototype.testGetInitialTimeDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getInitialTime();

            assertTrue(stubMediaInterface.getInitialTime.calledOnce);
            assertTrue(stubMediaInterface.getInitialTime.calledWith());

        });
    };

    this.MediaTest.prototype.testGetInitialTimeReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getInitialTime.returns(object);

            var media = new Media("id", "audio");

            var result = media.getInitialTime();

            assertSame(object, result);

        });
    };

    this.MediaTest.prototype.testGetDurationDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getDuration();

            assertTrue(stubMediaInterface.getDuration.calledOnce);
            assertTrue(stubMediaInterface.getDuration.calledWith());

        });
    };

    this.MediaTest.prototype.testGetDurationReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getDuration.returns(object);

            var media = new Media("id", "audio");

            var result = media.getDuration();

            assertSame(object, result);

        });
    };

    this.MediaTest.prototype.testGetStartOffsetTimeDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getStartOffsetTime();

            assertTrue(stubMediaInterface.getStartOffsetTime.calledOnce);
            assertTrue(stubMediaInterface.getStartOffsetTime.calledWith());

        });
    };

    this.MediaTest.prototype.testGetStartOffsetTimeReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getStartOffsetTime.returns(object);

            var media = new Media("id", "audio");

            var result = media.getStartOffsetTime();

            assertSame(object, result);

        });
    };

    this.MediaTest.prototype.testGetPausedDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getPaused();

            assertTrue(stubMediaInterface.getPaused.calledOnce);
            assertTrue(stubMediaInterface.getPaused.calledWith());

        });
    };
    this.MediaTest.prototype.testGetPausedReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getPaused.returns(object);

            var media = new Media("id", "audio");

            var result = media.getPaused();

            assertSame(object, result);

        });
    };

    this.MediaTest.prototype.testGetDefaultPlaybackRateDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getDefaultPlaybackRate();

            assertTrue(stubMediaInterface.getDefaultPlaybackRate.calledOnce);
            assertTrue(stubMediaInterface.getDefaultPlaybackRate.calledWith());

        });
    };

    this.MediaTest.prototype.testGetSDefaultPlaybackRateReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getDefaultPlaybackRate.returns(object);

            var media = new Media("id", "audio");

            var result = media.getDefaultPlaybackRate();

            assertSame(object, result);

        });
    };

    this.MediaTest.prototype.testGetPlaybackRateDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getPlaybackRate();

            assertTrue(stubMediaInterface.getPlaybackRate.calledOnce);
            assertTrue(stubMediaInterface.getPlaybackRate.calledWith());

        });
    };

    this.MediaTest.prototype.testGetPlaybackRateReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getPlaybackRate.returns(object);

            var media = new Media("id", "audio");

            var result = media.getPlaybackRate();

            assertSame(object, result);

        });
    };

    this.MediaTest.prototype.testSetPlaybackRateDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.setPlaybackRate(1);

            assertTrue(stubMediaInterface.setPlaybackRate.calledOnce);
            assertTrue(stubMediaInterface.setPlaybackRate.calledWith(1));

        });
    };
    this.MediaTest.prototype.testGetPlayedDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getPlayed();

            assertTrue(stubMediaInterface.getPlayed.calledOnce);
            assertTrue(stubMediaInterface.getPlayed.calledWith());

        });
    };

    this.MediaTest.prototype.testGetPlayedReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getPlayed.returns(object);

            var media = new Media("id", "audio");

            var result = media.getPlayed();

            assertSame(object, result);

        });
    };

    this.MediaTest.prototype.testGetSeekableDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getSeekable();

            assertTrue(stubMediaInterface.getSeekable.calledOnce);
            assertTrue(stubMediaInterface.getSeekable.calledWith());

        });
    };

    this.MediaTest.prototype.testGetSeekableReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getSeekable.returns(object);

            var media = new Media("id", "audio");

            var result = media.getSeekable();

            assertSame(object, result);

        });
    };

    this.MediaTest.prototype.testGetEndedDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getEnded();

            assertTrue(stubMediaInterface.getEnded.calledOnce);
            assertTrue(stubMediaInterface.getEnded.calledWith());

        });
    };
    this.MediaTest.prototype.testGetEndedReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getEnded.returns(object);

            var media = new Media("id", "audio");

            var result = media.getEnded();

            assertSame(object, result);

        });
    };
    this.MediaTest.prototype.testGetAutoPlayDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getAutoPlay();

            assertTrue(stubMediaInterface.getAutoPlay.calledOnce);
            assertTrue(stubMediaInterface.getAutoPlay.calledWith());

        });
    };

    this.MediaTest.prototype.testGetAutoPlayReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getAutoPlay.returns(object);

            var media = new Media("id", "audio");

            var result = media.getAutoPlay();

            assertSame(object, result);

        });
    };

    this.MediaTest.prototype.testSetAutoPlayDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.setAutoPlay(false);

            assertTrue(stubMediaInterface.setAutoPlay.calledOnce);
            assertTrue(stubMediaInterface.setAutoPlay.calledWith(false));

        });
    };
    this.MediaTest.prototype.testGetLoopDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getLoop();

            assertTrue(stubMediaInterface.getLoop.calledOnce);
            assertTrue(stubMediaInterface.getLoop.calledWith());

        });
    };
    this.MediaTest.prototype.testGetLoopReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getLoop.returns(object);

            var media = new Media("id", "audio");

            var result = media.getLoop();

            assertSame(object, result);

        });
    };
    this.MediaTest.prototype.testSetLoopDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.setLoop(true);

            assertTrue(stubMediaInterface.setLoop.calledOnce);
            assertTrue(stubMediaInterface.setLoop.calledWith(true));

        });
    };
    this.MediaTest.prototype.testPlayDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.play();

            assertTrue(stubMediaInterface.play.calledOnce);
            assertTrue(stubMediaInterface.play.calledWith());

        });
    };
    this.MediaTest.prototype.testStopDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.stop();

            assertTrue(stubMediaInterface.stop.calledOnce);
            assertTrue(stubMediaInterface.stop.calledWith());

        });
    };
    this.MediaTest.prototype.testPauseDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.pause();

            assertTrue(stubMediaInterface.pause.calledOnce);
            assertTrue(stubMediaInterface.pause.calledWith());

        });
    };
    this.MediaTest.prototype.testSetNativeControlsDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.setNativeControls(false);

            assertTrue(stubMediaInterface.setNativeControls.calledOnce);
            assertTrue(stubMediaInterface.setNativeControls.calledWith(false));

        });
    };
    this.MediaTest.prototype.testGetNativeControlsDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.getNativeControls();

            assertTrue(stubMediaInterface.getNativeControls.calledOnce);
            assertTrue(stubMediaInterface.getNativeControls.calledWith());

        });
    };
    this.MediaTest.prototype.testGetNavitveControlsReturnsResultFromMediaInterface = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            stubMediaInterface.getNativeControls.returns(object);

            var media = new Media("id", "audio");

            var result = media.getNativeControls();

            assertSame(object, result);

        });
    };
    this.MediaTest.prototype.testSetVolumeDefersToDevice = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            this.sandbox.stub(Device.prototype, "setVolume");

            var media = new Media("id", "audio");

            media.setVolume(0);

            assertTrue(Device.prototype.setVolume.calledOnce);
            assertTrue(Device.prototype.setVolume.calledWith(0));

        });
    };
    this.MediaTest.prototype.testGetVolumeDefersToDevice = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            this.sandbox.stub(Device.prototype, "getVolume");

            var media = new Media("id", "audio");

            media.getVolume();

            assertTrue(Device.prototype.getVolume.calledOnce);
            assertTrue(Device.prototype.getVolume.calledWith());

        });
    };
    this.MediaTest.prototype.testGetVolumeReturnsResultFromDevice = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            this.sandbox.stub(Device.prototype, "getVolume").returns(object);

            var media = new Media("id", "audio");

            var result = media.getVolume();

            assertSame(object, result);

        });
    };
    this.MediaTest.prototype.testSetMutedDefersToDevice = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            this.sandbox.stub(Device.prototype, "setMuted");

            var media = new Media("id", "audio");

            media.setMuted(false);

            assertTrue(Device.prototype.setMuted.calledOnce);
            assertTrue(Device.prototype.setMuted.calledWith(false));

        });
    };
    this.MediaTest.prototype.testGetMutedDefersToDevice = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            this.sandbox.stub(Device.prototype, "getMuted");

            var media = new Media("id", "audio");

            media.getMuted();

            assertTrue(Device.prototype.getMuted.calledOnce);
            assertTrue(Device.prototype.getMuted.calledWith());

        });
    };
    this.MediaTest.prototype.testGetMutedReturnsResultFromDevice = function (queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {


            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var object = { };
            this.sandbox.stub(Device.prototype, "getMuted").returns(object);

            var media = new Media("id", "audio");

            var result = media.getMuted();

            assertSame(object, result);

        });
    };
    this.MediaTest.prototype.testDestroyDefersToMediaInterface = function (queue) {
        expectAsserts(2);
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/device", "antie/widgets/media", "antie/devices/media/mediainterface"], function(application, Device, Media, MediaInterface) {

            var stubMediaInterface = this.sandbox.stub(MediaInterface.prototype);
            this.sandbox.stub(Device.prototype, "createMediaInterface");
            Device.prototype.createMediaInterface.returns(stubMediaInterface);

            var media = new Media("id", "audio");

            media.destroy();

            assertTrue(stubMediaInterface.destroy.calledOnce);
            assertTrue(stubMediaInterface.destroy.calledWith());

        });
    };

})();
