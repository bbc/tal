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
	this.TweenAnimationTest = AsyncTestCase("Animation (Tween)");

	this.TweenAnimationTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.TweenAnimationTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};

	this.TweenAnimationTest.prototype.testTween = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

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
				device._tween({
					el: div,
					style: div.style,
					from: {
						top:"0px"
					},
					to: {
						top:"100px"
					},
					className: null,
					onComplete: onComplete,
					onStart: onStart
				});
			});
		}, config);
	};

	this.TweenAnimationTest.prototype.testTweenClasses = function(queue) {
		expectAsserts(2);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":['antie/devices/data/json2','antie/devices/anim/styletopleft']},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

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
				device._tween({
					el: div,
					style: div.style,
					from: {
						top:"0px"
					},
					to: {
						top:"100px"
					},
					className: "testing",
					onComplete: onComplete,
					onStart: onStart
				});
			});
		}, config);
	};
})();
