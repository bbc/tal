/**
 * @preserve Copyright (c) 2015 British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */
(function () {
    this.tizentvSource = AsyncTestCase("Tizen Broadcast Source"); //jshint ignore:line

    var mutedVolume = false;
    var tizenVolume = 10;
    var stubTizenTVSpecificApis = function () {
        window.tizen = {
            tvchannel: {
                getCurrentChannel: function () {
                    return {
                        channelName: "BBC One"
                    }
                },
                getChannelList: function () {
                    return [
                        {channelName: "BBC One"},
                        {channelName: "BBC Two"},
                        {channelName: "BBC Three"}
                    ]

                }
            },
            tvwindow: {
                show: function () {
                },
                hide: function () {
                }
            },
            tvaudiocontrol: {
                getVolume: function () {
                    return tizenVolume;
                },
                setVolume: function (volume) {
                    tizenVolume = volume;
                },
                setMute: function (muted) {
                    mutedVolume = muted;
                }
            },
            tvinputdevice: {
                registerKey: function (key) {
                },
                unregisterKey: function (key) {
                }
            }
        };
    };

    var removeTizenTVSpecificApis = function () {
        window.tizen = null;
        this.registeredKeys = [];
    };

    var getGenericTizenTVConfig = function () {
        return {
            modules: {base: "antie/devices/browserdevice", modifiers: [
                "antie/devices/anim/styletopleft",
                "antie/devices/media/html5",
                "antie/devices/net/default",
                "antie/devices/broadcastsource/tizentvsource",
                "antie/devices/data/nativejson",
                "antie/devices/storage/cookie",
                "antie/devices/logging/default",
                "antie/devices/exit/closewindow"
            ]}, input: {map: {}}, layouts: [
                {width: 1280, height: 720, module: "fixtures/layouts/default", classes: ["browserdevice720p"]}
            ], deviceConfigurationKey: "devices-html5-1"};
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
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/basetvsource"], function (application, BaseTvSource) {
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
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/tizentvsource"], function (application, TizenTVSource) {
            var device = application.getDevice();

            var tizenTVConstructor = self.sandbox.spy(TizenTVSource.prototype, "init");

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
            var device = application.getDevice()
            assertException("Unable to initialize Tizen broadcast object", function () {
                device.createBroadcastSource();
            });
        }, config);
    };

    this.tizentvSource.prototype.testShowCurrentChannelSetsVolumeBackSetsMuteToFalseAndSetsBroadcastToFullScreen = function (queue) {
        expectAsserts(3);

        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/tizentvsource"], function (application) {
            var device = application.getDevice();
            spyOn(tizen.tvaudiocontrol, 'setVolume');
            spyOn(tizen.tvwindow, 'hide');
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.showCurrentChannel();

            expect(tizen.tvaudiocontrol.setVolume).toHaveBeenCalledWith(tizenVolume);
            assertFalse(mutedVolume);
            expect(tizen.tvwindow.hide).toHaveBeenCalled();
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

    this.tizentvSource.prototype.testGetChannelNameListRequestsChannelsFromTizenWebAPI = function (queue) {
        expectAsserts(2);

        var self = this;
        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/tizentvsource"], function (application, TizenTVSource) {

            var channelListStub = self.sandbox.stub(tizen.tvchannel, "getChannelList");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                onSuccess: self.sandbox.stub(),
                onError: self.sandbox.stub()
            };

            broadcastSource.getChannelNameList(params);
            assert(channelListStub.calledOnce);
            assertEquals("ALL", channelListStub.args[0][2]);
        }, config);
    };

    this.tizentvSource.prototype.testStopCurrentChannelMutesTheChannelAndBroadcastsTunerStoppedEvent = function (queue) {
        expectAsserts(2);

        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/events/tunerstoppedevent"], function (application, TunerStoppedEvent) {
            var device = application.getDevice();
            spyOn(application, 'broadcastEvent');
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.stopCurrentChannel();
            assertTrue(mutedVolume);
            expect(application.broadcastEvent).toHaveBeenCalled();
        }, config);
    };

})();
