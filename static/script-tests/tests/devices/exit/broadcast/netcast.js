/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {

    this.BroadcastExitNetCastTest = AsyncTestCase('Broadcast Exit (NetCast)');

    this.BroadcastExitNetCastTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.BroadcastExitNetCastTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    var config = {
        'modules' : {
            'base' : 'antie/devices/browserdevice',
            'modifiers' : [ 'antie/devices/exit/broadcast/netcast' ]
        },
        'input' : {
            'map' : {}
        },
        'layouts' : [ {
            'width' : 960,
            'height' : 540,
            'module' : 'fixtures/layouts/default',
            'classes' : [ 'browserdevice540p' ]
        } ],
        'deviceConfigurationKey' : 'devices-html5-1'
    };

    this.BroadcastExitNetCastTest.prototype.testBroadcastNetCastExit = function(queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var netCastExitStub = window.NetCastExit = this.sandbox.stub();

            application.getDevice().exitToBroadcast();
            assert(netCastExitStub.calledOnce);
        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/exit/broadcast/netcast'], this.BroadcastExitNetCastTest);

}());
