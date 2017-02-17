/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {

    this.BroadcastExitSamsungTest = AsyncTestCase('Broadcast Exit (Samsung)');

    this.BroadcastExitSamsungTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.BroadcastExitSamsungTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    var config = {
        'modules' : {
            'base' : 'antie/devices/browserdevice',
            'modifiers' : [ 'antie/devices/exit/broadcast/samsung_maple' ]
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

    this.BroadcastExitSamsungTest.prototype.testBroadcastSamsungExit = function(queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var self, sendExitEventStub;
            self = this;
            sendExitEventStub = self.sandbox.stub();

            // Mock out the Samsung API
            window.Common = {
                API: {
                    Widget: function() {
                        return {
                            sendExitEvent: sendExitEventStub
                        };
                    }
                }
            };

            application.getDevice().exitToBroadcast();
            assert(sendExitEventStub.calledOnce);
        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/exit/broadcast/samsung_maple'], this.BroadcastExitSamsungTest);

}());
