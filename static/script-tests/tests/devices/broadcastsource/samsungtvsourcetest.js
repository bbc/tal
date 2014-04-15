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
        this.originalWebapis = webapis;
        // Mock the Samsung APIs and tune to BBC One
        this.stubSamsungBroadcastSpecificApis();
    };

    this.SamsungTvSource.prototype.tearDown = function() {
        this.removeSamsungBroadcastSpecificApis();
        this.sandbox.restore();
        webapis = this.originalWebapis;

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

    this.SamsungTvSource.prototype.testCreateBroadcastSourceReturnsSingletonSamsungSourceObject = function(queue) {
        expectAsserts(1);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/samsungtvsource"], function(application, SamsungTVSource) {
            var device = application.getDevice();

            var samsungConstructor = this.sandbox.spy(SamsungTVSource.prototype, "init");

            device.createBroadcastSource();
            device.createBroadcastSource();
            device.createBroadcastSource();

            assertTrue('BroadcastSource should be an object', samsungConstructor.calledOnce);

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

    this.SamsungTvSource.prototype.testDestroyResetsTheScreenSettings = function(queue) {
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

    this.SamsungTvSource.prototype.testGetCurrentChannelReturnsFalseOnException = function(queue) {
        expectAsserts(1);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            this.sandbox.stub(webapis.tv.channel, "getCurrentChannel").throws("Error!");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            assertFalse(broadcastSource.getCurrentChannel());

        }, config);
    };

    this.SamsungTvSource.prototype.testGetCurrentChannelReturnsCurrentChannelFromWebAPI = function(queue) {
        expectAsserts(11);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/channel'], function(application, Channel) {

            var apiResult = {
                "channelName": "Alpha",
                "originalNetworkID": 9876,
                "transportStreamID": 8765,
                "programNumber": 7654,
                "ptc": 6543,
                "major": 5432,
                "minor": 4321,
                "sourceID": 3210
            };

            this.sandbox.stub(webapis.tv.channel, "getCurrentChannel").returns(apiResult);
            var channelConstructorSpy = this.sandbox.spy(Channel.prototype, "init");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var result = broadcastSource.getCurrentChannel();

            assert(channelConstructorSpy.calledOnce);
            assertSame(channelConstructorSpy.thisValues[0], result);
            assertEquals("Alpha", result.name);
            assertEquals(9876, result.onid);
            assertUndefined(result.type);
            assertEquals(8765, result.tsid);
            assertEquals(7654, result.sid);
            assertEquals(6543, result.ptc);
            assertEquals(5432, result.major);
            assertEquals(4321, result.minor);
            assertEquals(3210, result.sourceId);


        }, config);
    };

    this.SamsungTvSource.prototype.testGetChannelListCallsOnErrorWhenExceptionTrownFetchingChannelsFromWebAPI = function(queue) {
        expectAsserts(3);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            this.sandbox.stub(webapis.tv.channel, "getChannelList").throws("Not gonna happen!");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                "onSuccess": this.sandbox.stub(),
                "onError": this.sandbox.stub()
            };

            broadcastSource.getChannelList(params);

            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWith("Unable to retrieve channel list: Not gonna happen!"));

        }, config);
    };

    this.SamsungTvSource.prototype.testGetChannelListRequestsAllChannelsFromWebAPI = function(queue) {
        expectAsserts(4);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var stub = this.sandbox.stub(webapis.tv.channel, "getChannelList");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                "onSuccess": this.sandbox.stub(),
                "onError": this.sandbox.stub()
            };

            broadcastSource.getChannelList(params);

            assert(stub.calledOnce);
            assertSame(webapis.tv.channel.NAVIGATOR_MODE_ALL, stub.args[0][2]);
            assertEquals(0, stub.args[0][3]);
            assertEquals(1000000, stub.args[0][4]);

        }, config);
    };

    this.SamsungTvSource.prototype.testGetChannelListPassesOnErrorToWebAPI = function(queue) {
        expectAsserts(2);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var stub = this.sandbox.stub(webapis.tv.channel, "getChannelList");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                "onSuccess": this.sandbox.stub(),
                "onError": this.sandbox.stub()
            };

            broadcastSource.getChannelList(params);

            assert(stub.calledOnce);
            assertSame(params.onError, stub.args[0][1]);

        }, config);
    };


    this.SamsungTvSource.prototype.testGetChannelListSuccessCallbackPassedToWebAPIProvidesListOfChannelsToOnSuccess = function(queue) {
        expectAsserts(14);

        var config = this.getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/channel'], function(application, Channel) {

            var stub = this.sandbox.stub(webapis.tv.channel, "getChannelList");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                "onSuccess": this.sandbox.stub(),
                "onError": this.sandbox.stub()
            };

            broadcastSource.getChannelList(params);

            assert(stub.calledOnce);
            var successFunc = stub.args[0][0];

            var data = [
                {
                    "channelName": "Alpha",
                    "originalNetworkID": 9876,
                    "transportStreamID": 8765,
                    "programNumber": 7654,
                    "ptc": 6543,
                    "major": 5432,
                    "minor": 4321,
                    "sourceID": 3210
                }
            ];

            var channelConstructorSpy = this.sandbox.spy(Channel.prototype, "init");

            successFunc(data);

            assert(params.onSuccess.calledOnce);
            var channelList = params.onSuccess.args[0][0];

            assertEquals(1, channelList.length);

            assert(channelConstructorSpy.calledOnce);
            assertSame(channelConstructorSpy.thisValues[0], channelList[0]);
            assertEquals("Alpha", channelList[0].name);
            assertEquals(9876, channelList[0].onid);
            assertUndefined(channelList[0].type);
            assertEquals(8765, channelList[0].tsid);
            assertEquals(7654, channelList[0].sid);
            assertEquals(6543, channelList[0].ptc);
            assertEquals(5432, channelList[0].major);
            assertEquals(4321, channelList[0].minor);
            assertEquals(3210, channelList[0].sourceId);

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

        webapis = {
            "tv": {
                "channel": {
                    "getCurrentChannel": function () { },
                    "getChannelList": function () { },
                    NAVIGATOR_MODE_ALL : { }
                }
            }
        };
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

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/broadcastsource/samsungtvsource'], this.StyleTopLeftAnimationTest);

})();