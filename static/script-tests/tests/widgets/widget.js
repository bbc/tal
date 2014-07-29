(function() {
	this.WidgetTest = AsyncTestCase("Widget");

	this.WidgetTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.WidgetTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};
	this.WidgetTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/widget","antie/class"],
			function(application, Widget, Class) {
				assertEquals('Widget should be a function', 'function', typeof Widget);
				assert('Widget should extend from Class', new Widget() instanceof Class);
		});
	};
 	this.WidgetTest.prototype.testRender = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/widget"],
				function(application, Widget) {
					var widget = new Widget();
					assertException(function() { widget.render(application.getDevice()); });
				}
		);
	};
 	this.WidgetTest.prototype.testAddClassHasClass = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/widget"],
				function(application, Widget) {
					var widget = new Widget();
					assertFalse(widget.hasClass('a'));
					widget.addClass('a');
					assert(widget.hasClass('a'));
				}
		);
	};
 	this.WidgetTest.prototype.testRemoveClassHasClass = function(queue) {
		expectAsserts(6);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/widget"],
				function(application, Widget) {
					var widget = new Widget();
					assertFalse(widget.hasClass('a'));
					assertFalse(widget.hasClass('b'));
					widget.addClass('a');
					widget.addClass('b');
					assert(widget.hasClass('a'));
					assert(widget.hasClass('b'));
					widget.removeClass('b');
					assert(widget.hasClass('a'));
					assertFalse(widget.hasClass('b'));
				}
		);
	};

	 this.WidgetTest.prototype.testGetClasses = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/widget"],
				function(application, Widget) {
					var widget = new Widget();
					widget.addClass('a');
					widget.addClass('b');
					assertEquals(['widget','a','b'], widget.getClasses());
				}
		);
	};

 	this.WidgetTest.prototype.testAddClassMultipleTimes = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/widget"],
				function(application, Widget) {
					var widget = new Widget();
					widget.addClass('a');
					widget.addClass('a');
					widget.addClass('a');
					widget.addClass('a');
					widget.addClass('b');
					assertEquals(['widget','a','b'], widget.getClasses());
				}
		);
	};

 	this.WidgetTest.prototype.testAddEventListener = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/widget", "antie/events/event"],
				function(application, Widget, Event) {
					var widget = new Widget();
					var handler = this.sandbox.stub();
					widget.addEventListener('anevent', handler);
					widget.fireEvent(new Event('anevent'));
					assert(handler.called);
				}
		);
	};

 	this.WidgetTest.prototype.testRemoveEventListener = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/widget", "antie/events/event"],
				function(application, Widget, Event) {
					var widget = new Widget();
					var handler = this.sandbox.stub();
					widget.addEventListener('anevent', handler);
					widget.removeEventListener('anevent', handler);
					widget.fireEvent(new Event('anevent'));
					assertFalse(handler.called);
				}
		);
	};

	this.WidgetTest.prototype.testBubbleEvent = function(queue) {
	   expectAsserts(3);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   ["antie/widgets/widget", "antie/events/event"],
			   function(application, Widget, Event) {
				   var widget = new Widget();
				   var parent = new Widget();
				   widget.parentWidget = parent;

				   var parentHandler = this.sandbox.stub();
				   parent.addEventListener('anevent', parentHandler);
				   var widgetHandler = this.sandbox.stub();
				   widget.addEventListener('anevent', widgetHandler);

				   widget.bubbleEvent(new Event('anevent'));

				   assert(widgetHandler.called);
				   assert(parentHandler.called);
				   assert(widgetHandler.calledBefore(parentHandler));
			   }
	   );
   };

 	this.WidgetTest.prototype.testBroadcastEvent = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/widget", "antie/events/event"],
				function(application, Widget, Event) {
					var widget = new Widget();
					var handler = this.sandbox.stub();
					widget.addEventListener('anevent', handler);
					widget.broadcastEvent(new Event('anevent'));
					assert(handler.called);
				}
		);
	};

 	this.WidgetTest.prototype.testIsFocusable = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/widget"],
				function(application, Widget) {
					var widget = new Widget();
					assertFalse(widget.isFocusable());
				}
		);
	};

 	this.WidgetTest.prototype.testGetCurrentApplication = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/widget"],
				function(application, Widget) {
					var widget = new Widget();
					assertSame(application, widget.getCurrentApplication());
				}
		);
	};

 	this.WidgetTest.prototype.testSetGetDataItem = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/widget"],
				function(application, Widget) {
					var dataItem = {hello:"world"};
					var widget = new Widget();
					assertNull(widget.getDataItem());
					widget.setDataItem(dataItem);
					assertSame(dataItem, widget.getDataItem());
				}
		);
	};

 	this.WidgetTest.prototype.testGetComponent = function(queue) {
		expectAsserts(1);

		// Uses subclass of Widget as we must use a renderable widget.
		queuedComponentInit(
				queue,
				"fixtures/components/emptycomponent",
				null,
				["antie/widgets/container"],
				function(application, container, Container) {
					queue.call("Waiting for components to show", function(callbacks) {
						var performAsserts = callbacks.add(function(evt) {
							var widget = new Container();
							evt.component.appendChildWidget(widget);
							assertSame(evt.component, widget.getComponent());
						});
						container.addEventListener('beforerender', performAsserts);
					});
				}
		);
	};

 	this.WidgetTest.prototype.testRemoveFocus = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/widget"],
				function(application, Widget) {
					var widget = new Widget();
					widget._isFocussed = true;
					widget.addClass('focus');
					widget.removeFocus();
					assertFalse(widget.hasClass('focus'));
					assertFalse(widget._isFocussed);
				}
		);
	};
})();
