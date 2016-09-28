/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.hbbtvSource = AsyncTestCase('HBBTV Broadcast Source');

    /*  Helper functions to mock out and use HBBTV specific APIs */

    var stubHBBTVSpecificApis = function(self) {
        self.hbbtvPlugin = document.createElement('object');
        var hbbtvPlugin = self.hbbtvPlugin;
        hbbtvPlugin.id = 'broadcastVideoObject';
        hbbtvPlugin.bindToCurrentChannel = function() {
        };
        hbbtvPlugin.stop = function() {
        };
        hbbtvPlugin.playState = 2;
        hbbtvPlugin.currentChannel = {
            name : 'BBC One',
            idType : 10 //DVB-C
        };
        hbbtvPlugin.createChannelObject = function() {
        };
        hbbtvPlugin.setChannel = function() {
        };
        var channelList = getRawChannelList();
        hbbtvPlugin.getChannelConfig = function() {
            return {
                channelList: channelList
            };
        };

        var target = document.getElementsByTagName('body')[0];
        target.appendChild(hbbtvPlugin);
    };

    var stubChannelListInHbbtvPluginAsItemAccessorOnly = function(self) {
        var channelList = getRawChannelList();
        self.hbbtvPlugin.getChannelConfig = function() {
            return {
                channelList: {
                    item: function(itemIndex) {
                        return channelList[itemIndex];
                    },
                    length: channelList.length
                }
            };
        };
    };

    var stubChannelListInHbbtvPluginAsArrayAndBrokenItemAccessor = function(self) {
        var channelList = getRawChannelList();
        channelList.item = 'trololo';

        self.hbbtvPlugin.getChannelConfig = function() {
            return {
                channelList: channelList
            };
        };
    };

    var getRawChannelList = function() {
        return [
            {
                name: 'BBC One'
            },
            {
                name: 'BBC Two'
            },
            {
                name: 'BBC Three'
            }
        ];
    };

    var removeHBBTVSpecificApis = function() {
        var hbbtvPlugin = document.getElementById('broadcastVideoObject');
        if (hbbtvPlugin) { // some tests remove this object before the tear down
            hbbtvPlugin.parentNode.removeChild(hbbtvPlugin);
        }
    };

    var getGenericHBBTVConfig = function() {
        return {modules:{base:'antie/devices/browserdevice',modifiers:[
            'antie/devices/anim/styletopleft',
            'antie/devices/broadcastsource/hbbtvsource',
            'antie/devices/data/nativejson',
            'antie/devices/storage/cookie',
            'antie/devices/logging/default',
            'antie/devices/exit/closewindow'
        ]},input:{map:{}},layouts:[
            {width:1280,height:720,module:'fixtures/layouts/default',classes:['browserdevice720p']}
        ],deviceConfigurationKey:'devices-html5-1'};
    };

    this.hbbtvSource.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
        // Mock the HBBTV APIs and tune to BBC One
        stubHBBTVSpecificApis(this);
    };

    this.hbbtvSource.prototype.tearDown = function() {
        removeHBBTVSpecificApis();
        this.sandbox.restore();
    };

    this.hbbtvSource.prototype.testCreateBroadcastSourceReturnsHBBTVObject = function(queue) {
        expectAsserts(2);

        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/basetvsource'], function(application, BaseTvSource) {
            var device = application.getDevice();
            var returnedBroadcastSource = device.createBroadcastSource();

            assertEquals('BroadcastSource should be an object', 'object', typeof returnedBroadcastSource);
            assert('BrowserDevice should extend from Device', returnedBroadcastSource instanceof BaseTvSource);
            // also check that is it of type HBBTVsource
        }, config);
    };


    this.hbbtvSource.prototype.testCreateBroadcastSourceReturnsSingletonHBBTVObject = function(queue) {
        expectAsserts(1);

        var config = getGenericHBBTVConfig();
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/hbbtvsource'], function(application, HbbTVSource) {
            var device = application.getDevice();

            var hbbtvConstructor = self.sandbox.spy(HbbTVSource.prototype, 'init');

            device.createBroadcastSource();
            device.createBroadcastSource();
            device.createBroadcastSource();

            assertTrue('BroadcastSource should be an object', hbbtvConstructor.calledOnce);

        }, config);
    };

    this.hbbtvSource.prototype.testCreateBroadcastWhenHbbTvApiIsNotAvailableThrowsException = function(queue) {
        expectAsserts(1);

        removeHBBTVSpecificApis();

        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            assertException('Unable to initialise HbbTV broadcast source', function() {
                device.createBroadcastSource();
            });
        }, config);
    };

    this.hbbtvSource.prototype.testCreateBroadcastSetsPlayStateToUnrealized = function(queue) {
        expectAsserts(1);

        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var device = application.getDevice();

            var broadcastSource = device.createBroadcastSource();

            assertEquals(0, broadcastSource.playState);

        }, config);
    };

    this.hbbtvSource.prototype.testCreateBroadcastAddsPlayStateChangeEventHandler = function(queue) {
        expectAsserts(2);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var addEventListenerStub = self.sandbox.stub(self.hbbtvPlugin, 'addEventListener');
            var device = application.getDevice();
            device.createBroadcastSource();

            assert(addEventListenerStub.calledWith('PlayStateChange'));
            assert(typeof addEventListenerStub.args[0][1] === 'function');

        }, config);
    };

    this.hbbtvSource.prototype.testPlayStateChangeEventChangesPlayState = function(queue) {

        expectAsserts(2);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var evt = new CustomEvent('PlayStateChange');

            self.hbbtvPlugin.playState = 1;
            self.hbbtvPlugin.dispatchEvent(evt);

            assertEquals(1, broadcastSource.playState);

            self.hbbtvPlugin.playState = 2;
            self.hbbtvPlugin.dispatchEvent(evt);

            assertEquals(2, broadcastSource.playState);

        }, config);
    };

    this.hbbtvSource.prototype.testTunerUnavailableEventBroadcastWhenPlayStateChangesFromPresentingToUnrealized = function(queue) {

        expectAsserts(1);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/tunerunavailableevent'], function(application, TunerUnavailableEvent) {

            var device = application.getDevice();
            device.createBroadcastSource();

            var evt = new CustomEvent('PlayStateChange');

            self.hbbtvPlugin.playState = 2;
            self.hbbtvPlugin.dispatchEvent(evt);

            var broadcastEventSpy = self.sandbox.spy(application, 'broadcastEvent');

            self.hbbtvPlugin.playState = 0;
            self.hbbtvPlugin.dispatchEvent(evt);

            assert(broadcastEventSpy.args[0][0] instanceof TunerUnavailableEvent);

        }, config);
    };

    this.hbbtvSource.prototype.testTunerPresentingEventBroadcastWhenPlayStateChangesToPresenting = function(queue) {

        expectAsserts(1);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/tunerpresentingevent'], function(application, TunerPresentingEvent) {

            var device = application.getDevice();
            device.createBroadcastSource();

            var evt = new CustomEvent('PlayStateChange');

            var broadcastEventSpy = self.sandbox.spy(application, 'broadcastEvent');

            self.hbbtvPlugin.playState = 2;
            self.hbbtvPlugin.dispatchEvent(evt);

            assert(broadcastEventSpy.args[0][0] instanceof TunerPresentingEvent);

        }, config);
    };

    this.hbbtvSource.prototype.testTunerPresentingEventConstructedWithCurrentChannelWhenPlayStateChangesToPresenting = function(queue) {

        expectAsserts(2);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var device = application.getDevice();
            device.createBroadcastSource();

            var evt = new CustomEvent('PlayStateChange');

            var broadcastEventSpy = self.sandbox.spy(application, 'broadcastEvent');

            self.hbbtvPlugin.playState = 2;
            self.hbbtvPlugin.dispatchEvent(evt);

            assert(broadcastEventSpy.calledOnce);
            var channelName = broadcastEventSpy.args[0][0].channel;

            assertEquals('BBC One', channelName);
        }, config);
    };

    this.hbbtvSource.prototype.testTunerPresentingEventBroadcastWhenPlayStateChangesToStopped = function(queue) {

        expectAsserts(1);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/events/tunerstoppedevent'], function(application, TunerStoppedEvent) {

            var device = application.getDevice();
            device.createBroadcastSource();

            var evt = new CustomEvent('PlayStateChange');

            var broadcastEventSpy = self.sandbox.spy(application, 'broadcastEvent');

            self.hbbtvPlugin.playState = 3;
            self.hbbtvPlugin.dispatchEvent(evt);

            assert(broadcastEventSpy.args[0][0] instanceof TunerStoppedEvent);

        }, config);
    };

    this.hbbtvSource.prototype.testIsBroadcastSourceSupportedWhenHistorianDoesNotHaveBroadcastOriginReturnsFalse = function(queue) {
        expectAsserts(1);

        var config = getGenericHBBTVConfig();
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/historian'], function(application, Historian) {
            var device = application.getDevice();

            self.sandbox.stub(Historian.prototype, 'hasBroadcastOrigin', function() {
                return false;
            });

            assertFalse(device.isBroadcastSourceSupported());
        }, config);
    };

    this.hbbtvSource.prototype.testIsBroadcastSourceSupportedWhenHistorianHasBroadcastOriginReturnsTrue = function(queue) {
        expectAsserts(1);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/historian'], function(application, Historian) {
            var device = application.getDevice();

            self.sandbox.stub(Historian.prototype, 'hasBroadcastOrigin', function() {
                return true;
            });

            assertTrue(device.isBroadcastSourceSupported());
        }, config);
    };


    this.hbbtvSource.prototype.testShowCurrentChannelSetsTheBroadcastToFullScreenAt720p = function(queue) {
        expectAsserts(2);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();

            // Mock getBestFitLayout as unsure of the actual browser size when running in headless environment
            self.sandbox.stub(application, 'getLayout', function() {
                return {
                    requiredScreenSize: { height: 720, width: 1280 }
                };
            });

            var broadcastSource = device.createBroadcastSource();
            broadcastSource.showCurrentChannel();
            assertEquals('BroadcastSource width should be 1280px', '1280px', self.hbbtvPlugin.style.width);
            assertEquals('BroadcastSource height should be 720px', '720px', self.hbbtvPlugin.style.height);
        }, config);
    };

    this.hbbtvSource.prototype.testShowCurrentChannelSetsTheBroadcastToFullScreenAt1080p = function(queue) {
        expectAsserts(2);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();

            // Mock getBestFitLayout as unsure of the browser size when running headless
            self.sandbox.stub(application, 'getLayout', function() {
                return {
                    requiredScreenSize: { height: 1080, width: 1920 }
                };
            });

            var broadcastSource = device.createBroadcastSource();
            broadcastSource.showCurrentChannel();
            assertEquals('BroadcastSource width should be 1920px', '1920px', self.hbbtvPlugin.style.width);
            assertEquals('BroadcastSource height should be 1080px', '1080px', self.hbbtvPlugin.style.height);
        }, config);
    };

    this.hbbtvSource.prototype.testSetPositionWithOffsetSetsTheCorrectCSSProperties = function(queue) {
        expectAsserts(4);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.setPosition(10, 20, 30, 40);

            assertEquals('BroadcastSource top position should be 10px', '10px', self.hbbtvPlugin.style.top);
            assertEquals('BroadcastSource left position should be 20px', '20px', self.hbbtvPlugin.style.left);
            assertEquals('BroadcastSource width should be 30px', '30px', self.hbbtvPlugin.style.width);
            assertEquals('BroadcastSource height should be 40px', '40px', self.hbbtvPlugin.style.height);
        }, config);
    };

    this.hbbtvSource.prototype.testShowCurrentChannelCallsHBBTVbindToCurrentChannel = function(queue) {
        expectAsserts(1);

        var config = getGenericHBBTVConfig();
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var hbbtvApiSpy = self.sandbox.spy(self.hbbtvPlugin, 'bindToCurrentChannel');
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.showCurrentChannel();
            assertTrue('Native HBBTV bindToCurrentChannel function called', hbbtvApiSpy.called);
        }, config);
    };

    this.hbbtvSource.prototype.testStopCurrentChannelCallsHBBTVStop = function(queue) {
        expectAsserts(1);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var hbbtvApiSpy = self.sandbox.spy(self.hbbtvPlugin, 'stop');
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.stopCurrentChannel();
            assertTrue('Native HBBTV stop function called', hbbtvApiSpy.called);
        }, config);
    };

    this.hbbtvSource.prototype.testStopCurrentChannelThrowsExceptionIfPlayStateIsUnrealizedAndBindToCurrentChannelThrowsException = function(queue) {
        expectAsserts(1);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            self.sandbox.stub(self.hbbtvPlugin, 'playState', broadcastSource._playStates.UNREALIZED);

            var hbbtvPlugin = document.getElementById('broadcastVideoObject');
            hbbtvPlugin.bindToCurrentChannel = function() {
                throw new Error('BindToCurrentChannel error');
            };

            assertException('Unable to bind to current channel', function() {
                broadcastSource.stopCurrentChannel();
            });
        }, config);
    };

    this.hbbtvSource.prototype.testStopCurrentChannelCallsBindWhenUnrealized = function(queue) {
        expectAsserts(1);
        var config;
        config = getGenericHBBTVConfig();
        var self = this;

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [],
            function(application) {
                var hbbtvBindSpy, broadcastSource;
                broadcastSource = application.getDevice().createBroadcastSource();
                hbbtvBindSpy = self.sandbox.spy(self.hbbtvPlugin, 'bindToCurrentChannel');
                self.sandbox.stub(self.hbbtvPlugin, 'playState', broadcastSource._playStates.UNREALIZED);
                broadcastSource.stopCurrentChannel();
                assertTrue('Native HBBTV bindToCurrentChannel function called', hbbtvBindSpy.called);
            },
            config);
    };

    this.hbbtvSource.prototype.testStopCurrentChannelDoesNotCallBindWhenNotUnrealized = function(queue) {
        expectAsserts(1);
        var config;
        config = getGenericHBBTVConfig();
        var self = this;

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [],
            function(application) {
                var hbbtvBindSpy, broadcastSource;
                broadcastSource = application.getDevice().createBroadcastSource();
                hbbtvBindSpy = self.sandbox.spy(self.hbbtvPlugin, 'bindToCurrentChannel');
                self.sandbox.stub(self.hbbtvPlugin, 'playState', broadcastSource._playStates.PRESENTING);
                broadcastSource.stopCurrentChannel();
                assertFalse('Native HBBTV bindToCurrentChannel function called', hbbtvBindSpy.called);
            },
            config);
    };

    this.hbbtvSource.prototype.testStopCurrentChannelSetsPluginHidden = function(queue) {
        expectAsserts(3);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.stopCurrentChannel();
            assertEquals('hidden', self.hbbtvPlugin.style.visibility);
            assertEquals('0px', self.hbbtvPlugin.style.width);
            assertEquals('0px', self.hbbtvPlugin.style.height);
        }, config);
    };

    this.hbbtvSource.prototype.testgetCurrentChannelNameGetsTheHBBTVCurrentChannelProperty = function(queue) {
        expectAsserts(1);

        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            var channelName = broadcastSource.getCurrentChannelName();
            assertEquals('Channel name should be BBC One', 'BBC One', channelName);
        }, config);
    };

    this.hbbtvSource.prototype.testgetCurrentChannelNameThrowsExceptionWhenHBBTVCurrentChannelObjectIsNull = function(queue) {
        expectAsserts(1);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            self.hbbtvPlugin.currentChannel = null;
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            assertException('Current channel name not available', function() {
                broadcastSource.getCurrentChannelName();
            });
        }, config);
    };

    this.hbbtvSource.prototype.testgetCurrentChannelNameThrowsExceptionWhenHBBTVCurrentChannelNamePropertyIsNull = function(queue) {
        expectAsserts(1);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            self.hbbtvPlugin.currentChannel.name = null;
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            assertException('Current channel name is null', function() {
                broadcastSource.getCurrentChannelName();
            });
        }, config);
    };

    this.hbbtvSource.prototype.testgetCurrentChannelNameThrowsExceptionWhenHBBTVCurrentChannelNamePropertyIsUndefined = function(queue) {
        expectAsserts(1);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            self.hbbtvPlugin.currentChannel.name = undefined;
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            assertException('Current channel name is not defined', function() {
                broadcastSource.getCurrentChannelName();
            });
        }, config);
    };

    this.hbbtvSource.prototype.testGetPlayStateReturnsHBBTVPlayStatePropertyIsPresenting = function(queue) {
        expectAsserts(1);
        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            self.sandbox.stub(self.hbbtvPlugin, 'playState', broadcastSource._playStates.PRESENTING);

            var playState = broadcastSource.getState();
            assertEquals('PRESENTING', playState);
        }, config);
    };

    this.hbbtvSource.prototype.testGetPlayStateReturnsConnectionWhenHBBTVPlayStatePropertyIsConnecting = function(queue) {
        expectAsserts(1);
        var self = this;

        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            self.sandbox.stub(self.hbbtvPlugin, 'playState', broadcastSource._playStates.CONNECTING);
            var playState = broadcastSource.getState();
            assertEquals('CONNECTING', playState);
        }, config);
    };

    this.hbbtvSource.prototype.testGetPlayStateReturnsUnavailableWhenHBBTVPlayStatePropertyIsUnrealized = function(queue) {
        expectAsserts(1);
        var self = this;

        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            self.sandbox.stub(self.hbbtvPlugin, 'playState', broadcastSource._playStates.UNREALIZED);
            var playState = broadcastSource.getState();
            assertEquals('UNAVAILABLE', playState);
        }, config);
    };

    this.hbbtvSource.prototype.testOnSuccessCallbackIsFiredWhenChannelChangeSucceededEventIsRaised = function(queue) {
        expectAsserts(2);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var onSuccessSpy = self.sandbox.spy();
            var onErrorSpy = self.sandbox.spy();

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            broadcastSource.setChannelByName({
                channelName : 'BBC One',
                onSuccess : onSuccessSpy,
                onError : onErrorSpy
            });

            var event = new CustomEvent('ChannelChangeSucceeded', {});
            self.hbbtvPlugin.dispatchEvent(event);

            assertTrue('OnSuccess callback function called', onSuccessSpy.calledOnce);
            assertTrue('OnError callback function not called', onErrorSpy.notCalled);
        }, config);
    };

    this.hbbtvSource.prototype.testGetChannelListFetchesChannelsFromBroadcastVideoObject = function (queue) {
        expectAsserts(1);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var getChannelConfigStub = self.sandbox.spy(self.hbbtvPlugin, 'getChannelConfig');
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = { onSuccess: self.sandbox.stub(), onError: self.sandbox.stub()};

            broadcastSource.getChannelNameList(params);

            assert(getChannelConfigStub.calledOnce);

        }, config);
    };


    this.hbbtvSource.prototype.testGetChannelListCallsErrorCallbackWithMessageWhenFetchingChannelsThrowsException = function (queue) {
        expectAsserts(3);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            self.sandbox.stub(self.hbbtvPlugin, 'getChannelConfig').throwsException({message:'Nope'});
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = { onSuccess: self.sandbox.stub(), onError: self.sandbox.stub()};

            broadcastSource.getChannelNameList(params);

            assert(params.onError.calledOnce);
            assert(params.onError.calledWithMatch({
                name : 'ChannelListError',
                message : 'Channel list is not available'
            }));
            assert(params.onSuccess.notCalled);

        }, config);
    };

    this.hbbtvSource.prototype.testGetChannelListCallsErrorCallbackWhenChannelListNotReturned = function (queue) {
        expectAsserts(3);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            self.sandbox.stub(self.hbbtvPlugin, 'getChannelConfig').returns({});
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = { onSuccess: self.sandbox.stub(), onError: self.sandbox.stub()};

            broadcastSource.getChannelNameList(params);

            assert(params.onError.calledOnce);
            assert(params.onError.calledWithMatch({
                name : 'ChannelListError',
                message : 'Channel list is empty or not available'
            }));
            assert(params.onSuccess.notCalled);

        }, config);
    };

    this.hbbtvSource.prototype.testGetChannelListCallsErrorCallbackWhenChannelListIsEmpty = function (queue) {
        expectAsserts(3);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            self.sandbox.stub(self.hbbtvPlugin, 'getChannelConfig').returns({channelList: []});
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = { onSuccess: self.sandbox.stub(), onError: self.sandbox.stub()};

            broadcastSource.getChannelNameList(params);

            assert(params.onError.calledOnce);
            assert(params.onError.calledWithMatch({
                name : 'ChannelListError',
                message : 'Channel list is empty or not available'
            }));
            assert(params.onSuccess.notCalled);

        }, config);
    };

    this.hbbtvSource.prototype.testGetChannelListCallsOnSuccessWithArrayOfChannelsContainingChannelInformation = function (queue) {
        expectAsserts(6);

        var self = this;
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var channels = [
                {
                    name: 'One'
                },
                {
                    name: 'Two'
                }
            ];

            self.sandbox.stub(self.hbbtvPlugin, 'getChannelConfig').returns({channelList: channels});
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = { onSuccess: self.sandbox.stub(), onError: self.sandbox.stub()};

            broadcastSource.getChannelNameList(params);

            assert(params.onError.notCalled);
            assert(params.onSuccess.calledOnce);

            var args = params.onSuccess.args[0];
            assertEquals(1,args.length);
            var channelObjects = args[0];

            assertEquals(2, channelObjects.length);
            assertEquals('One', channelObjects[0]);
            assertEquals('Two', channelObjects[1]);
        }, config);
    };


    var doChannelTuningTest = function (self, queue, channelName, callback) {
        var config = getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            self.sandbox.stub(application, 'getLayout', function() {
                return {
                    requiredScreenSize: { height: 720, width: 1280 }
                };
            });

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            self.hbbtvPlugin.bindToCurrentChannel = self.sandbox.stub();

            var params = {
                channelName: channelName,
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            callback(params);
        }, config);
    };

    this.hbbtvSource.prototype.testTuningToChannelByNameWhenNameIsNotInChannelListCausesOnError = function (queue) {
        expectAsserts(3);

        doChannelTuningTest(this, queue, 'NonExistentChannel', function (params) {
            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWithMatch({
                name : 'ChannelError',
                message: 'NonExistentChannel not found in channel list'
            }));
        });
    };

    this.hbbtvSource.prototype.testTuningToChannelByNameWhenNameIsNotInChannelListUsingItemAccessorCausesOnError = function (queue) {
        expectAsserts(3);

        stubChannelListInHbbtvPluginAsItemAccessorOnly(this);

        doChannelTuningTest(this, queue, 'NonExistentChannel', function (params) {
            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWithMatch({
                name : 'ChannelError',
                message: 'NonExistentChannel not found in channel list'
            }));
        });
    };

    this.hbbtvSource.prototype.testTuningToChannelByNameWhenNameIsNotInChannelListUsingBrokenItemAccessorAndGoodArrayCausesOnError = function (queue) {
        expectAsserts(3);

        stubChannelListInHbbtvPluginAsArrayAndBrokenItemAccessor(this);

        doChannelTuningTest(this, queue, 'NonExistentChannel', function (params) {
            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWithMatch({
                name : 'ChannelError',
                message: 'NonExistentChannel not found in channel list'
            }));
        });
    };

    this.hbbtvSource.prototype.testTuningToCurrentChannelByNameCausesOnSuccess = function (queue) {
        expectAsserts(2);

        doChannelTuningTest(this, queue, 'BBC One', function (params) {
            assert(params.onError.notCalled);
            assert(params.onSuccess.calledOnce);
        });
    };

    this.hbbtvSource.prototype.testTuningToCurrentChannelByNameUsingItemAccessorInChannelListCausesOnSuccess = function (queue) {
        expectAsserts(2);

        stubChannelListInHbbtvPluginAsItemAccessorOnly(this);

        doChannelTuningTest(this, queue, 'BBC One', function (params) {
            assert(params.onError.notCalled);
            assert(params.onSuccess.calledOnce);
        });
    };

    this.hbbtvSource.prototype.testTuningToCurrentChannelByNameUsingBrokenItemAccessorAndGoodArrayInChannelListCausesOnSuccess = function (queue) {
        expectAsserts(2);

        stubChannelListInHbbtvPluginAsArrayAndBrokenItemAccessor(this);

        doChannelTuningTest(this, queue, 'BBC One', function (params) {
            assert(params.onError.notCalled);
            assert(params.onSuccess.calledOnce);
        });
    };

    this.hbbtvSource.prototype.testTuningToCurrentChannelByNameCausesChannelToBeShown = function (queue) {
        expectAsserts(4);

        var hbbtvPlugin = this.hbbtvPlugin;
        doChannelTuningTest(this, queue, 'BBC One', function () {
            assert(hbbtvPlugin.bindToCurrentChannel.calledOnce);
            assertEquals('1280px', hbbtvPlugin.style.width);
            assertEquals('720px', hbbtvPlugin.style.height);
            assertEquals('visible',hbbtvPlugin.style.visibility);
        });
    };

    this.hbbtvSource.prototype.testTuningToNewChannelByNameCausesBroadcastToBeSetVisible = function (queue) {
        expectAsserts(3);

        var hbbtvPlugin = this.hbbtvPlugin;
        doChannelTuningTest(this, queue, 'BBC Two', function () {
            var evt = new CustomEvent('ChannelChangeSucceeded');
            hbbtvPlugin.dispatchEvent(evt);

            assertEquals('1280px', hbbtvPlugin.style.width);
            assertEquals('720px', hbbtvPlugin.style.height);
            assertEquals('visible',hbbtvPlugin.style.visibility);
        });
    };

    this.hbbtvSource.prototype.testTuningToCurrentChannelByNameIsDetectedUsingCurrentChannel = function (queue) {
        expectAsserts(2);

        this.hbbtvPlugin.currentChannel = {
            name : 'BBC Two'
        };
        doChannelTuningTest(this, queue, 'BBC Two', function (params) {
            assert(params.onError.notCalled);
            assert(params.onSuccess.calledOnce);
        });
    };

    this.hbbtvSource.prototype.testTuningToCurrentChannelByNameCallsOnErrorIfCurrentChannelCannotBeDetermined = function (queue) {
        expectAsserts(3);

        this.hbbtvPlugin.currentChannel = undefined;
        doChannelTuningTest(this, queue, 'BBC Two', function (params) {
            assert(params.onError.calledOnce);
            assert(params.onError.calledWith({
                name : 'ChannelError',
                message: 'Unable to determine current channel name'
            }));
            assert(params.onSuccess.notCalled);
        });
    };

    this.hbbtvSource.prototype.testTuningToChannelByNameDoesNotCreateNewChannelObjectForNewChannel = function (queue) {
        expectAsserts(1);

        var createChannelObjectStub = this.sandbox.stub(this.hbbtvPlugin, 'createChannelObject');
        doChannelTuningTest(this, queue, 'BBC Two', function () {
            assert(createChannelObjectStub.notCalled);
        });
    };

    this.hbbtvSource.prototype.testTuningToChannelByNameWhenChannelListIsEmptyCausesOnError = function (queue) {
        expectAsserts(3);

        this.sandbox.stub(this.hbbtvPlugin, 'getChannelConfig').returns({channelList:[]});
        doChannelTuningTest(this, queue, 'BBC Three', function (params) {
            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWithMatch({
                name : 'ChannelListError',
                message : 'Channel list is empty or not available'
            }));
        });
    };

    this.hbbtvSource.prototype.testTuningToChannelByNameUsesCorrectChannelObjectFromChannelListToSetChannel = function (queue) {
        expectAsserts(2);

        var setChannelStub = this.sandbox.stub(this.hbbtvPlugin, 'setChannel');

        doChannelTuningTest(this, queue, 'BBC Three', function () {
            var channel = setChannelStub.args[0][0];
            assert(setChannelStub.calledOnce);
            assertEquals('BBC Three', channel.name);
        });
    };

    this.hbbtvSource.prototype.testTuningToChannelByNameWhenSetChannelFailsCausesOnError = function (queue) {
        expectAsserts(3);

        var channelObj = { foo: 'bar' };
        this.sandbox.stub(this.hbbtvPlugin, 'createChannelObject').returns(channelObj);

        var hbbtvPlugin = this.hbbtvPlugin;
        doChannelTuningTest(this, queue, 'BBC Three', function (params) {
            var evt = new CustomEvent('ChannelChangeError');
            hbbtvPlugin.dispatchEvent(evt);

            assert(params.onError.calledOnce);
            assert(params.onError.calledWith({
                name : 'ChangeChannelError',
                message : 'Error tuning channel'
            }));
            assert(params.onSuccess.notCalled);
        });
    };

    this.hbbtvSource.prototype.testTuningToChannelByNameWhenSetChannelSucceedsCausesOnSuccess = function (queue) {
        expectAsserts(2);

        var channelObj = { foo: 'bar' };

        this.sandbox.stub(this.hbbtvPlugin, 'createChannelObject').returns(channelObj);

        var hbbtvPlugin = this.hbbtvPlugin;
        doChannelTuningTest(this, queue, 'BBC Three', function (params) {
            var evt = new CustomEvent('ChannelChangeSucceeded');
            hbbtvPlugin.dispatchEvent(evt);

            assert(params.onError.notCalled);
            assert(params.onSuccess.calledOnce);
        });
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/broadcastsource/hbbtvsource'], this.hbbtvSource);

})();
