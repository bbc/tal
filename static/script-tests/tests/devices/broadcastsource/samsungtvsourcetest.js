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
    this.SamsungTvSource = AsyncTestCase("Samsung Broadcast Source");

    this.SamsungTvSource.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
        // Mock the Samsung APIs and tune to BBC One
        this.stubSamsungBroadcastSpecificApis();
    };

    this.SamsungTvSource.prototype.tearDown = function() {
        this.removeSamsungBroadcastSpecificApis();
        this.sandbox.restore();
    };

    this.SamsungTvSource.prototype.testCreateBroadcastSourceReturnsSamsungSourceObject = function(queue) {
        expectAsserts(2);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/basetvsource"], function(application, BaseTvSource) {
            var device = application.getDevice();
            var returnedBroadcastSource = device.createBroadcastSource();

            assertEquals('BroadcastSource should be an object', 'object', typeof returnedBroadcastSource);
            assert('BrowserDevice should extend from Device', returnedBroadcastSource instanceof BaseTvSource);
            // also check that is it of type SamsungSource
        }, config);
    };

    this.SamsungTvSource.prototype.testCreateBroadcastWhenSamsungBroadcastApiIsNotAvailableThrowsException = function(queue) {
        expectAsserts(1);

        this.removeSamsungBroadcastSpecificApis();

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            assertException("Unable to initialise Samsung broadcast source", function() {
                device.createBroadcastSource();
            });
        }, config);
    };

    this.SamsungTvSource.prototype.testCreateBroadcastSourceSetsTheBroadcastToFullScreenAt720p = function(queue) {
        expectAsserts(5);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var samsungApiSpy = this.sandbox.spy(this.samsungPlugin, "SetScreenRect");

            var device = application.getDevice();

            // Stub getBestFitLayout as unsure of the actual browser size when running in headless environment
            this.sandbox.stub(application, "getLayout", function() {
                return {
                    requiredScreenSize: { height: 720, width: 1280 }
                };
            });

            device.createBroadcastSource();
            assertTrue("Native Samsung setsource function called", samsungApiSpy.called);
            assertEquals(0, samsungApiSpy.args[0][0]);
            assertEquals(0, samsungApiSpy.args[0][1]);
            assertEquals(1280, samsungApiSpy.args[0][2]);
            assertEquals(720, samsungApiSpy.args[0][3]);
        }, config);
    };

    this.SamsungTvSource.prototype.testCreateBroadcastSourceSetsTheBroadcastToFullScreenAt1080p = function(queue) {
        expectAsserts(5);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var samsungApiSpy = this.sandbox.spy(this.samsungPlugin, "SetScreenRect");

            var device = application.getDevice();

            // Stub getBestFitLayout as unsure of the browser size when running headless
            this.sandbox.stub(application, "getLayout", function() {
                return {
                    requiredScreenSize: { height: 1080, width: 1920 }
                };
            });

            device.createBroadcastSource();
            assertTrue("Native Samsung setsource function called", samsungApiSpy.called);
            assertEquals(0, samsungApiSpy.args[0][0]);
            assertEquals(0, samsungApiSpy.args[0][1]);
            assertEquals(1920, samsungApiSpy.args[0][2]);
            assertEquals(1080, samsungApiSpy.args[0][3]);
        }, config);
    };

    this.SamsungTvSource.prototype.testSetPositionWithOffsetSetsTheCorrectCSSProperties = function(queue) {
        expectAsserts(5);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var samsungApiSpy = this.sandbox.spy(this.samsungPlugin, "SetScreenRect");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            broadcastSource.setPosition(10, 20, 30, 40);

            assertTrue("Native Samsung setsource function called", samsungApiSpy.called);
            assertEquals(20, samsungApiSpy.args[1][0]);
            assertEquals(10, samsungApiSpy.args[1][1]);
            assertEquals(30, samsungApiSpy.args[1][2]);
            assertEquals(40, samsungApiSpy.args[1][3]);
        }, config);
    };

    this.SamsungTvSource.prototype.testShowCurrentChannelCallsSamsungSetSourceWithCorrectSourceId = function(queue) {
        expectAsserts(2);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var samsungApiSpy = this.sandbox.spy(this.samsungPlugin, "SetSource");
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.showCurrentChannel();
            assertTrue("Native Samsung setsource function called", samsungApiSpy.called);
            assertEquals(0, samsungApiSpy.args[0][0]);
        }, config);
    };

    this.SamsungTvSource.prototype.testStopCurrentChannelCallsSamsungSetSourceWithCorrectSourceId = function(queue) {
        expectAsserts(2);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var samsungApiSpy = this.sandbox.spy(this.samsungPlugin, "SetSource");
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.stopCurrentChannel();
            assertTrue("Native Samsung setsource function called with first argument as 43", samsungApiSpy.called);
            assertEquals(43, samsungApiSpy.args[0][0]);
        }, config);
    };

    this.SamsungTvSource.prototype.testgetCurrentChannelNameGetsTheCurrentlyTunedChannel = function(queue) {
        expectAsserts(1);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            var channelName = broadcastSource.getCurrentChannelName();
            assertEquals('Channel name should be BBC One', 'BBC One', channelName);
        }, config);
    };

    this.SamsungTvSource.prototype.testgetCurrentChannelNameThrowsExceptionWhenSamsungBroadcastApiReturnsMinus1 = function(queue) {
        expectAsserts(1);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            this.samsungPlugin.GetCurrentChannel_Name = function() {
                return -1;
            };
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            assertException("Current channel name not available", function() {
                broadcastSource.getCurrentChannelName();
            });
        }, config);
    };

    this.SamsungTvSource.prototype.testDestroyResetsTheScreenSettings= function(queue) {
        expectAsserts(5);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var samsungApiSpy = this.sandbox.spy(this.samsungPlugin, "SetScreenRect");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.destroy();

            assertTrue("Native Samsung SetScreenRect function called ", samsungApiSpy.called);
            assertEquals(-1, samsungApiSpy.args[1][0]);
            assertEquals(0, samsungApiSpy.args[1][1]);
            assertEquals(0, samsungApiSpy.args[1][2]);
            assertEquals(0, samsungApiSpy.args[1][3]);
        }, config);
    };


    /**
     * Helper functions to mock out and use Samsung specific APIs
     */

    this.SamsungTvSource.prototype.stubSamsungBroadcastSpecificApis = function() {
        this.samsungPlugin = document.createElement('object');
        var samsungPlugin = this.samsungPlugin;
        samsungPlugin.id = "pluginObjectWindow";
        samsungPlugin.SetSource = function() {
        };
        samsungPlugin.GetCurrentChannel_Name = function() {
            return "BBC One";
        };
        samsungPlugin.SetScreenRect = function(left, top, width, height) {
        };

        var target = document.getElementsByTagName('body')[0];
        target.appendChild(samsungPlugin);
    };

    this.SamsungTvSource.prototype.removeSamsungBroadcastSpecificApis = function() {
        var samsungPlugin = document.getElementById('pluginObjectWindow');
        if (samsungPlugin) { // some tests remove this object before the tear down
            samsungPlugin.parentNode.removeChild(samsungPlugin);
        }
    };

    this.SamsungTvSource.prototype.getGenericSamsungBroadcastConfig = function() {
        // Set to HTML5 to get coverage
        return {"modules":{"base":"antie/devices/browserdevice","modifiers":[
            "antie/devices/anim/styletopleft",
            "antie/devices/media/html5",
            "antie/devices/net/default",
            "antie/devices/broadcastsource/samsungtvsource",
            "antie/devices/data/nativejson",
            "antie/devices/storage/cookie",
            "antie/devices/logging/default",
            "antie/devices/exit/closewindow"
        ]},"input":{"map":{}},"layouts":[
            {"width":1280,"height":720,"module":"fixtures/layouts/default","classes":["browserdevice720p"]}
        ],"deviceConfigurationKey":"devices-html5-1"};
    };

})();