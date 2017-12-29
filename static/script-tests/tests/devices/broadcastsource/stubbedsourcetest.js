/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.stubbedSource = AsyncTestCase('Stubbed Broadcast Source');

    var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':[
        'antie/devices/anim/styletopleft',
        'antie/devices/broadcastsource/stubbedsource',
        'antie/devices/data/nativejson',
        'antie/devices/storage/cookie',
        'antie/devices/logging/default',
        'antie/devices/exit/closewindow'
    ]},'input':{'map':{}},'layouts':[
        {'width':1280,'height':720,'module':'fixtures/layouts/default','classes':['browserdevice720p']}
    ],'deviceConfigurationKey':'devices-html5-1'};

    this.stubbedSource.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.stubbedSource.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.stubbedSource.prototype.testCreateBroadcastDoesNotThrowException = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();

            assertNoException(function() {
                device.createBroadcastSource();
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceShowCurrentChannelDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();

            assertNoException(function() {
                var broadcastStub = device.createBroadcastSource();
                broadcastStub.showCurrentChannel();
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceStopCurrentChannelDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastStub = device.createBroadcastSource();
            assertNoException(function() {
                broadcastStub.stopCurrentChannel();
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceGetCurrentChannelNameDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastStub = device.createBroadcastSource();
            assertNoException(function() {
                broadcastStub.getCurrentChannelName();
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceSetPositionDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastStub = device.createBroadcastSource();
            assertNoException(function() {
                broadcastStub.setPosition(10, 20, 30, 40);
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceDestroyDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastStub = device.createBroadcastSource();
            assertNoException(function() {
                broadcastStub.destroy();
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceGetStateDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastStub = device.createBroadcastSource();
            assertNoException(function(){
                broadcastStub.getState();
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceSetChannelByNameDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastStub = device.createBroadcastSource();
            assertNoException(function() {
                broadcastStub.setChannelByName();
            });
        }, config);
    };

    this.stubbedSource.prototype.testStubbedBroadcastSourceGetChannelNameListDoesNotThrowException = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastStub = device.createBroadcastSource();
            assertNoException(function() {
                broadcastStub.getChannelNameList();
            });
        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/broadcastsource/stubbedSource'], this.stubbedSource);

})();
