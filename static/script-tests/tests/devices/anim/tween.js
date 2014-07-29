(function() {
	this.TweenAnimationTest = AsyncTestCase("Animation (Tween)");

	this.TweenAnimationTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.TweenAnimationTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};

	this.TweenAnimationTest.prototype.testTween = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/scrolloffset']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = device.createContainer();

			queue.call("Wait for tween", function(callbacks) {
				var onStart = function() {
					assertEquals(0, Math.round(parseFloat(div.style.top.replace(/px$/,''))));
				};
				var onComplete = callbacks.add(function() {
					assertEquals(100, Math.round(parseFloat(div.style.top.replace(/px$/,''))));
				});
				device._tween(div, div.style, {top:"0px"}, {top:"100px"}, null, onComplete, onStart);
			});
		}, config);
	};

	this.TweenAnimationTest.prototype.testTweenClasses = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/scrolloffset']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
			var device = application.getDevice();
			var div = device.createContainer();

			queue.call("Wait for tween", function(callbacks) {
				var onStart = function() {
					assertClassName("testing", div);
				};
				var onComplete = callbacks.add(function() {
					assertClassName("nottesting", div);
				});
				device._tween(div, div.style, {top:"0px"}, {top:"100px"}, "testing", onComplete, onStart);
			});
		}, config);
	};
})();
