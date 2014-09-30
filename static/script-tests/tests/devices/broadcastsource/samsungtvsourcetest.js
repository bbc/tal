/**
 * @preserve Copyright (c) 2013-2014 British Broadcasting Corporation
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

    // Incomplete list; see http://dev.naver.com/projects/hs2011diet/refer/20049/9409/DeviceAPI+Guide%5BV2.10%5D.pdf
    var PL_TV_EVENTS = {
        noSignal: 101,
        tuneSuccess: 103,
        sourceChanged: 114
    };

    this.SamsungTvSource = AsyncTestCase("Samsung Broadcast Source");

    /**
     * Helper functions to mock out and use Samsung specific APIs
     */

    var stubSamsungBroadcastSpecificApis = function(self) {
        self.samsungPluginWindow = document.createElement('object');
        var samsungPluginWindow = self.samsungPluginWindow;
        samsungPluginWindow.id = "pluginObjectWindow";
        samsungPluginWindow.SetSource = function() {
        };
        samsungPluginWindow.GetCurrentChannel_Name = function() {
            return "BBC One";
        };
        samsungPluginWindow.SetScreenRect = function(/* left, top, width, height */) {
        };

        var target = document.getElementsByTagName('body')[0];
        target.appendChild(samsungPluginWindow);

        window.webapis = {
            tv: {
                channel: {
                    getCurrentChannel: function () { return {channelName: samsungPluginWindow.GetCurrentChannel_Name()}; },
                    getChannelList: function () { },
                    NAVIGATOR_MODE_ALL : { },
                    tune: function () { }
                }
            }
        };

        self.samsungPluginTV = document.createElement('object');
        self.samsungPluginTV.id = 'pluginObjectTV';
        self.samsungPluginTV.SetEvent = function () { };
        target.appendChild(self.samsungPluginTV);
    };

    var removeSamsungBroadcastSpecificApis = function(self) {
        var samsungPlugin = document.getElementById('pluginObjectWindow');
        if (samsungPlugin) { // some tests remove this object before the tear down
            samsungPlugin.parentNode.removeChild(samsungPlugin);
        }
	if (self.samsungPluginTV && self.samsungPluginTV.parentNode) {
		self.samsungPluginTV.parentNode.removeChild(self.samsungPluginTV);
	}
    };

    var getGenericSamsungBroadcastConfig = function() {
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

    this.SamsungTvSource.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
        this.originalWebapis = window.webapis;
        // Mock the Samsung APIs and tune to BBC One
        stubSamsungBroadcastSpecificApis(this);
    };

    this.SamsungTvSource.prototype.tearDown = function() {
        removeSamsungBroadcastSpecificApis(this);
        this.sandbox.restore();
        window.webapis = this.originalWebapis;

    };

    this.SamsungTvSource.prototype.testCreateBroadcastSourceReturnsSamsungSourceObject = function(queue) {
        expectAsserts(2);

        var config = getGenericSamsungBroadcastConfig();
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

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/samsungtvsource"], function(application, SamsungTVSource) {
            var device = application.getDevice();

            var samsungConstructor = self.sandbox.spy(SamsungTVSource.prototype, "init");

            device.createBroadcastSource();
            device.createBroadcastSource();
            device.createBroadcastSource();

            assertTrue(samsungConstructor.calledOnce);

        }, config);
    };

    this.SamsungTvSource.prototype.testCreateBroadcastWhenSamsungBroadcastApiIsNotAvailableThrowsException = function(queue) {
        expectAsserts(1);

        removeSamsungBroadcastSpecificApis(this);

        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            assertException("Unable to initialise Samsung broadcast source", function() {
                device.createBroadcastSource();
            });
        }, config);
    };

    this.SamsungTvSource.prototype.testCreateBroadcastSourceSetsTheBroadcastToFullScreenAt720p = function(queue) {
        expectAsserts(5);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var samsungApiSpy = self.sandbox.spy(self.samsungPluginWindow, "SetScreenRect");

            var device = application.getDevice();

            // Stub getBestFitLayout as unsure of the actual browser size when running in headless environment
            self.sandbox.stub(application, "getLayout", function() {
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

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var samsungApiSpy = self.sandbox.spy(self.samsungPluginWindow, "SetScreenRect");

            var device = application.getDevice();

            // Stub getBestFitLayout as unsure of the browser size when running headless
            self.sandbox.stub(application, "getLayout", function() {
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

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var samsungApiSpy = self.sandbox.spy(self.samsungPluginWindow, "SetScreenRect");

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

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var samsungApiSpy = self.sandbox.spy(self.samsungPluginWindow, "SetSource");
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.showCurrentChannel();
            assertTrue("Native Samsung setsource function called", samsungApiSpy.called);
            assertEquals(0, samsungApiSpy.args[0][0]);
        }, config);
    };

    this.SamsungTvSource.prototype.testStopCurrentChannelCallsSamsungSetSourceWithCorrectSourceId = function(queue) {
        expectAsserts(2);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var samsungApiSpy = self.sandbox.spy(self.samsungPluginWindow, "SetSource");
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.stopCurrentChannel();
            assertTrue("Native Samsung setsource function called with first argument as 43", samsungApiSpy.called);
            assertEquals(43, samsungApiSpy.args[0][0]);
        }, config);
    };

    this.SamsungTvSource.prototype.testgetCurrentChannelNameGetsTheCurrentlyTunedChannel = function(queue) {
        expectAsserts(1);

        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            var channelName = broadcastSource.getCurrentChannelName();
            assertEquals('Channel name should be BBC One', 'BBC One', channelName);
        }, config);
    };

    this.SamsungTvSource.prototype.testgetCurrentChannelNameThrowsExceptionWhenSamsungBroadcastApiReturnsMinus1 = function(queue) {
        expectAsserts(1);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            self.samsungPluginWindow.GetCurrentChannel_Name = function() {
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

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var samsungApiSpy = self.sandbox.spy(self.samsungPluginWindow, "SetScreenRect");

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

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            self.sandbox.stub(window.webapis.tv.channel, "getCurrentChannel").throwsException("Error!");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            assertFalse(broadcastSource.getCurrentChannel());

        }, config);
    };

    this.SamsungTvSource.prototype.testGetCurrentChannelReturnsCurrentChannelFromWebAPI = function(queue) {
        expectAsserts(10);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/channel'], function(application, Channel) {

            var apiResult = {
                channelName: "Alpha",
                originalNetworkID: 9876,
                transportStreamID: 8765,
                programNumber: 7654,
                ptc: 6543,
                major: 5432,
                minor: 4321,
                sourceID: 3210
            };

            self.sandbox.stub(window.webapis.tv.channel, "getCurrentChannel").returns(apiResult);

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var result = broadcastSource.getCurrentChannel();

            assertInstanceOf(Channel, result);
            assertEquals("Alpha", result.name);
            assertEquals(9876, result.onid);
            assertUndefined(result.idType);
            assertEquals(8765, result.tsid);
            assertEquals(7654, result.sid);
            assertEquals(6543, result.ptc);
            assertEquals(5432, result.major);
            assertEquals(4321, result.minor);
            assertEquals(3210, result.sourceId);


        }, config);
    };

    this.SamsungTvSource.prototype.testGetChannelListCallsOnErrorWhenExceptionThrownFetchingChannelsFromWebAPI = function(queue) {
        expectAsserts(3);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            self.sandbox.stub(window.webapis.tv.channel, "getChannelList").throwsException("Not gonna happen!");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.getChannelList(params);

            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWith({
                name : "ChannelListError",
                message : "Channel list is empty or not available"
            }));

        }, config);
    };

    this.SamsungTvSource.prototype.testGetChannelListRequestsAllChannelsFromWebAPI = function(queue) {
        expectAsserts(4);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var stub = self.sandbox.stub(window.webapis.tv.channel, "getChannelList");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.getChannelList(params);

            assert(stub.calledOnce);
            assertSame(window.webapis.tv.channel.NAVIGATOR_MODE_ALL, stub.args[0][2]);
            assertEquals(0, stub.args[0][3]);
            assertEquals(1000000, stub.args[0][4]);

        }, config);
    };

    this.SamsungTvSource.prototype.testGetChannelListCallsOnErrorWhenWebAPIErrors = function(queue) {
        expectAsserts(5);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var stub = self.sandbox.stub(window.webapis.tv.channel, "getChannelList");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.getChannelList(params);

            assert(stub.calledOnce);

            var errorFunc = stub.args[0][1];
            assertFunction(errorFunc);

            errorFunc();

            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWith({
                name : "ChannelListError",
                message : "Channel list is not available"
            }));
        }, config);
    };


    this.SamsungTvSource.prototype.testGetChannelListSuccessCallbackPassedToWebAPIProvidesListOfChannelsToOnSuccess = function(queue) {
        expectAsserts(13);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/channel'], function(application, Channel) {

            var stub = self.sandbox.stub(window.webapis.tv.channel, "getChannelList");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.getChannelList(params);

            assert(stub.calledOnce);
            var successFunc = stub.args[0][0];

            var data = [
                {
                    channelName: "Alpha",
                    originalNetworkID: 9876,
                    transportStreamID: 8765,
                    programNumber: 7654,
                    ptc: 6543,
                    major: 5432,
                    minor: 4321,
                    sourceID: 3210
                }
            ];

            successFunc(data);

            assert(params.onSuccess.calledOnce);
            var channelList = params.onSuccess.args[0][0];

            assertEquals(1, channelList.length);

            assertInstanceOf(Channel, channelList[0]);

            assertEquals("Alpha", channelList[0].name);
            assertEquals(9876, channelList[0].onid);
            assertUndefined(channelList[0].idType);
            assertEquals(8765, channelList[0].tsid);
            assertEquals(7654, channelList[0].sid);
            assertEquals(6543, channelList[0].ptc);
            assertEquals(5432, channelList[0].major);
            assertEquals(4321, channelList[0].minor);
            assertEquals(3210, channelList[0].sourceId);

        }, config);
    };

    this.SamsungTvSource.prototype.testSetChannelByNameShowsChannelIfChangingToCurrentChannel = function(queue) {
        expectAsserts(2);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var stub = self.sandbox.stub(self.samsungPluginWindow, "SetSource");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC One",
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(stub.calledOnce);
            assert(stub.calledWith(0)); // PL_WINDOW_SOURCE_TV (TV Source) - http://www.samsungdforum.com/Guide/ref00014/PL_WINDOW_SOURCE.html

        }, config);
    };

    this.SamsungTvSource.prototype.testSetChannelByNameCallsOnSuccessIfChangingToCurrentChannel = function(queue) {
        expectAsserts(2);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC One",
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(params.onSuccess.calledOnce);
            assert(params.onError.notCalled);

        }, config);
    };

    this.SamsungTvSource.prototype.testSetChannelByNameCallsOnErrorIfFailingToRetrieveCurrentChannelName = function(queue) {
        expectAsserts(3);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            self.sandbox.stub(window.webapis.tv.channel, "getCurrentChannel").throwsException("Error!");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC One",
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWith({
                name : "ChannelError",
                message: "Unable to determine current channel name"
            }));

        }, config);
    };

    this.SamsungTvSource.prototype.testSetChannelByNameDoesNotRetrieveChannelListWhenChangingToCurrentChannel = function(queue) {
        expectAsserts(1);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var stub = self.sandbox.stub(window.webapis.tv.channel, "getChannelList");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC One",
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(stub.notCalled);

        }, config);
    };

    this.SamsungTvSource.prototype.testSetChannelByNameRetrievesChannelListWhenChangingToDifferentChannel = function(queue) {
        expectAsserts(1);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var stub = self.sandbox.stub(window.webapis.tv.channel, "getChannelList");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC Two",
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(stub.calledOnce);

        }, config);
    };

    this.SamsungTvSource.prototype.testSetChannelByNameCallsOnErrorWhenFailingToRetrieveChannelList = function(queue) {
        expectAsserts(2);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            self.sandbox.stub(window.webapis.tv.channel, "getChannelList").throwsException("Incorrect!");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC Two",
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);

        }, config);
    };

    this.SamsungTvSource.prototype.testSetChannelByNameCallsOnErrorWhenChannelNotInChannelList = function(queue) {
        expectAsserts(4);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var getChannelListStub = self.sandbox.stub(window.webapis.tv.channel, "getChannelList");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC Two",
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(getChannelListStub.calledOnce);
            var getChannelListSuccessFunc = getChannelListStub.args[0][0];


            getChannelListSuccessFunc(
                [
                    {
                        channelName: "Alpha",
                        originalNetworkID: 9876,
                        transportStreamID: 8765,
                        programNumber: 7654,
                        ptc: 6543,
                        major: 5432,
                        minor: 4321,
                        sourceID: 3210
                    }
                ]);

            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWith({
                name : "ChannelError",
                message : "Channel could not be found"
            }));

        }, config);
    };

    this.SamsungTvSource.prototype.testSetChannelByNameAttemptsToTuneToChannelInChannelList = function(queue) {
        expectAsserts(6);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var getChannelListStub = self.sandbox.stub(window.webapis.tv.channel, "getChannelList");
            var tuneStub = self.sandbox.stub(window.webapis.tv.channel, "tune");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "Alpha",
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(getChannelListStub.calledOnce);
            var getChannelListSuccessFunc = getChannelListStub.args[0][0];


            getChannelListSuccessFunc(
                [
                    {
                        channelName: "Alpha",
                        originalNetworkID: 9876,
                        transportStreamID: 8765,
                        programNumber: 7654,
                        ptc: 6543,
                        major: 5432,
                        minor: 4321,
                        sourceID: 3210
                    }
                ]);

            assert(tuneStub.calledOnce);
            var expectedTuneMapleChannelObj = {
                originalNetworkID: 9876,
                transportStreamID: 8765,
                programNumber: 7654,
                ptc: 6543,
                major: 5432,
                minor: 4321,
                sourceID: 3210
            };
            assertEquals(expectedTuneMapleChannelObj, tuneStub.args[0][0]);
            assertFunction(tuneStub.args[0][1]);
            assertFunction(tuneStub.args[0][2]);
            assertEquals(0,tuneStub.args[0][3]); // Window ID - http://www.samsungdforum.com/Guide/ref00008/tvchannel/dtv_tvchannel_module.html

        }, config);
    };


    this.SamsungTvSource.prototype.testSetChannelByNameCallsOnErrorIfTuneThrowsException = function(queue) {
        expectAsserts(5);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var getChannelListStub = self.sandbox.stub(window.webapis.tv.channel, "getChannelList");
            var tuneStub = self.sandbox.stub(window.webapis.tv.channel, "tune").throwsException({message:"Nu-uh!"});

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "Alpha",
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(getChannelListStub.calledOnce);
            var getChannelListSuccessFunc = getChannelListStub.args[0][0];


            getChannelListSuccessFunc(
                [
                    {
                        channelName: "Alpha",
                        originalNetworkID: 9876,
                        transportStreamID: 8765,
                        programNumber: 7654,
                        ptc: 6543,
                        major: 5432,
                        minor: 4321,
                        sourceID: 3210
                    }
                ]);

            assert(tuneStub.calledOnce);
            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWith({
                name : "ChangeChannelError",
                message : "Error tuning channel"
            }));


        }, config);
    };

    this.SamsungTvSource.prototype.testSetChannelByNameCallsOnErrorIfTuneErrors = function(queue) {
        expectAsserts(5);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var getChannelListStub = self.sandbox.stub(window.webapis.tv.channel, "getChannelList");
            var tuneStub = self.sandbox.stub(window.webapis.tv.channel, "tune");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "Alpha",
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(getChannelListStub.calledOnce);
            var getChannelListSuccessFunc = getChannelListStub.args[0][0];


            getChannelListSuccessFunc(
                [
                    {
                        channelName: "Alpha",
                        originalNetworkID: 9876,
                        transportStreamID: 8765,
                        programNumber: 7654,
                        ptc: 6543,
                        major: 5432,
                        minor: 4321,
                        sourceID: 3210
                    }
                ]);

            assert(tuneStub.calledOnce);
            var tuneErrorFunc = tuneStub.args[0][2];

            tuneErrorFunc({message: "Nope!"});

            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWith({
                name : "ChangeChannelError",
                message : "Error tuning channel"
            }));

        }, config);
    };

    this.SamsungTvSource.prototype.testSetChannelByNameCallsOnSuccessIfTuneSucceeds = function(queue) {
        expectAsserts(4);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var getChannelListStub = self.sandbox.stub(window.webapis.tv.channel, "getChannelList");
            var tuneStub = self.sandbox.stub(window.webapis.tv.channel, "tune");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "Alpha",
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(getChannelListStub.calledOnce);
            var getChannelListSuccessFunc = getChannelListStub.args[0][0];


            getChannelListSuccessFunc(
                [
                    {
                        channelName: "Alpha",
                        originalNetworkID: 9876,
                        transportStreamID: 8765,
                        programNumber: 7654,
                        ptc: 6543,
                        major: 5432,
                        minor: 4321,
                        sourceID: 3210
                    }
                ]);

            assert(tuneStub.calledOnce);
            var tuneSuccessFunc = tuneStub.args[0][1];

            tuneSuccessFunc();

            assert(params.onSuccess.calledOnce);
            assert(params.onError.notCalled);

        }, config);
    };

    this.SamsungTvSource.prototype.testFollowingCreationOfBroadcastSourceBroadcastTunerUnavailableEventsAreBroadcastToApplication = function(queue) {
        expectAsserts(3);

        var config = getGenericSamsungBroadcastConfig();
	var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/tunerunavailableevent'], function(application, TunerUnavailableEvent) {

            var broadcastEventStub = self.sandbox.stub(application, 'broadcastEvent');

            var device = application.getDevice();
            device.createBroadcastSource();

            assertFunction(self.samsungPluginTV.OnEvent);

            self.samsungPluginTV.OnEvent(PL_TV_EVENTS.noSignal);

            assert(broadcastEventStub.calledOnce);
            assertInstanceOf(TunerUnavailableEvent, broadcastEventStub.args[0][0]);

        }, config);
    };

    this.SamsungTvSource.prototype.testFollowingCreationOfBroadcastSourceBroadcastTunerStoppedEventsAreBroadcastToApplication = function(queue) {
        expectAsserts(3);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/tunerstoppedevent'], function(application, TunerStoppedEvent) {

            var broadcastEventStub = self.sandbox.stub(application, 'broadcastEvent');

            var device = application.getDevice();
            device.createBroadcastSource();

            assertFunction(self.samsungPluginTV.OnEvent);

            self.samsungPluginTV.OnEvent(PL_TV_EVENTS.sourceChanged);

            assert(broadcastEventStub.calledOnce);
            assertInstanceOf(TunerStoppedEvent, broadcastEventStub.args[0][0]);

        }, config);
    };

    this.SamsungTvSource.prototype.testFollowingCreationOfBroadcastSourceBroadcastTunerPresentingEventsAreBroadcastToApplication = function(queue) {
        expectAsserts(13);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/tunerpresentingevent', 'antie/devices/broadcastsource/channel'], function(application, TunerPresentingEvent, Channel) {


            var apiResult = {
                channelName: "Alpha",
                originalNetworkID: 9876,
                transportStreamID: 8765,
                programNumber: 7654,
                ptc: 6543,
                major: 5432,
                minor: 4321,
                sourceID: 3210
            };

            self.sandbox.stub(window.webapis.tv.channel, "getCurrentChannel").returns(apiResult);
            var broadcastEventStub = self.sandbox.stub(application, 'broadcastEvent');

            var device = application.getDevice();
            device.createBroadcastSource();

            assertFunction(self.samsungPluginTV.OnEvent);

            self.samsungPluginTV.OnEvent(PL_TV_EVENTS.tuneSuccess);

            assert(broadcastEventStub.calledOnce);
            var event = broadcastEventStub.args[0][0];

            assertInstanceOf(TunerPresentingEvent, event);
            assertInstanceOf(Channel, event.channel);

            assertEquals("Alpha", event.channel.name);
            assertEquals(9876, event.channel.onid);
            assertUndefined(event.channel.idType);
            assertEquals(8765, event.channel.tsid);
            assertEquals(7654, event.channel.sid);
            assertEquals(6543, event.channel.ptc);
            assertEquals(5432, event.channel.major);
            assertEquals(4321, event.channel.minor);
            assertEquals(3210, event.channel.sourceId);

        }, config);
    };

    this.SamsungTvSource.prototype.testBroadcastEventsAreRequestedDuringConstructionOfBroadcastSource = function(queue) {
        expectAsserts(4);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {


            var setEventStub = self.sandbox.stub(self.samsungPluginTV,"SetEvent");

            var device = application.getDevice();
            device.createBroadcastSource();

            assert(setEventStub.calledThrice);
            assert(setEventStub.calledWith(PL_TV_EVENTS.noSignal));
            assert(setEventStub.calledWith(PL_TV_EVENTS.sourceChanged));
            assert(setEventStub.calledWith(PL_TV_EVENTS.tuneSuccess));
        }, config);
    };

    this.SamsungTvSource.prototype.testFollowingCreationOfBroadcastSourceBroadcastTunerUnavailableEventsAreBroadcastToApplicationWithStringID = function(queue) {
        expectAsserts(3);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/tunerunavailableevent'], function(application, TunerUnavailableEvent) {

            var broadcastEventStub = self.sandbox.stub(application, 'broadcastEvent');

            var device = application.getDevice();
            device.createBroadcastSource();

            assertFunction(self.samsungPluginTV.OnEvent);

            self.samsungPluginTV.OnEvent(PL_TV_EVENTS.noSignal.toString()); // String version of

            assert(broadcastEventStub.calledOnce);
            assertInstanceOf(TunerUnavailableEvent, broadcastEventStub.args[0][0]);

        }, config);
    };

    this.SamsungTvSource.prototype.testFollowingCreationOfBroadcastSourceBroadcastTunerStoppedEventsAreBroadcastToApplicationWithStringID = function(queue) {
        expectAsserts(3);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/tunerstoppedevent'], function(application, TunerStoppedEvent) {

            var broadcastEventStub = self.sandbox.stub(application, 'broadcastEvent');

            var device = application.getDevice();
            device.createBroadcastSource();

            assertFunction(self.samsungPluginTV.OnEvent);

            self.samsungPluginTV.OnEvent(PL_TV_EVENTS.sourceChanged.toString());

            assert(broadcastEventStub.calledOnce);
            assertInstanceOf(TunerStoppedEvent, broadcastEventStub.args[0][0]);

        }, config);
    };

    this.SamsungTvSource.prototype.testFollowingCreationOfBroadcastSourceBroadcastTunerPresentingEventsAreBroadcastToApplicationWithStringID = function(queue) {
        expectAsserts(13);

	var self = this;
        var config = getGenericSamsungBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/tunerpresentingevent', 'antie/devices/broadcastsource/channel'], function(application, TunerPresentingEvent, Channel) {


            var apiResult = {
                channelName: "Alpha",
                originalNetworkID: 9876,
                transportStreamID: 8765,
                programNumber: 7654,
                ptc: 6543,
                major: 5432,
                minor: 4321,
                sourceID: 3210
            };

            self.sandbox.stub(window.webapis.tv.channel, "getCurrentChannel").returns(apiResult);
            var broadcastEventStub = self.sandbox.stub(application, 'broadcastEvent');

            var device = application.getDevice();
            device.createBroadcastSource();

            assertFunction(self.samsungPluginTV.OnEvent);

            self.samsungPluginTV.OnEvent(PL_TV_EVENTS.tuneSuccess.toString());

            assert(broadcastEventStub.calledOnce);
            var event = broadcastEventStub.args[0][0];
            assertInstanceOf(TunerPresentingEvent, event);
            assertInstanceOf(Channel, event.channel);

            assertEquals("Alpha", event.channel.name);
            assertEquals(9876, event.channel.onid);
            assertUndefined(event.channel.idType);
            assertEquals(8765, event.channel.tsid);
            assertEquals(7654, event.channel.sid);
            assertEquals(6543, event.channel.ptc);
            assertEquals(5432, event.channel.major);
            assertEquals(4321, event.channel.minor);
            assertEquals(3210, event.channel.sourceId);

        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/broadcastsource/samsungtvsource'], this.StyleTopLeftAnimationTest);

})();
