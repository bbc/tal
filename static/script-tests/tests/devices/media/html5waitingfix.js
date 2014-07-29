(function() {

	this.HTML5WaitingEventFix = AsyncTestCase("HTML5 (Waiting Event Fix)");

	this.HTML5WaitingEventFix.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.HTML5WaitingEventFix.prototype.tearDown = function() {
		this.sandbox.restore();
	};

	this.HTML5WaitingEventFix.prototype.testWaitingEventIsFiredWhenNoTimeUpdateFiredWithinASecondAndVideoIsPlaying = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5", "antie/devices/media/html5waitingfix"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/class", "antie/events/mediaevent"], function(application, Class, MediaEvent) {

			var MockTimeUpdateEventSource = Class.extend({
				init: function(player) {
					this.player = player;
				},
				start: function() {
					var self = this;
					this.timeupdateInterval = window.setInterval(function() {
						self.player.fireEvent(new MediaEvent("timeupdate"));
					}, 100);
				},
				stall: function() {
					window.clearInterval(this.timeupdateInterval);
				},
				pause: function() {
					window.clearInterval(this.timeupdateInterval);
					this.player.fireEvent(new MediaEvent("pause"));
				},
				end: function() {
					window.clearInterval(this.timeupdateInterval);
					this.player.fireEvent(new MediaEvent("ended"));
				}
			});

			var player = application.getDevice().createPlayer("player", "video");
			var eventSource = new MockTimeUpdateEventSource(player);
			var hadWaitingEvent = false;

			player.addEventListener('waiting', function() {
				hadWaitingEvent = true;
			});

			eventSource.start();

			queue.call('Play for 1 second', function(callbacks) {
				window.setTimeout(callbacks.add(function() {

					eventSource.stall();

					queue.call('Wait for another second', function(callbacks) {
						var callback = callbacks.add(function() {
							assert('Waiting event has been fired', hadWaitingEvent);
						});
						setTimeout(callback, 1000);
					});

				}), 1000);

			});

		}, config);
	};

	this.HTML5WaitingEventFix.prototype.testWaitingEventIsNotFiredWhenNoTimeUpdateFiredWithinASecondAndVideoIsPaused = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5", "antie/devices/media/html5waitingfix"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/class", "antie/events/mediaevent"], function(application, Class, MediaEvent) {

			var MockTimeUpdateEventSource = Class.extend({
				init: function(player) {
					this.player = player;
				},
				start: function() {
					var self = this;
					this.timeupdateInterval = window.setInterval(function() {
						self.player.fireEvent(new MediaEvent("timeupdate"));
					}, 100);
				},
				stall: function() {
					window.clearInterval(this.timeupdateInterval);
				},
				pause: function() {
					window.clearInterval(this.timeupdateInterval);
					this.player.fireEvent(new MediaEvent("pause"));
				},
				end: function() {
					window.clearInterval(this.timeupdateInterval);
					this.player.fireEvent(new MediaEvent("ended"));
				}
			});

			var player = application.getDevice().createPlayer("player", "video");
			var eventSource = new MockTimeUpdateEventSource(player);
			var hadWaitingEvent = false;

			player.addEventListener('waiting', function() {
				hadWaitingEvent = true;
			});

			eventSource.start();

			queue.call('Play for 1 second', function(callbacks) {
				window.setTimeout(callbacks.add(function() {

					eventSource.pause();

					queue.call('Wait for another second', function(callbacks) {
						var callback = callbacks.add(function() {
							assertFalse('Waiting event has not been fired', hadWaitingEvent);
						});
						setTimeout(callback, 1000);
					});

				}), 1000);

			});

		}, config);
	};

	this.HTML5WaitingEventFix.prototype.testWaitingEventIsNotFiredWhenNoTimeUpdateFiredWithinASecondAndVideoIsStopped = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/html5", "antie/devices/media/html5waitingfix"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", ["antie/class", "antie/events/mediaevent"], function(application, Class, MediaEvent) {

			var MockTimeUpdateEventSource = Class.extend({
				init: function(player) {
					this.player = player;
				},
				start: function() {
					var self = this;
					this.timeupdateInterval = window.setInterval(function() {
						self.player.fireEvent(new MediaEvent("timeupdate"));
					}, 100);
				},
				stall: function() {
					window.clearInterval(this.timeupdateInterval);
				},
				pause: function() {
					window.clearInterval(this.timeupdateInterval);
					this.player.fireEvent(new MediaEvent("pause"));
				},
				end: function() {
					window.clearInterval(this.timeupdateInterval);
					this.player.fireEvent(new MediaEvent("ended"));
				}
			});

			var player = application.getDevice().createPlayer("player", "video");
			var eventSource = new MockTimeUpdateEventSource(player);
			var hadWaitingEvent = false;

			player.addEventListener('waiting', function() {
				hadWaitingEvent = true;
			});

			eventSource.start();

			queue.call('Play for 1 second', function(callbacks) {
				window.setTimeout(callbacks.add(function() {

					eventSource.end();

					queue.call('Wait for another second', function(callbacks) {
						var callback = callbacks.add(function() {
							assertFalse('Waiting event has not been fired', hadWaitingEvent);
						});
						setTimeout(callback, 1000);
					});

				}), 1000);

			});

		}, config);
	};

})();
