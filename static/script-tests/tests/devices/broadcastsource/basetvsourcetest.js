/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.baseTvSource = AsyncTestCase('Abstract Base Broadcast Source');

    var extendBaseTvSourceWithNoOverriddenMethods = function(BaseTvSource) {
        BaseTvSource.prototype.init = function() {
        };
    };

    var getGenericBaseBroadcastConfig = function() {
        return {'modules':{'base':'antie/devices/browserdevice','modifiers':[
            'antie/devices/anim/styletopleft',
            'antie/devices/broadcastsource/basetvsource',
            'antie/devices/data/nativejson',
            'antie/devices/storage/cookie',
            'antie/devices/logging/default',
            'antie/devices/exit/closewindow'
        ]},'input':{'map':{}},'layouts':[
            {'width':1280,'height':720,'module':'fixtures/layouts/default','classes':['browserdevice720p']}
        ],'deviceConfigurationKey':'devices-html5-1'};
    };

    this.baseTvSource.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.baseTvSource.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.baseTvSource.prototype.testCreateBroadcastThrowsDeviceException = function(queue) {
        expectAsserts(1);

        var config = getGenericBaseBroadcastConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            assertException('Broadcast API not available on this device.', function() {
                device.createBroadcastSource();
            });
        }, config);
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceInitThrowsException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/basetvsource'], function(application, BaseTvSource) {
            assertException('Abstract class constructor should not be called directly', function() {
                new BaseTvSource();
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceShowCurrentChannelThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/basetvsource'], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException('Device broadcast source does not override abstract method showCurrentChannel', function() {
                broadcastSource.showCurrentChannel();
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceStopCurrentChannelThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/basetvsource'], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException('Device broadcast source does not override abstract method stopCurrentChannel', function() {
                broadcastSource.stopCurrentChannel();
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceGetCurrentChannelNameThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/basetvsource'], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException('Device broadcast source does not override abstract method getCurrentChannelName', function() {
                broadcastSource.getCurrentChannelName();
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceSetPositionThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/basetvsource'], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException('Device broadcast source does not override abstract method setPosition', function() {
                broadcastSource.setPosition(10, 20, 30, 40);
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceDestroyThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/basetvsource'], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException('Device broadcast source does not override abstract method destroy', function() {
                broadcastSource.destroy();
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceGetStateThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/basetvsource'], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException('Base implementation throws exception when not overridden', function(){
                broadcastSource.getState();
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceSetChannelByNameThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/basetvsource'], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException('Device broadcast source does not override abstract method setChannelByName', function() {
                broadcastSource.setChannelByName();
            });
        });
    };

    this.baseTvSource.prototype.testBaseBroadcastSourceGetChannelNameListThrowsExceptionWhenNotOverridden = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/basetvsource'], function(application, BaseTvSource) {
            extendBaseTvSourceWithNoOverriddenMethods(BaseTvSource);
            var broadcastSource = new BaseTvSource();
            assertException('Device broadcast source does not override abstract method getChannelList', function() {
                broadcastSource.getChannelNameList();
            });
        });
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/broadcastsource/basetvsource'], this.baseTvSource);

})();
