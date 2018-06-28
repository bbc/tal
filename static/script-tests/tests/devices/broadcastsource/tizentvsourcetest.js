/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {
    this.tizentvSource = AsyncTestCase('Tizen Broadcast Source');

    var stubTizenTVSpecificApis = function () {
        window.tizen = {
            tvchannel: {
                getCurrentChannel: function () {
                    return {
                        channelName: 'BBC One'
                    };
                },
                getChannelList: function () {
                    return [
                        {channelName: 'BBC One'},
                        {channelName: 'BBC Two'},
                        {channelName: 'BBC Three'}
                    ];
                },
                addSignalStateChangeListener: function () {
                },
                removeSignalStateChangeListener: function () {
                },
                tune: function() {
                }
            },
            tvwindow: {
                show: function () {
                },
                hide: function () {
                }
            }
        };
    };

    var removeTizenTVSpecificApis = function () {
        window.tizen = null;
    };

    var getGenericTizenTVConfig = function () {
        return {
            modules: {base: 'antie/devices/browserdevice', modifiers: [
                'antie/devices/anim/styletopleft',
                'antie/devices/broadcastsource/tizentvsource',
                'antie/devices/data/nativejson',
                'antie/devices/storage/cookie',
                'antie/devices/logging/default',
                'antie/devices/exit/closewindow'
            ]}, input: {map: {}}, layouts: [
                {width: 1280, height: 720, module: 'fixtures/layouts/default', classes: ['browserdevice720p']}
            ], deviceConfigurationKey: 'devices-html5-1'};
    };

    this.tizentvSource.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
        stubTizenTVSpecificApis();
    };

    this.tizentvSource.prototype.tearDown = function () {
        removeTizenTVSpecificApis();
        this.sandbox.restore();
    };

    this.tizentvSource.prototype.testCreateBroadcastSourceReturnsTizenTVObject = function (queue) {
        expectAsserts(2);

        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/basetvsource'], function (application, BaseTvSource) {
            var device = application.getDevice();
            var returnedBroadcastSource = device.createBroadcastSource();

            assertEquals('BroadcastSource should be an object', 'object', typeof returnedBroadcastSource);
            assert('BrowserDevice should extend from Device', returnedBroadcastSource instanceof BaseTvSource);
            // also check that is it of type tizentvSource
        }, config);
    };

    this.tizentvSource.prototype.testCreateBroadcastSourceReturnsSingletonTizenTVObject = function (queue) {
        expectAsserts(1);

        var config = getGenericTizenTVConfig();
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/tizentvsource'], function (application, TizenTVSource) {
            var device = application.getDevice();

            var tizenTVConstructor = self.sandbox.spy(TizenTVSource.prototype, 'init');

            device.createBroadcastSource();
            device.createBroadcastSource();
            device.createBroadcastSource();

            assertTrue('BroadcastSource should be an object', tizenTVConstructor.calledOnce);

        }, config);
    };

    this.tizentvSource.prototype.testCreateBroadcastWhenTizenApiIsNotAvailableThrowsException = function (queue) {
        expectAsserts(1);

        removeTizenTVSpecificApis();

        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            var device = application.getDevice();
            assertException('Unable to initialize Tizen broadcast object', function () {
                device.createBroadcastSource();
            });
        }, config);
    };

    this.tizentvSource.prototype.testSetPositionWithOffsetSetsTheCorrectProperties = function (queue) {
        expectAsserts(5);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var tizenApiSpy = self.sandbox.spy(tizen.tvwindow, 'show');
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            broadcastSource.setPosition(10, 20, 30, 40);

            assertTrue('Native Tizen show function called', tizenApiSpy.called);
            assertEquals(20, tizenApiSpy.args[0][2][0]);
            assertEquals(10, tizenApiSpy.args[0][2][1]);
            assertEquals(30, tizenApiSpy.args[0][2][2]);
            assertEquals(40, tizenApiSpy.args[0][2][3]);
        }, config);
    };

    this.tizentvSource.prototype.testShowCurrentChannelCallsTVWindowShowWithCorrectArguments = function (queue) {
        expectAsserts(7);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var tizenApiSpy = self.sandbox.spy(tizen.tvwindow, 'show');
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            self.sandbox.stub(window, 'screen', { height: 1080, width: 1920 });

            broadcastSource.showCurrentChannel();

            assertTrue('Native Tizen show function called', tizenApiSpy.called);
            assertEquals(0, tizenApiSpy.args[0][2][0]);
            assertEquals(0, tizenApiSpy.args[0][2][1]);
            assertEquals(1920, tizenApiSpy.args[0][2][2]);
            assertEquals(1080, tizenApiSpy.args[0][2][3]);
            assertEquals('MAIN', tizenApiSpy.args[0][3]);
            assertEquals('BEHIND', tizenApiSpy.args[0][4]);
        }, config);
    };

    this.tizentvSource.prototype.testStopCurrentChannelCallsTVWindowHide = function (queue) {
        expectAsserts(1);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var tizenApiSpy = self.sandbox.spy(tizen.tvwindow, 'hide');
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            broadcastSource.stopCurrentChannel();

            assertTrue('Native Tizen hide function called', tizenApiSpy.called);
        }, config);
    };

    this.tizentvSource.prototype.testStopCurrentChannelBroadcastTunerStoppedEventToApplication = function (queue) {
        expectAsserts(3);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/tunerstoppedevent'], function(application, TunerStoppedEvent) {
            var broadcastEventSpy = self.sandbox.spy(application, 'broadcastEvent');
            var hideFunctionSpy = self.sandbox.spy(tizen.tvwindow, 'hide');
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            broadcastSource.stopCurrentChannel();
            var callback = hideFunctionSpy.args[0][0];
            assertFunction(callback);
            callback();

            assert(broadcastEventSpy.calledOnce);
            assertInstanceOf(TunerStoppedEvent, broadcastEventSpy.args[0][0]);
        }, config);
    };

    this.tizentvSource.prototype.testGetCurrentChannelNameGetsTheCurrentlyTunedChannel = function (queue) {
        expectAsserts(1);

        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            var channelName = broadcastSource.getCurrentChannelName();
            assertEquals('Channel name should be BBC One', 'BBC One', channelName);
        }, config);
    };

    this.tizentvSource.prototype.testDestroyHidesTheBroadcastAndRemovesListener = function (queue) {
        expectAsserts(2);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            var TVWindowHideSpy = self.sandbox.spy(tizen.tvwindow, 'hide');
            var RemoveListenerSpy = self.sandbox.spy(tizen.tvchannel, 'removeSignalStateChangeListener');
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            self.sandbox.stub(broadcastSource, 'signalStateChangeListenerId', 0);

            broadcastSource.destroy();

            assertTrue('Native Tizen removeSignalStateChangeListener called', RemoveListenerSpy.called);
            assertTrue('Native Tizen hide function called', TVWindowHideSpy.called);
        }, config);
    };

    this.tizentvSource.prototype.testDestroyHidesTheBroadcastAndWhenListenerNotExist = function (queue) {
        expectAsserts(2);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            var TVWindowHideSpy = self.sandbox.spy(tizen.tvwindow, 'hide');
            var RemoveListenerSpy = self.sandbox.spy(tizen.tvchannel, 'removeSignalStateChangeListener');
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            self.sandbox.stub(broadcastSource, 'signalStateChangeListenerId', -1);

            broadcastSource.destroy();

            assertFalse('Native Tizen removeSignalStateChangeListener not called', RemoveListenerSpy.called);
            assertTrue('Native Tizen hide function called', TVWindowHideSpy.called);
        }, config);
    };

    this.tizentvSource.prototype.testGetChannelNameListRequestsChannelsFromTizenWebAPI = function (queue) {
        expectAsserts(2);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            var channelListStub = self.sandbox.stub(tizen.tvchannel, 'getChannelList');

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.getChannelNameList(params);

            assert(channelListStub.calledOnce);
            assertEquals('ALL', channelListStub.args[0][2]);
        }, config);
    };

    this.tizentvSource.prototype.testGetChannelNameListCallsOnErrorWhenTizenWebAPIErrors = function (queue) {
        expectAsserts(6);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            var channelListStub = self.sandbox.stub(tizen.tvchannel, 'getChannelList');

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.getChannelNameList(params);

            assert(channelListStub.calledOnce);
            assertEquals('ALL', channelListStub.args[0][2]);

            var errorFunc = channelListStub.args[0][1];
            assertFunction(errorFunc);

            errorFunc();

            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWith({
                name : 'ChannelListError',
                message : 'Channel list is not available'
            }));
        }, config);
    };

    this.tizentvSource.prototype.testGetChannelNameListSuccessCallbackPassedToTizenWebAPIProvidesListOfChannelsToOnSuccess = function (queue) {
        expectAsserts(6);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            var channelListStub = self.sandbox.stub(tizen.tvchannel, 'getChannelList');

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.getChannelNameList(params);

            assert(channelListStub.calledOnce);
            assertEquals('ALL', channelListStub.args[0][2]);

            var successFunc = channelListStub.args[0][0];

            var data = [
                {
                    channelName: 'Alpha'
                }
            ];

            assertFunction(successFunc);
            successFunc(data);
            assert(params.onSuccess.calledOnce);

            var channelList = params.onSuccess.args[0][0];
            assertEquals(1, channelList.length);
            assertEquals('Alpha', channelList[0]);
        }, config);
    };

    this.tizentvSource.prototype.testSetChannelByNameShowsChannelIfChangingToCurrentChannel = function (queue) {
        expectAsserts(1);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            var tizenApiSpy = self.sandbox.spy(tizen.tvwindow, 'show');

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: 'BBC One',
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assertTrue('Native Tizen show function called', tizenApiSpy.called);
        }, config);
    };

    this.tizentvSource.prototype.testSetChannelByNameCallsOnSuccessIfChangingToCurrentChannel = function (queue) {
        expectAsserts(3);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            
            var tizenApiSpyShow = self.sandbox.spy(tizen.tvwindow, 'show');
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: 'BBC One',
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };            
            
            broadcastSource.setChannelByName(params);   
            tizenApiSpyShow.args[0][0]();

            assert(params.onSuccess.calledOnce);     
            assert(params.onError.notCalled);
            assertTrue('Native Tizen show function called', tizenApiSpyShow.calledOnce);
        }, config);
    };

    this.tizentvSource.prototype.testSetChannelByNameDoesNotRetrieveChannelListWhenChangingToCurrentChannel = function (queue) {
        expectAsserts(1);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            var tizenApiSpy = self.sandbox.spy(tizen.tvchannel, 'getChannelList');

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: 'BBC One',
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(tizenApiSpy.notCalled);
        }, config);
    };

    this.tizentvSource.prototype.testSetChannelByNameRetrievesChannelListWhenChangingToDifferentChannel = function (queue) {
        expectAsserts(2);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            var tizenApiSpy = self.sandbox.spy(tizen.tvchannel, 'getChannelList');
            var tizenApiSpyShow = self.sandbox.spy(tizen.tvwindow, 'show');

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: 'BBC Two',
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);
            tizenApiSpyShow.args[0][0]();

            assert(tizenApiSpy.calledOnce);
            assertTrue('Native Tizen show function called', tizenApiSpyShow.calledOnce);
        }, config);
    };

    this.tizentvSource.prototype.testSetChannelByNameCallsOnErrorWhenFailingToRetrieveChannelList = function (queue) {
        expectAsserts(3);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            self.sandbox.stub(tizen.tvchannel, 'getChannelList').throwsException('Incorrect!');
            var tizenApiSpyShow = self.sandbox.spy(tizen.tvwindow, 'show');

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: 'BBC Two',
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);
            tizenApiSpyShow.args[0][0]();

            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assertTrue('Native Tizen show function called', tizenApiSpyShow.calledOnce);
        }, config);
    };

    this.tizentvSource.prototype.testSetChannelByNameCallsOnErrorWhenChannelNotInChannelList = function (queue) {
        expectAsserts(5);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            var tizenApiSpy = self.sandbox.spy(tizen.tvchannel, 'getChannelList');
            var tizenApiSpyShow = self.sandbox.spy(tizen.tvwindow, 'show');

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: 'BBC Two',
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);            
            tizenApiSpyShow.args[0][0]();
            
            assert(tizenApiSpy.calledOnce);
            assertTrue('Native Tizen show function called', tizenApiSpyShow.calledOnce);

            var getChannelListSuccesFunc = tizenApiSpy.args[0][0];

            getChannelListSuccesFunc(
                [
                    {
                        channelName: 'Alpha'
                    }
                ]);

            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWith({
                name : 'ChannelError',
                message : 'Channel could not be found'
            }));

        }, config);
    };

    this.tizentvSource.prototype.testSetChannelByNameAttemptsToTuneToChannelInChannelList = function (queue) {
        expectAsserts(9);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            var tizenApiSpyShow = self.sandbox.spy(tizen.tvwindow, 'show');
            var getChannelListStub = self.sandbox.spy(tizen.tvchannel, 'getChannelList');
            var tuneSpy = self.sandbox.spy(tizen.tvchannel, 'tune');
            
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: 'Alpha',
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };
            
            broadcastSource.setChannelByName(params);               
            tizenApiSpyShow.args[0][0](); 
            
            assert(getChannelListStub.calledOnce);
            assertTrue('Native Tizen show function called', tizenApiSpyShow.calledOnce);

            var getChannelListSuccessFunc = getChannelListStub.args[0][0];
           
            getChannelListSuccessFunc(
                [
                    {
                        channelName: 'Alpha',
                        lcn: 1,
                        major: 1,
                        minor: 65534,
                        originalNetworkID: 8808,
                        programNumber: 1,
                        ptc: 9440,
                        serviceName: 'Alpha',
                        sourceID: 0,
                        transportStreamID: 3
                    }
                ]);

            assert(tuneSpy.calledOnce);

            var expectedTuneChannelObj = {
                channelName: 'Alpha',
                lcn: 1,
                major: 1,
                minor: 65534,
                originalNetworkID: 8808,
                programNumber: 1,
                ptc: 9440,
                serviceName: 'Alpha',
                sourceID: 0,
                transportStreamID: 3
            };
            
            assertEquals(expectedTuneChannelObj, tuneSpy.args[0][0]);
            assertObject(tuneSpy.args[0][1]);
            assertFunction(tuneSpy.args[0][1].onsuccess);
            assertFunction(tuneSpy.args[0][1].onnosignal);
            assertFunction(tuneSpy.args[0][1].onprograminforeceived);
            assertFunction(tuneSpy.args[0][2]);
        }, config);
    };

    this.tizentvSource.prototype.testSetChannelByNameCallsOnErrorIfTuneThrowsException = function (queue) {
        expectAsserts(6);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            var getChannelListStub = self.sandbox.spy(tizen.tvchannel, 'getChannelList');
            var tuneStub = self.sandbox.stub(tizen.tvchannel, 'tune').throwsException('Incorrect!');
            var tizenApiSpyShow = self.sandbox.spy(tizen.tvwindow, 'show');

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: 'Alpha',
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);          
            tizenApiSpyShow.args[0][0]();
            
            assert(getChannelListStub.calledOnce);
            assertTrue('Native Tizen show function called', tizenApiSpyShow.calledOnce);

            var getChannelListSuccessFunc = getChannelListStub.args[0][0];

            getChannelListSuccessFunc(
                [
                    {
                        channelName: 'Alpha',
                        lcn: 1,
                        major: 1,
                        minor: 65534,
                        originalNetworkID: 8808,
                        programNumber: 1,
                        ptc: 9440,
                        serviceName: 'Alpha',
                        sourceID: 0,
                        transportStreamID: 3
                    }
                ]);

            assert(tuneStub.calledOnce);
            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWithMatch({
                name : 'ChangeChannelError'
            }));

        }, config);
    };

    this.tizentvSource.prototype.testSetChannelByNameCallsOnErrorIfTuneErrors = function (queue) {
        expectAsserts(6);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            var getChannelListStub = self.sandbox.spy(tizen.tvchannel, 'getChannelList');
            var tuneSpy = self.sandbox.spy(tizen.tvchannel, 'tune');
            var tizenApiSpyShow = self.sandbox.spy(tizen.tvwindow, 'show');

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: 'Alpha',
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);
            tizenApiSpyShow.args[0][0]();
            
            assert(getChannelListStub.calledOnce);
            assertTrue('Native Tizen show function called', tizenApiSpyShow.calledOnce);

            var getChannelListSuccessFunc = getChannelListStub.args[0][0];

            getChannelListSuccessFunc(
                [
                    {
                        channelName: 'Alpha',
                        lcn: 1,
                        major: 1,
                        minor: 65534,
                        originalNetworkID: 8808,
                        programNumber: 1,
                        ptc: 9440,
                        serviceName: 'Alpha',
                        sourceID: 0,
                        transportStreamID: 3
                    }
                ]);

            assert(tuneSpy.calledOnce);

            var tuneErrorFunc = tuneSpy.args[0][2];
            tuneErrorFunc({message: 'Incorrect!'});

            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWith({
                name : 'ChangeChannelError',
                message : 'Error tuning channel'
            }));

        }, config);
    };

    this.tizentvSource.prototype.testSetChannelByNameCallsOnSuccessIfTuneSucceeds = function (queue) {
        expectAsserts(5);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function (application) {
            var getChannelListStub = self.sandbox.spy(tizen.tvchannel, 'getChannelList');
            var tuneSpy = self.sandbox.spy(tizen.tvchannel, 'tune');
            var tizenApiSpyShow = self.sandbox.spy(tizen.tvwindow, 'show');

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: 'Alpha',
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);
            tizenApiSpyShow.args[0][0]();
            
            assert(getChannelListStub.calledOnce);
            assertTrue('Native Tizen show function called', tizenApiSpyShow.calledOnce);

            var getChannelListSuccessFunc = getChannelListStub.args[0][0];

            getChannelListSuccessFunc(
                [
                    {
                        channelName: 'Alpha',
                        lcn: 1,
                        major: 1,
                        minor: 65534,
                        originalNetworkID: 8808,
                        programNumber: 1,
                        ptc: 9440,
                        serviceName: 'Alpha',
                        sourceID: 0,
                        transportStreamID: 3
                    }
                ]);

            assert(tuneSpy.calledOnce);

            var tuneSuccessFunc = tuneSpy.args[0][1].onsuccess;
            tuneSuccessFunc();

            assert(params.onSuccess.calledOnce);
            assert(params.onError.notCalled);

        }, config);
    };

    this.tizentvSource.prototype.testBroadcastEventsAreSetDuringConstructionOfBroadcastSource = function(queue) {
        expectAsserts(2);

        var config = getGenericTizenTVConfig();
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var addSignalStateChangeListenerSpy = self.sandbox.spy(tizen.tvchannel, 'addSignalStateChangeListener');

            var device = application.getDevice();
            device.createBroadcastSource();

            assert(addSignalStateChangeListenerSpy.calledOnce);

            var listener = addSignalStateChangeListenerSpy.args[0][0];
            assertFunction(listener);

        }, config);
    };

    this.tizentvSource.prototype.testFollowingCreationOfBroadcastSourceBroadcastTunerUnavailableEventsAreBroadcastToApplication = function(queue) {
        expectAsserts(3);

        var config = getGenericTizenTVConfig();
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/tunerunavailableevent'], function(application, TunerUnavailableEvent) {

            var broadcastEventSpy = self.sandbox.spy(application, 'broadcastEvent');
            var addSignalStateChangeListenerSpy = self.sandbox.spy(tizen.tvchannel, 'addSignalStateChangeListener');

            var device = application.getDevice();
            device.createBroadcastSource();

            var listener = addSignalStateChangeListenerSpy.args[0][0];
            assertFunction(listener);
            listener('SIGNAL_STATE_NO_SIGNAL');

            assert(broadcastEventSpy.calledOnce);
            assertInstanceOf(TunerUnavailableEvent, broadcastEventSpy.args[0][0]);

        }, config);
    };

    this.tizentvSource.prototype.testFollowingCreationOfBroadcastSourceBroadcastTunerPresentingEventsAreBroadcastToApplication = function(queue) {
        expectAsserts(5);

        var config = getGenericTizenTVConfig();
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/tunerpresentingevent', 'antie/devices/broadcastsource/basetvsource'], function(application, TunerPresentingEvent, BaseTvSource) {

            var broadcastEventSpy = self.sandbox.spy(application, 'broadcastEvent');
            var addSignalStateChangeListenerSpy = self.sandbox.spy(tizen.tvchannel, 'addSignalStateChangeListener');

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var listener = addSignalStateChangeListenerSpy.args[0][0];
            assertFunction(listener);

            listener('SIGNAL_STATE_OK');
            assert(broadcastEventSpy.calledOnce);

            var event = broadcastEventSpy.args[0][0];
            assertInstanceOf(TunerPresentingEvent, event);
            assertEquals('BBC One', event.channel);
            assertEquals(BaseTvSource.STATE.PRESENTING, broadcastSource.getState());

        }, config);
    };

})();
