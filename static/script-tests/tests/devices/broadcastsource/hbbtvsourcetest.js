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
    this.hbbtvSource = AsyncTestCase("HBBTV Broadcast Source");

    this.hbbtvSource.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
        // Mock the HBBTV APIs and tune to BBC One
        this.stubHBBTVSpecificApis();
    };

    this.hbbtvSource.prototype.tearDown = function() {
        this.removeHBBTVSpecificApis();
        this.sandbox.restore();
    };

    this.hbbtvSource.prototype.testCreateBroadcastSourceReturnsHBBTVObject = function(queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/basetvsource"], function(application, BaseTvSource) {
            var device = application.getDevice();
            var returnedBroadcastSource = device.createBroadcastSource();

            assertEquals('BroadcastSource should be an object', 'object', typeof returnedBroadcastSource);
            assert('BrowserDevice should extend from Device', returnedBroadcastSource instanceof BaseTvSource);
            // also check that is it of type HBBTVsource
        }, config);
    };

    this.hbbtvSource.prototype.testCreateBroadcastWhenHbbTvApiIsNotAvailableThrowsException = function(queue) {
        expectAsserts(1);

        this.removeHBBTVSpecificApis();

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            assertException("Unable to initialise HbbTV broadcast source", function() {
                device.createBroadcastSource();
            });
        }, config);
    };

    this.hbbtvSource.prototype.testCreateBroadcastSourceSetsTheBroadcastToFullScreenAt720p = function(queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();

            // Mock getBestFitLayout as unsure of the actual browser size when running in headless environment
            this.sandbox.stub(application, "getLayout", function() {
                return {
                    requiredScreenSize: { height: 720, width: 1280 }
                };
            });

            device.createBroadcastSource();
            assertEquals('BroadcastSource width should be 1280px', '1280px', this.hbbtvPlugin.style.width);
            assertEquals('BroadcastSource height should be 720px', '720px', this.hbbtvPlugin.style.height);
        }, config);
    };

    this.hbbtvSource.prototype.testCreateBroadcastSourceSetsTheBroadcastToFullScreenAt1080p = function(queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();

            // Mock getBestFitLayout as unsure of the browser size when running headless
            this.sandbox.stub(application, "getLayout", function() {
                return {
                    requiredScreenSize: { height: 1080, width: 1920 }
                };
            });

            device.createBroadcastSource();
            assertEquals('BroadcastSource width should be 1920px', '1920px', this.hbbtvPlugin.style.width);
            assertEquals('BroadcastSource height should be 1080px', '1080px', this.hbbtvPlugin.style.height);
        }, config);
    };

    this.hbbtvSource.prototype.testSetPositionWithOffsetSetsTheCorrectCSSProperties = function(queue) {
        expectAsserts(4);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.setPosition(10, 20, 30, 40);

            assertEquals('BroadcastSource top position should be 10px', '10px', this.hbbtvPlugin.style.top);
            assertEquals('BroadcastSource left position should be 20px', '20px', this.hbbtvPlugin.style.left);
            assertEquals('BroadcastSource width should be 30px', '30px', this.hbbtvPlugin.style.width);
            assertEquals('BroadcastSource height should be 40px', '40px', this.hbbtvPlugin.style.height);
        }, config);
    };

    this.hbbtvSource.prototype.testShowCurrentChannelCallsHBBTVbindToCurrentChannel = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var hbbtvApiSpy = this.sandbox.spy(this.hbbtvPlugin, "bindToCurrentChannel");
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.showCurrentChannel();
            assertTrue("Native HBBTV bindToCurrentChannel function called", hbbtvApiSpy.called);
        }, config);
    };

    this.hbbtvSource.prototype.testStopCurrentChannelCallsHBBTVStop = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var hbbtvApiSpy = this.sandbox.spy(this.hbbtvPlugin, "stop");
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.stopCurrentChannel();
            assertTrue("Native HBBTV bindToCurrentChannel function called", hbbtvApiSpy.called);
        }, config);
    };

    this.hbbtvSource.prototype.testgetCurrentChannelNameGetsTheHBBTVCurrentChannelProperty = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            var channelName = broadcastSource.getCurrentChannelName();
            assertEquals('Channel name should be BBC One', 'BBC One', channelName);
        }, config);
    };

    this.hbbtvSource.prototype.testgetCurrentChannelNameThrowsExceptionWhenHBBTVCurrentChannelObjectIsNull = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            this.hbbtvPlugin.currentChannel = null;
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            assertException("Current channel name not available", function() {
                broadcastSource.getCurrentChannelName();
            });
        }, config);
    };

    this.hbbtvSource.prototype.testgetCurrentChannelNameThrowsExceptionWhenHBBTVCurrentChannelNamePropertyIsNull = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            this.hbbtvPlugin.currentChannel.name = null;
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            assertException("Current channel name is null", function() {
                broadcastSource.getCurrentChannelName();
            });
        }, config);
    };

    this.hbbtvSource.prototype.testgetCurrentChannelNameThrowsExceptionWhenHBBTVCurrentChannelNamePropertyIsUndefined = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            this.hbbtvPlugin.currentChannel.name = undefined;
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            assertException("Current channel name is not defined", function() {
                broadcastSource.getCurrentChannelName();
            });
        }, config);
    };

    this.hbbtvSource.prototype.testGetPlayStateReturnsHBBTVPlayStateProperty = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            var playState = broadcastSource.getPlayState();
            assertEquals("hbbTvObjectPlayState", playState);
        }, config);
    };

    /**
     * Helper functions to mock out and use HBBTV specific APIs
     */

    this.hbbtvSource.prototype.stubHBBTVSpecificApis = function() {
        this.hbbtvPlugin = document.createElement('object');
        var hbbtvPlugin = this.hbbtvPlugin;
        hbbtvPlugin.id = "broadcastVideoObject";
        hbbtvPlugin.bindToCurrentChannel = function() {
        };
        hbbtvPlugin.stop = function() {
        };
        hbbtvPlugin.playState = "hbbTvObjectPlayState";
        hbbtvPlugin.currentChannel = { name : "BBC One"};

        var target = document.getElementsByTagName('body')[0];
        target.appendChild(hbbtvPlugin);
    };

    this.hbbtvSource.prototype.removeHBBTVSpecificApis = function() {
        var hbbtvPlugin = document.getElementById('broadcastVideoObject');
        if (hbbtvPlugin) { // some tests remove this object before the tear down
            hbbtvPlugin.parentNode.removeChild(hbbtvPlugin);
        }
    };

    this.hbbtvSource.prototype.getGenericHBBTVConfig = function() {
        return {"modules":{"base":"antie/devices/browserdevice","modifiers":[
            "antie/devices/anim/styletopleft",
            "antie/devices/media/html5",
            "antie/devices/net/default",
            "antie/devices/broadcastsource/hbbtvsource",
            "antie/devices/data/nativejson",
            "antie/devices/storage/cookie",
            "antie/devices/logging/default",
            "antie/devices/exit/closewindow"
        ]},"input":{"map":{}},"layouts":[
            {"width":1280,"height":720,"module":"fixtures/layouts/default","classes":["browserdevice720p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};
    };

})();