(function() {
	this.CSS3AnimationTest = AsyncTestCase("Animation (CSS3)");

	this.CSS3AnimationTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
		this.div = null;
	};

	this.CSS3AnimationTest.prototype.tearDown = function() {
		this.sandbox.restore();
		if(this.div) {
			this.div.parentNode.removeChild(this.div);
		}
	};

 	this.CSS3AnimationTest.prototype.createScrollableDiv = function(device) {
		this.div = device.createContainer("id_mask");
		document.body.appendChild(this.div);
		this.div.style.overflow = "hidden";
		this.div.style.width = "10px";
		this.div.style.height = "10px";
		this.div.style.position = "absolute";
		var inner = device.createContainer("id");
		inner.style.position = "absolute";
		inner.style.top = 0;
		inner.style.left = 0;
		inner.style.width = "1000px";
		inner.style.height = "1000px";
		device.appendChildElement(this.div, inner);

		return inner;
	}

	this.CSS3AnimationTest.prototype.getTranslation = function(el) {
		var regexp = /-?transform:\s*translate(3d)?\(([-0-9]+)[^,]*,\s*([-0-9]+)/;
		var match = regexp.exec(el.style.cssText);
		if(match) {
			return {left:parseInt(match[2]), top:parseInt(match[3])};
		}
		return {left:0, top:0};
	}

	this.CSS3AnimationTest.prototype.testScrollElementToWithAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/css3']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var inner = this.createScrollableDiv(device);

			queue.call("Wait for tween", function(callbacks) {
				var addClassSpy = this.sandbox.spy(device, 'addClassToElement');

				var onComplete = callbacks.add(function() {
					var translation = this.getTranslation(inner);
					assertEquals(-100, translation.left);
					assertEquals(-200, translation.top);
				});

				device.scrollElementTo(this.div, 100, 200, false, onComplete);
				assert(addClassSpy.called);
			});
		}, config);
	};

	this.CSS3AnimationTest.prototype.testScrollElementToWithNoAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/css3']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var inner = this.createScrollableDiv(device);

			queue.call("Wait for tween", function(callbacks) {
				var addClassSpy = this.sandbox.spy(device, 'addClassToElement');

				var onComplete = callbacks.add(function() {
					var translation = this.getTranslation(inner);
					assertEquals(-100, translation.left);
					assertEquals(-200, translation.top);
				});
				device.scrollElementTo(this.div, 100, 200, true, onComplete);
				assertFalse(addClassSpy.called);
			});
		}, config);
	};

	this.CSS3AnimationTest.prototype.testMoveElementToWithAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/css3']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			this.createScrollableDiv(device);

			queue.call("Wait for tween", function(callbacks) {
				var addClassSpy = this.sandbox.spy(device, 'addClassToElement');

				var onComplete = callbacks.add(function() {
					var translation = this.getTranslation(this.div);
					assertEquals(100, translation.left);
					assertEquals(200, translation.top);
				});
				device.moveElementTo(this.div, 100, 200, false, onComplete);
				assert(addClassSpy.called);
			});
		}, config);
	};

	this.CSS3AnimationTest.prototype.testMoveElementToWithNoAnim = function(queue) {
		expectAsserts(3);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/css3']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			this.createScrollableDiv(device);

			queue.call("Wait for tween", function(callbacks) {
				var addClassSpy = this.sandbox.spy(device, 'addClassToElement');

				var onComplete = callbacks.add(function() {
					var translation = this.getTranslation(this.div);
					assertEquals(100, translation.left);
					assertEquals(200, translation.top);
				});
				device.moveElementTo(this.div, 100, 200, true, onComplete);
				assertFalse(addClassSpy.called);
			});
		}, config);
	};

	this.CSS3AnimationTest.prototype.testHideElementWithAnim = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/css3']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			this.createScrollableDiv(device);

			queue.call("Wait for tween", function(callbacks) {
				var onComplete = callbacks.add(function() {
					assertEquals("hidden", this.div.style.visibility);
					assertEquals(0, Math.round(parseFloat(this.div.style.opacity)));
				});
				device.hideElement(this.div, false, onComplete);
			});
		}, config);
	};
	this.CSS3AnimationTest.prototype.testHideElementWithNoAnim = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/css3']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			this.createScrollableDiv(device);

			queue.call("Wait for tween", function(callbacks) {
				var onComplete = callbacks.add(function() {
					assertEquals("hidden", this.div.style.visibility);
					assertEquals(0, Math.round(parseFloat(this.div.style.opacity)));
				});
				device.hideElement(this.div, true, onComplete);
			});
		}, config);
	};

	this.CSS3AnimationTest.prototype.testShowElementWithAnim = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/css3']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			this.createScrollableDiv(device);

			queue.call("Wait for tween", function(callbacks) {
				var onComplete = callbacks.add(function() {
					assertEquals("visible", this.div.style.visibility);
					assertEquals(1, Math.round(parseFloat(this.div.style.opacity)));
				});
				device.showElement(this.div, false, onComplete);
			});
		}, config);
	};
	this.CSS3AnimationTest.prototype.testShowElementWithNoAnim = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/css3']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			this.createScrollableDiv(device);

			queue.call("Wait for tween", function(callbacks) {
				var onComplete = callbacks.add(function() {
					assertEquals("visible", this.div.style.visibility);
					assertEquals(1, Math.round(parseFloat(this.div.style.opacity)));
				});
				device.showElement(this.div, true, onComplete);
			});
		}, config);
	};
})();
