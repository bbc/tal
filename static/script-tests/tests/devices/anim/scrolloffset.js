(function() {
	this.ScrollOffsetAnimationTest = AsyncTestCase("Animation (Scroll Offset)");

	this.ScrollOffsetAnimationTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
		this.div = null;
	};

	this.ScrollOffsetAnimationTest.prototype.tearDown = function() {
		this.sandbox.restore();
		if(this.div) {
			this.div.parentNode.removeChild(this.div);
		}
	};

	this.ScrollOffsetAnimationTest.prototype.createScrollableDiv = function(device) {
		this.div = device.createContainer("id");
		document.body.appendChild(this.div);
		this.div.style.overflow = "hidden";
		this.div.style.width = "10px";
		this.div.style.height = "10px";
		this.div.style.position = "absolute";
		var inner = device.createContainer();
		inner.style.position = "absolute";
		inner.style.top = 0;
		inner.style.left = 0;
		inner.style.width = "1000px";
		inner.style.height = "1000px";
		device.appendChildElement(this.div, inner);

		return this.div;
	}

	this.ScrollOffsetAnimationTest.prototype.testScrollElementToWithAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/scrolloffset']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = this.createScrollableDiv(device);

			queue.call("Wait for tween", function(callbacks) {
				var tweenSpy = this.sandbox.spy(device, '_tween');

				var onComplete = callbacks.add(function() {
					assertEquals(100, div.scrollLeft);
					assertEquals(200, div.scrollTop);
				});
				device.scrollElementTo(div, 100, 200, false, onComplete);
				assert(tweenSpy.called);
			});
		}, config);
	};
	this.ScrollOffsetAnimationTest.prototype.testScrollElementToWithAnimNoMovement = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/scrolloffset']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = this.createScrollableDiv(device);

			div.scrollTop = 200;
			div.scrollLeft = 100;

			var tweenSpy = this.sandbox.spy(device, '_tween');
			device.scrollElementTo(div, 100, 200);
			assertFalse(tweenSpy.called);
		}, config);
	};
	this.ScrollOffsetAnimationTest.prototype.testScrollElementToWithNoAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/scrolloffset']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = this.createScrollableDiv(device);

			queue.call("Wait for tween", function(callbacks) {
				var tweenSpy = this.sandbox.spy(device, '_tween');

				var onComplete = callbacks.add(function() {
					assertEquals(100, div.scrollLeft);
					assertEquals(200, div.scrollTop);
				});
				device.scrollElementTo(div, 100, 200, true, onComplete);
				assertFalse(tweenSpy.called);
			});
		}, config);
	};

	this.ScrollOffsetAnimationTest.prototype.testMoveElementToWithAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/scrolloffset']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

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
	this.ScrollOffsetAnimationTest.prototype.testMoveElementToWithAnimNoMovement = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/scrolloffset']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

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
	this.ScrollOffsetAnimationTest.prototype.testMoveElementToWithNoAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/scrolloffset']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

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

	this.ScrollOffsetAnimationTest.prototype.testHideElementWithAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/scrolloffset']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

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
	this.ScrollOffsetAnimationTest.prototype.testHideElementWithNoAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/scrolloffset']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

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

	this.ScrollOffsetAnimationTest.prototype.testShowElementWithAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/scrolloffset']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

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
	this.ScrollOffsetAnimationTest.prototype.testShowElementWithNoAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/scrolloffset']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

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
