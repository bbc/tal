/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {

    this.ExitNetCastTest = AsyncTestCase('Exit (NetCast)');

    this.ExitNetCastTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.ExitNetCastTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    var config = {
        'modules' : {
            'base' : 'antie/devices/browserdevice',
            'modifiers' : [ 'antie/devices/exit/netcast' ]
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

    this.ExitNetCastTest.prototype.testNetCastExit = function(queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var netCastBackStub = window.NetCastBack = this.sandbox.stub();

            application.getDevice().exit();
            assert(netCastBackStub.calledOnce);
        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/exit/netcast'], this.ExitNetCastTest);

}());
