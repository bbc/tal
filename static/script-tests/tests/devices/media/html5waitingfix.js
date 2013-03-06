/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */

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
