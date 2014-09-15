(function() {
    /* jshint newcap: false */
    this.ExitTiVoTest = AsyncTestCase("Exit (TiVo)");

    this.ExitTiVoTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.ExitTiVoTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    var config = {
        "modules" : {
            "base" : "antie/devices/browserdevice",
            "modifiers" : [ "antie/devices/exit/tivo" ]
        },
        "input" : {
            "map" : {}
        },
        "layouts" : [ {
            "width" : 960,
            "height" : 540,
            "module" : "fixtures/layouts/default",
            "classes" : [ "browserdevice540p" ]
        } ],
        "deviceConfigurationKey" : "devices-html5-1"
    };

    this.ExitNetCastTest.prototype.testNetCastExit = function(queue) {
        queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
            var tiVoBackStub = window.TiVoBack = this.sandbox.stub();

            application.getDevice().exit();
            assert(tiVoBackStub.calledOnce);
        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/exit/tivo'], this.ExitTiVoTest);

}());
