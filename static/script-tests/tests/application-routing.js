/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.ApplicationRoutingTest = AsyncTestCase('Application_Routing');

    this.ApplicationRoutingTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.ApplicationRoutingTest.prototype.tearDown = function() {
        this.sandbox.restore();

        if(this.application) {
            this.application.destroy();
            this.application = null;
        }
    };


    this.ApplicationRoutingTest.prototype.testGetSetCurrentRoute = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            application.setCurrentRoute(['a','b','c']);
            assertEquals(['a','b','c'], application.getCurrentRoute());

        });

    };

    this.ApplicationRoutingTest.prototype.testSetCurrentRouteUsesDevice = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();

            var setCurrentRouteSpy = this.sandbox.spy(device, 'setCurrentRoute');
            application.setCurrentRoute(['a','b','c']);
            assert(setCurrentRouteSpy.called);

        });

    };

    this.ApplicationRoutingTest.prototype.testGetCurrentRouteUsesDevice = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();

            var getCurrentRouteSpy = this.sandbox.spy(device, 'getCurrentRoute');
            application.getCurrentRoute();
            assert(getCurrentRouteSpy.called);

        });

    };

    this.ApplicationRoutingTest.prototype.testGetReferer = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            assertNotNull(application.getReferer());
        });

    };
    this.ApplicationRoutingTest.prototype.testRouteIsCalled = function(queue) {
        expectAsserts(7);

        queuedApplicationInit(queue, 'lib/mockapplication', ['lib/mockapplication', 'antie/devices/device'], function(application, MockApplication, Device) {

            var device = application.getDevice();
            application.destroy();

            var deviceLoadStub = this.sandbox.stub(Device, 'load');

            var routeStub = this.sandbox.stub(MockApplication.prototype, 'route');

            new MockApplication(document.createElement('div'), null, null, null);

            assert(deviceLoadStub.calledOnce);
            var deviceLoadCallbacks = deviceLoadStub.args[0][1];
            assertObject(deviceLoadCallbacks);
            assertFunction(deviceLoadCallbacks.onSuccess);

            // When we call back indicating success of Device.load, we load the layouts by using require. We mock
            // out require and simulate the success of the load of the require call that loads the layout module.
            var requireStub = this.sandbox.stub(window, 'require');

            deviceLoadCallbacks.onSuccess(device);

            assert(requireStub.calledOnce);
            var requireCallback = requireStub.args[0][1];
            assertFunction(requireCallback);

            assert(routeStub.notCalled);

            var mockLayout = { };

            requireCallback(mockLayout);

            assert(routeStub.calledOnce);
        });

    };
})();
