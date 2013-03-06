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
	this.HorizontalListTest = AsyncTestCase("HorizontalList");

	this.HorizontalListTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.HorizontalListTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};
	this.HorizontalListTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/horizontallist","antie/widgets/list"],
			function(application, HorizontalList, List) {
				assertEquals('HorizontalList should be a function', 'function', typeof HorizontalList);
				assert('HorizontalList should extend from List', new HorizontalList() instanceof List);
		});
	};
 	this.HorizontalListTest.prototype.testRender = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontallist", "antie/widgets/list"],
				function(application, HorizontalList, List) {
					var widget = new HorizontalList("id");
					widget.setRenderMode(List.RENDER_MODE_CONTAINER);

					var device = application.getDevice();
					var listRenderSpy = this.sandbox.spy(List.prototype, 'render');
					widget.render(device);
					assert(listRenderSpy.called);
				}
		);
	};
 	this.HorizontalListTest.prototype.testNavigation = function(queue) {
		expectAsserts(7);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontallist", "antie/widgets/list", "antie/widgets/button", "antie/events/keyevent"],
				function(application, HorizontalList, List, Button, KeyEvent) {
					var list = new HorizontalList("id");
					list.setRenderMode(List.RENDER_MODE_CONTAINER);
					var button1 = new Button();
					list.appendChildWidget(button1);
					var button2 = new Button();
					list.appendChildWidget(button2);
					var button3 = new Button();
					list.appendChildWidget(button3);

					assertSame("1", button1, list.getActiveChildWidget());
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_LEFT));
					assertSame("2", button1, list.getActiveChildWidget());
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_RIGHT));
					assertSame("3", button2, list.getActiveChildWidget());
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_RIGHT));
					assertSame("4", button3, list.getActiveChildWidget());
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_RIGHT));
					assertSame("5", button3, list.getActiveChildWidget());
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_UP));
					assertSame("6", button3, list.getActiveChildWidget());
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_DOWN));
					assertSame("7", button3, list.getActiveChildWidget());
				}
		);
	};
	
	this.HorizontalListTest.prototype.testNavigationWrapped = function(queue) {
		expectAsserts(8);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/horizontallist", "antie/widgets/list", "antie/widgets/button", "antie/events/keyevent"],
				function(application, HorizontalList, List, Button, KeyEvent) {
					var list = new HorizontalList("id");
					list.setRenderMode(List.RENDER_MODE_CONTAINER);
					list.setWrapMode( HorizontalList.WRAP_MODE_WRAP );
					
					var button1 = new Button();
					list.appendChildWidget(button1);
					var button2 = new Button();
					list.appendChildWidget(button2);
					var button3 = new Button();
					list.appendChildWidget(button3);

					//button1 should be selected
					assertSame("1", button1, list.getActiveChildWidget());
					
					//move left - assert list has wrapped to button3
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_LEFT));
					assertSame("2", button3, list.getActiveChildWidget());
					
					//move right - assert list has wrapped back to button1
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_RIGHT));
					assertSame("3", button1, list.getActiveChildWidget());
					
					//move right - assert list has button2 selected
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_RIGHT));
					assertSame("4", button2, list.getActiveChildWidget());
					
					//move right - assert list has button3 selected
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_RIGHT));
					assertSame("5", button3, list.getActiveChildWidget());
					
					//move right - assert list has wrapped to button1
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_RIGHT));
					assertSame("6", button1, list.getActiveChildWidget());
					
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_UP));
					assertSame("7", button1, list.getActiveChildWidget());
					
					list.bubbleEvent(new KeyEvent("keydown", KeyEvent.VK_DOWN));
					assertSame("8", button1, list.getActiveChildWidget());
				}
		);
	};
})();