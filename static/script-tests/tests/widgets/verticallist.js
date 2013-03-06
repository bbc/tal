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
	this.VerticalListTest = AsyncTestCase("VerticalList");

	this.VerticalListTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.VerticalListTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};
	this.VerticalListTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/verticallist","antie/widgets/list"],
			function(application, VerticalList, List) {
				assertEquals('VerticalList should be a function', 'function', typeof VerticalList);
				assert('VerticalList should extend from List', new VerticalList() instanceof List);
		});
	};
 	this.VerticalListTest.prototype.testRender = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/verticallist", "antie/widgets/list"],
				function(application, VerticalList, List) {
					var widget = new VerticalList("id");
					widget.setRenderMode(List.RENDER_MODE_CONTAINER);

					var device = application.getDevice();
					var listRenderSpy = this.sandbox.spy(List.prototype, 'render');
					widget.render(device);
					assert(listRenderSpy.called);
				}
		);
	};
 	this.VerticalListTest.prototype.testNavigation = function(queue) {
		expectAsserts(7);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/verticallist", "antie/widgets/list", "antie/widgets/button", "antie/events/keyevent"],
				function(application, VerticalList, List, Button, KeyEvent) {
					var list = new VerticalList("id");
					list.setRenderMode(List.RENDER_MODE_CONTAINER);
					var button1 = new Button();
					list.appendChildWidget(button1);
					var button2 = new Button();
					list.appendChildWidget(button2);
					var button3 = new Button();
					list.appendChildWidget(button3);

					assertSame("1", button1, list.getActiveChildWidget());
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_UP));
					assertSame("2", button1, list.getActiveChildWidget());
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_DOWN));
					assertSame("3", button2, list.getActiveChildWidget());
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_DOWN));
					assertSame("4", button3, list.getActiveChildWidget());
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_DOWN));
					assertSame("5", button3, list.getActiveChildWidget());
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_LEFT));
					assertSame("6", button3, list.getActiveChildWidget());
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_RIGHT));
					assertSame("7", button3, list.getActiveChildWidget());
				}
		);
	};
})();