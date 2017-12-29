/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {

    this.ExitTiVoTest = AsyncTestCase('Exit (TiVo)');

    this.ExitTiVoTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.ExitTiVoTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    var config = {
        'modules' : {
            'base' : 'antie/devices/browserdevice',
            'modifiers' : [ 'antie/devices/exit/tivo' ]
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


    this.ExitTiVoTest.prototype.testTiVoExit = function(queue) {
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            tivo = {
                core: {
                    exit: function () {}
                }
            };

            var tiVoBackStub = tivo.core.exit = this.sandbox.stub();

            application.getDevice().exit();
            assert(tiVoBackStub.calledOnce);
            tivo = null;
        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/exit/tivo'], this.ExitTiVoTest);

}());
