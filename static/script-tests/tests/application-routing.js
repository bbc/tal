(function() {
	this.ApplicationRoutingTest = AsyncTestCase("Application (Routing)");

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

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();

			application.setCurrentRoute(["a","b","c"]);
			assertEquals(["a","b","c"], application.getCurrentRoute());

		});

	};

	this.ApplicationRoutingTest.prototype.testSetCurrentRouteUsesDevice = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();

			var setCurrentRouteSpy = this.sandbox.spy(device, 'setCurrentRoute');
			application.setCurrentRoute(["a","b","c"]);
			assert(setCurrentRouteSpy.called);

		});

	};

	this.ApplicationRoutingTest.prototype.testGetCurrentRouteUsesDevice = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var device = application.getDevice();

			var getCurrentRouteSpy = this.sandbox.spy(device, 'getCurrentRoute');
			application.getCurrentRoute()
			assert(getCurrentRouteSpy.called);

		});

	};

	this.ApplicationRoutingTest.prototype.testGetReferer = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			assertNotNull(application.getReferer());
		});

	};
	this.ApplicationRoutingTest.prototype.testRouteIsCalled = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["lib/mockapplication"], function(MockApplication) {
			queue.call("Wait for route to be called", function(callbacks) {
				var routeSpy;
				var onBeforeInit = callbacks.add(function() {
					routeSpy = this.sandbox.spy(MockApplication.prototype, 'route');
				});
				var onReady = callbacks.add(function() {
					assert(routeSpy.calledWith(this.application.getDevice().getCurrentRoute()));
				});
				this.application = new MockApplication(document.createElement('div'), null, null, onReady, null, onBeforeInit);
			});
		});
	};
})();
