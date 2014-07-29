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
})();