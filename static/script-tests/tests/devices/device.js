(function() {
	this.DeviceTest = AsyncTestCase("Device");

	this.DeviceTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.DeviceTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};

	this.DeviceTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/devices/device","antie/class"],
			function(application, Device, Class) {
				assertEquals('Device should be a function', 'function', typeof Device);
				var device = new Device(antie.framework.deviceConfiguration);
				assert('Device should extend from Class', device instanceof Class);
		});
	};

	this.DeviceTest.prototype.testLoad = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/devices/device"],
			function(application, Device) {
				var callbacks = {
					onSuccess: this.sandbox.stub(),
					onError: this.sandbox.stub()
				};
				assertNoException(function() {
					Device.load(antie.framework.deviceConfiguration, callbacks);
				});
				assert("Device.load calls onSuccess callback when valid config is provided", callbacks.onSuccess.called);

				assertNoException(function() {
					Device.load({}, callbacks);
				});
				assert("Device.load calls onError callback when invalid config is provided", callbacks.onError.called);
		});
	};

	this.DeviceTest.prototype.testGetConfig = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/devices/device","antie/application"], function(application, Device, Application) {
			var callbacks = {
				onSuccess: this.sandbox.stub(),
				onError: this.sandbox.stub()
			};
			assertNoException(function() {
				Device.load(antie.framework.deviceConfiguration, callbacks);
			});
			var application = Application.getCurrentApplication();
			var device = application.getDevice();
			assertSame(antie.framework.deviceConfiguration, device.getConfig())
		});
	};

	this.DeviceTest.prototype.testExit = function(queue) {
		expectAsserts(1);

		queuedRequire(queue, ["antie/devices/device"], function(Device) {
			var device = new Device(antie.framework.deviceConfiguration);
			assertException("Default device implementation should throw exception on exit()", function() { device.exit(); });
		});
	};

})();
