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
	this.ApplicationEventsTest = AsyncTestCase("Application_Events");

	this.ApplicationEventsTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.ApplicationEventsTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};

 	this.ApplicationEventsTest.prototype.testBubbleEvent = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button", "antie/events/focusevent"],
				function(application, Button, FocusEvent) {
					var root = application.getRootWidget();
					var button = new Button();
					root.appendChildWidget(button);

					var onFocus = this.sandbox.stub();
					button.addEventListener('focus', onFocus);

					application.bubbleEvent(new FocusEvent(button));

					assert(onFocus.called);
				}
		);
	};

  	this.ApplicationEventsTest.prototype.testBroadcastEvent = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button", "antie/events/focusevent"],
				function(application, Button, FocusEvent) {
					var root = application.getRootWidget();
					var button = new Button();
					root.appendChildWidget(button);

					var onFocus = this.sandbox.stub();
					button.addEventListener('focus', onFocus);

					application.broadcastEvent(new FocusEvent(button));

					assert(onFocus.called);
				}
		);
	};

 	this.ApplicationEventsTest.prototype.testAddEventListener = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button", "antie/events/focusevent"],
				function(application, Button, FocusEvent) {
					var root = application.getRootWidget();
					var button = new Button();
					root.appendChildWidget(button);

					var onFocus = this.sandbox.stub();
					application.addEventListener('focus', onFocus);

					application.bubbleEvent(new FocusEvent(button));

					assertEquals(1, onFocus.callCount);
				}
		);
	};

 	this.ApplicationEventsTest.prototype.testRemoveEventListener = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/button", "antie/events/focusevent"],
				function(application, Button, FocusEvent) {
					var root = application.getRootWidget();
					var button = new Button();
					root.appendChildWidget(button);

					var onFocus = this.sandbox.stub();
					application.addEventListener('focus', onFocus);
					application.removeEventListener('focus', onFocus);

					application.bubbleEvent(new FocusEvent(button));

					assertFalse(onFocus.called);
				}
		);
	};

})();
