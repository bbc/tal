/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.ApplicationInitialisationTest = AsyncTestCase('Application_Initialisation');

    this.ApplicationInitialisationTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.ApplicationInitialisationTest.prototype.tearDown = function() {
        this.sandbox.restore();

        if(this.application) {
            this.application.destroy();
            this.application = null;
        }
    };

    this.ApplicationInitialisationTest.prototype.testInterface = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/application','antie/class'], function(application, Application, Class) {
            application.destroy();

            assertEquals('Application should be a function', 'function', typeof Application);
            this.application = new Application();
            assert('Application should extend from Class', this.application instanceof Class);

        });
    };

    this.ApplicationInitialisationTest.prototype.testOnReadyHandlerCalledWhenCallingReady = function(queue) {
        expectAsserts(4);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/application'], function(application, Application) {

            application.destroy();

            var clock = sinon.useFakeTimers();

            var onReady = this.sandbox.stub();

            var app = new Application(document.createElement('div'), null, null, onReady);

            assert(onReady.notCalled);

            app.ready();

            assert(onReady.notCalled);

            clock.tick(1);

            assert(onReady.calledOnce);
            assert(onReady.calledWith(app));

            clock.restore();
        });
    };

    this.ApplicationInitialisationTest.prototype.testGetCurrentApplication = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/application'], function(application, Application) {
            assertSame(Application.getCurrentApplication(), application);
        });
    };
    this.ApplicationInitialisationTest.prototype.testApplicationCanBeInitialisedOnlyOnce = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ['lib/mockapplication'], function(application, MockApplication) {
            application.destroy();

            this.application = new MockApplication(document.createElement('div'));
            assertException(function() {
                new MockApplication(document.createElement('div'));
            });
        });
    };
    this.ApplicationInitialisationTest.prototype.testApplicationCanBeInitialisedAfterDestroy = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ['lib/mockapplication'], function(application, MockApplication) {
            application.destroy();

            this.application = new MockApplication(document.createElement('div'));
            this.application.destroy();
            var self = this;
            assertNoException(function() {
                self.application = new MockApplication(document.createElement('div'));
            });
        });
    };

    this.ApplicationInitialisationTest.prototype.testRunIsCalled = function(queue) {
        expectAsserts(7);

        queuedApplicationInit(queue, 'lib/mockapplication', ['lib/mockapplication', 'antie/devices/device'], function(application, MockApplication, Device) {

            var device = application.getDevice();
            application.destroy();

            var deviceLoadStub = this.sandbox.stub(Device, 'load');

            var runStub = this.sandbox.stub(MockApplication.prototype, 'run');

            new MockApplication(document.createElement('div'), null, null, null);

            assert(deviceLoadStub.calledOnce);
            var deviceLoadCallbacks = deviceLoadStub.args[0][1];
            assertObject(deviceLoadCallbacks);
            assertFunction(deviceLoadCallbacks.onSuccess);

            var requireStub = this.sandbox.stub(window, 'require');

            deviceLoadCallbacks.onSuccess(device);

            assert(requireStub.calledOnce);
            var requireCallback = requireStub.args[0][1];
            assertFunction(requireCallback);

            assert(runStub.notCalled);

            var mockLayout = { };

            requireCallback(mockLayout);

            assert(runStub.calledOnce);
        });
    };
    this.ApplicationInitialisationTest.prototype.testGetDevice = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/browserdevice'], function(application, BrowserDevice) {
            assertInstanceOf(BrowserDevice, application.getDevice());
        });
    };

})();
