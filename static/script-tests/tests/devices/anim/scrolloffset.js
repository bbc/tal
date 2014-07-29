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

	this.ScrollOffsetAnimationTest.prototype.testScrollElementToWithAnimNoMovement = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/scrolloffset']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = this.createScrollableDiv(device);

			div.scrollTop = 200;
			div.scrollLeft = 100;

			var tweenSpy = this.sandbox.spy(device, '_tween');
			device.scrollElementTo({
				el: div,
				to: {
					left: 100,
					top: 200
				},
				skipAnim: true
			});
			assertFalse(tweenSpy.called);
		}, config);
	};
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
				device.scrollElementTo({
					el: div,
					to: {
						left: 100,
						top: 200
					},
					skipAnim: false,
					onComplete: onComplete
				});
				assert(tweenSpy.called);
			});
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
				device.scrollElementTo({
					el: div,
					to: {
						left: 100,
						top: 200
					},
					skipAnim: true,
					onComplete: onComplete
				});
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
				device.moveElementTo({
					el: div,
					to: {
						left: 100,
						top: 200
					},
					skipAnim: false,
					onComplete: onComplete
				});
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

			div.style.left = "100px";
			div.style.top = "200px";

			var tweenSpy = this.sandbox.spy(device, '_tween');
			device.moveElementTo({
				el: div,
				to: {
					left: 100,
					top: 200
				}
			});
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
				device.moveElementTo({
					el: div,
					to: {
						left: 100,
						top: 200
					},
					skipAnim: true,
					onComplete: onComplete
				});
				assertFalse(tweenSpy.called);
			});
		}, config);
	};

	this.ScrollOffsetAnimationTest.prototype.testMoveElementToWithNoLeftValue = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/scrolloffset']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = device.createContainer("id");

			queue.call("Wait for tween", function(callbacks) {
				var tweenSpy = this.sandbox.spy(device, '_tween');

				var onComplete = callbacks.add(function() {
					assertEquals(0, Math.round(parseFloat(div.style.left.replace(/px$/,''))));
					assertEquals(200, Math.round(parseFloat(div.style.top.replace(/px$/,''))));
				});
				device.moveElementTo({
					el: div,
					to: {
						top: 200
					},
					skipAnim: true,
					onComplete: onComplete
				});
				assertFalse(tweenSpy.called);
			});
		}, config);
	};

	this.ScrollOffsetAnimationTest.prototype.testMoveElementToWithNoTopValue = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/scrolloffset']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = device.createContainer("id");

			queue.call("Wait for tween", function(callbacks) {
				var tweenSpy = this.sandbox.spy(device, '_tween');

				var onComplete = callbacks.add(function() {
					assertEquals(100, Math.round(parseFloat(div.style.left.replace(/px$/,''))));
					assertEquals(0, Math.round(parseFloat(div.style.top.replace(/px$/,''))));
				});
				device.moveElementTo({
					el: div,
					to: {
						left: 100
					},
					skipAnim: true,
					onComplete: onComplete
				});
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
				device.hideElement({
					el: div,
					skipAnim: false,
					onComplete: onComplete
				});
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
				device.hideElement({
					el: div,
					skipAnim: true,
					onComplete: onComplete
				});
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
				device.showElement({
					el: div,
					skipAnim: false,
					onComplete: onComplete
				});
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
				device.showElement({
					el: div,
					skipAnim: true,
					onComplete: onComplete
				});
				assertFalse(tweenSpy.called);
			});
		}, config);
	};
})();
