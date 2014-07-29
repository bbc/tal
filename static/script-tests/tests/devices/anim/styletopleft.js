(function() {
	this.StyleTopLeftAnimationTest = AsyncTestCase("Animation (Style Top and Left)");

	this.StyleTopLeftAnimationTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.StyleTopLeftAnimationTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};

	this.StyleTopLeftAnimationTest.prototype.testScrollElementToWithAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = device.createContainer("id_mask");
			var inner = device.createContainer("id");
			device.appendChildElement(div, inner);

			queue.call("Wait for tween", function(callbacks) {
				var tweenSpy = this.sandbox.spy(device, '_tween');

				var onComplete = callbacks.add(function() {
					assertEquals(-100, Math.round(parseFloat(inner.style.left.replace(/px$/,''))));
					assertEquals(-200, Math.round(parseFloat(inner.style.top.replace(/px$/,''))));
				});
				device.scrollElementTo(div, 100, 200, false, onComplete);
				assert(tweenSpy.called);
			});
		}, config);
	};
	this.StyleTopLeftAnimationTest.prototype.testScrollElementToWithAnimNoMovement = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = device.createContainer("id_mask");
			var inner = device.createContainer("id");
			device.appendChildElement(div, inner);

			inner.style.top = "200px";
			inner.style.left = "100px";

			var tweenSpy = this.sandbox.spy(device, '_tween');
			device.scrollElementTo(div, 100, 200);
			assertFalse(tweenSpy.called);
		}, config);
	};
	this.StyleTopLeftAnimationTest.prototype.testScrollElementToWithNoAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = device.createContainer("id_mask");
			var inner = device.createContainer("id");
			device.appendChildElement(div, inner);

			queue.call("Wait for tween", function(callbacks) {
				var tweenSpy = this.sandbox.spy(device, '_tween');

				var onComplete = callbacks.add(function() {
					assertEquals(-100, Math.round(parseFloat(inner.style.left.replace(/px$/,''))));
					assertEquals(-200, Math.round(parseFloat(inner.style.top.replace(/px$/,''))));
				});
				device.scrollElementTo(div, 100, 200, true, onComplete);
				assertFalse(tweenSpy.called);
			});
		}, config);
	};

	this.StyleTopLeftAnimationTest.prototype.testMoveElementToWithAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = device.createContainer("id");

			queue.call("Wait for tween", function(callbacks) {
				var tweenSpy = this.sandbox.spy(device, '_tween');

				var onComplete = callbacks.add(function() {
					assertEquals(100, Math.round(parseFloat(div.style.left.replace(/px$/,''))));
					assertEquals(200, Math.round(parseFloat(div.style.top.replace(/px$/,''))));
				});
				device.moveElementTo(div, 100, 200, false, onComplete);
				assert(tweenSpy.called);
			});
		}, config);
	};
	this.StyleTopLeftAnimationTest.prototype.testMoveElementToWithAnimNoMovement = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = device.createContainer("id");

			div.style.top = "200px";
			div.style.left = "100px";

			var tweenSpy = this.sandbox.spy(device, '_tween');
			device.moveElementTo(div, 100, 200);
			assertFalse(tweenSpy.called);
		}, config);
	};
	this.StyleTopLeftAnimationTest.prototype.testMoveElementToWithNoAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = device.createContainer("id");

			queue.call("Wait for tween", function(callbacks) {
				var tweenSpy = this.sandbox.spy(device, '_tween');

				var onComplete = callbacks.add(function() {
					assertEquals(100, Math.round(parseFloat(div.style.left.replace(/px$/,''))));
					assertEquals(200, Math.round(parseFloat(div.style.top.replace(/px$/,''))));
				});
				device.moveElementTo(div, 100, 200, true, onComplete);
				assertFalse(tweenSpy.called);
			});
		}, config);
	};

	this.StyleTopLeftAnimationTest.prototype.testHideElementWithAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = device.createContainer("id");

			queue.call("Wait for tween", function(callbacks) {
				var tweenSpy = this.sandbox.spy(device, '_tween');

				var onComplete = callbacks.add(function() {
					assertEquals("hidden", div.style.visibility);
					assertEquals(0, Math.round(parseFloat(div.style.opacity)));
				});
				device.hideElement(div, false, onComplete);
				assert(tweenSpy.called);
			});
		}, config);
	};
	this.StyleTopLeftAnimationTest.prototype.testHideElementWithNoAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = device.createContainer("id");

			queue.call("Wait for tween", function(callbacks) {
				var tweenSpy = this.sandbox.spy(device, '_tween');

				var onComplete = callbacks.add(function() {
					assertEquals("hidden", div.style.visibility);
					assertEquals(0, Math.round(parseFloat(div.style.opacity)));
				});
				device.hideElement(div, true, onComplete);
				assertFalse(tweenSpy.called);
			});
		}, config);
	};

	this.StyleTopLeftAnimationTest.prototype.testShowElementWithAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = device.createContainer("id");

			queue.call("Wait for tween", function(callbacks) {
				var tweenSpy = this.sandbox.spy(device, '_tween');

				var onComplete = callbacks.add(function() {
					assertEquals("visible", div.style.visibility);
					assertEquals(1, Math.round(parseFloat(div.style.opacity)));
				});
				device.showElement(div, false, onComplete);
				assert(tweenSpy.called);
			});
		}, config);
	};
	this.StyleTopLeftAnimationTest.prototype.testShowElementWithNoAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = device.createContainer("id");

			queue.call("Wait for tween", function(callbacks) {
				var tweenSpy = this.sandbox.spy(device, '_tween');

				var onComplete = callbacks.add(function() {
					assertEquals("visible", div.style.visibility);
					assertEquals(1, Math.round(parseFloat(div.style.opacity)));
				});
				device.showElement(div, true, onComplete);
				assertFalse(tweenSpy.called);
			});
		}, config);
	};
})();
