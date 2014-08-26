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
	this.ContainerTest = AsyncTestCase("Container");

	this.ContainerTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.ContainerTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};
	this.ContainerTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/container","antie/widgets/widget"],
			function(application, Container, Widget) {
				assertEquals('Container should be a function', 'function', typeof Container);
				assert('Container should extend from Widget', new Container() instanceof Widget);
		});
	};
 	this.ContainerTest.prototype.testRender = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var device = application.getDevice();
					var createContainerSpy = this.sandbox.spy(device, 'createContainer');
					var el = widget.render(device);
					assert(createContainerSpy.called);
					assertEquals(typeof device.createContainer(), typeof el);
					assertEquals("id", el.id);
					assertClassName("container", el);
				}
		);
	};
 	this.ContainerTest.prototype.testRenderDeep = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					widget.appendChildWidget(inner);

					var innerRenderSpy = this.sandbox.spy(inner, 'render');
					widget.render(application.getDevice());
					assert(innerRenderSpy.called);
				}
		);
	};

 	this.ContainerTest.prototype.testAppendChildWidget = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					assertEquals(0, widget.getChildWidgetCount());
					widget.appendChildWidget(inner);
					assertEquals(1, widget.getChildWidgetCount());
					assertEquals([inner], widget.getChildWidgets());
				}
		);
	};

 	this.ContainerTest.prototype.testAppendChildWidgetDuplicate = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					assertEquals(0, widget.getChildWidgetCount());
					widget.appendChildWidget(inner);
					widget.appendChildWidget(inner);
					assertEquals(1, widget.getChildWidgetCount());
					assertEquals([inner], widget.getChildWidgets());
				}
		);
	};
 	this.ContainerTest.prototype.testAppendChildWidgetOrder = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					var inner2 = new Container("inner2");
					var inner3 = new Container("inner3");
					var inner4 = new Container("inner4");
					assertEquals(0, widget.getChildWidgetCount());
					widget.appendChildWidget(inner);
					widget.appendChildWidget(inner2);
					widget.appendChildWidget(inner3);
					widget.appendChildWidget(inner4);
					widget.appendChildWidget(inner3);
					assertEquals([inner, inner2, inner3, inner4], widget.getChildWidgets());
				}
		);
	};
 	this.ContainerTest.prototype.testAppendChildWidgetSetActiveContainer = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					var inner2 = new Container("inner2");
					var setActiveChildWidgetSpy = this.sandbox.spy(widget, 'setActiveChildWidget');
					widget.appendChildWidget(inner);
					assert(setActiveChildWidgetSpy.calledOnce);
					widget.appendChildWidget(inner2);
					assert(setActiveChildWidgetSpy.calledTwice);
				}
		);
	};
 	this.ContainerTest.prototype.testAppendChildWidgetSetActiveButton = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var widget = new Container("id");
					var inner = new Button("inner");
					var inner2 = new Button("inner2");
					var setActiveChildWidgetSpy = this.sandbox.spy(widget, 'setActiveChildWidget');
					widget.appendChildWidget(inner);
					assert(setActiveChildWidgetSpy.calledOnce);
					widget.appendChildWidget(inner2);
					assert(setActiveChildWidgetSpy.calledOnce);
				}
		);
	};
 	this.ContainerTest.prototype.testPrependChildWidgetOrder = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					var inner2 = new Container("inner2");
					var inner3 = new Container("inner3");
					var inner4 = new Container("inner4");
					assertEquals(0, widget.getChildWidgetCount());
					widget.appendChildWidget(inner2); //0
					widget.appendChildWidget(inner3); //1
					widget.appendChildWidget(inner4); //2
					inner4.prependWidget(inner);
					assertEquals([inner2, inner3, inner, inner4], widget.getChildWidgets());
				}
		);
	};
	this.ContainerTest.prototype.testPrependChildWidgetOrderWhenNotExpectingPenultimateInsertion = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(
                queue,
                "lib/mockapplication",
                ["antie/widgets/container"],
                function(application, Container) {
                    var widget = new Container("id");
                    var inner = new Container("inner");
                    var inner2 = new Container("inner2");
                    var inner3 = new Container("inner3");
                    var inner4 = new Container("inner4");
                    assertEquals(0, widget.getChildWidgetCount());
                    widget.appendChildWidget(inner2); //0
                    widget.appendChildWidget(inner3); //1
                    widget.appendChildWidget(inner4); //2
                    inner3.prependWidget(inner);
                    assertEquals([inner2, inner, inner3, inner4], widget.getChildWidgets());
                }
        );
    };
 	this.ContainerTest.prototype.testInsertChildWidgetAtStart = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					var inner2 = new Container("inner2");
					assertEquals(0, widget.getChildWidgetCount());
					widget.appendChildWidget(inner);
					widget.insertChildWidget(0, inner2);
					assertEquals([inner2, inner], widget.getChildWidgets());
				}
		);
	};
 	this.ContainerTest.prototype.testInsertChildWidgetAtEnd = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					var inner2 = new Container("inner2");
					assertEquals(0, widget.getChildWidgetCount());
					widget.appendChildWidget(inner);
					widget.insertChildWidget(1, inner2);
					assertEquals([inner, inner2], widget.getChildWidgets());
				}
		);
	};
 	this.ContainerTest.prototype.testInsertChildWidgetInTheMiddle = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					var inner2 = new Container("inner2");
					var inner3 = new Container("inner3");
					assertEquals(0, widget.getChildWidgetCount());
					widget.appendChildWidget(inner);
					widget.appendChildWidget(inner2);
					widget.insertChildWidget(1, inner3);
					assertEquals([inner, inner3, inner2], widget.getChildWidgets());
				}
		);
	};
 	this.ContainerTest.prototype.testRemoveChildWidgets = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					widget.appendChildWidget(new Container());
					assertEquals(1, widget.getChildWidgetCount());
					widget.removeChildWidgets();
					assertEquals(0, widget.getChildWidgetCount());
				}
		);
	};
 	this.ContainerTest.prototype.testRemoveChildWidgetsWhenEmpty = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					assertEquals(0, widget.getChildWidgetCount());
					widget.removeChildWidgets();
					assertEquals(0, widget.getChildWidgetCount());
				}
		);
	};
 	this.ContainerTest.prototype.testRemoveChildWidgetToEmpty = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					assertEquals(0, widget.getChildWidgetCount());
					widget.appendChildWidget(inner);
					assertEquals(1, widget.getChildWidgetCount());
					widget.removeChildWidget(inner);
					assertEquals(0, widget.getChildWidgetCount());
				}
		);
	};
 	this.ContainerTest.prototype.testRemoveChildWidget = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					var inner2 = new Container("inner2");
					assertEquals(0, widget.getChildWidgetCount());
					widget.appendChildWidget(inner);
					widget.appendChildWidget(inner2);
					assertEquals(2, widget.getChildWidgetCount());
					widget.removeChildWidget(inner);
					assertEquals([inner2], widget.getChildWidgets());
				}
		);
	};
 	this.ContainerTest.prototype.testHasChildWidget = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					var inner2 = new Container("inner2");
					assertEquals(0, widget.getChildWidgetCount());
					widget.appendChildWidget(inner);
					assert(widget.hasChildWidget("inner"));
					assertFalse(widget.hasChildWidget("inner2"));
				}
		);
	};
 	this.ContainerTest.prototype.testGetChildWidget = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					var inner2 = new Container("inner2");
					assertEquals(0, widget.getChildWidgetCount());
					widget.appendChildWidget(inner);
					assertSame(inner, widget.getChildWidget("inner"));
					assertUndefined(widget.getChildWidget("inner2"));
				}
		);
	};
 	this.ContainerTest.prototype.testGetChildWidgets = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					var inner2 = new Container("inner2");
					assertEquals(0, widget.getChildWidgetCount());
					widget.appendChildWidget(inner);
					widget.appendChildWidget(inner2);
					assertEquals([inner, inner2], widget.getChildWidgets());
				}
		);
	};
 	this.ContainerTest.prototype.testGetIndexOfChildWidget = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					var inner2 = new Container("inner2");
					var inner3 = new Container("inner2");
					assertEquals(0, widget.getChildWidgetCount());
					widget.appendChildWidget(inner);
					widget.appendChildWidget(inner2);
					assertEquals(0, widget.getIndexOfChildWidget(inner));
					assertEquals(1, widget.getIndexOfChildWidget(inner2));
					assertEquals(-1, widget.getIndexOfChildWidget(inner3));
				}
		);
	};
 	this.ContainerTest.prototype.testSetActiveChildWidgetToNonFocusableWidget = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					widget.appendChildWidget(inner);
					widget.setActiveChildWidget(inner);
					assertNull(widget.getActiveChildWidget());
				}
		);
	};
 	this.ContainerTest.prototype.testSetActiveChildWidgetToFocusableWidget = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var widget = new Container("id");
					var inner = new Button("inner");
					var inner2 = new Button("inner2");
					widget.appendChildWidget(inner);
					widget.appendChildWidget(inner2);
					assertNotSame(inner2, widget.getActiveChildWidget());
					widget.setActiveChildWidget(inner2);
					assertSame(inner2, widget.getActiveChildWidget());
				}
		);
	};
 	this.ContainerTest.prototype.testSetActiveChildWidgetToFocusableWidgetChangesActiveClasses = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var widget = new Container("id");
					var inner = new Button("inner");
					var inner2 = new Button("inner2");
					widget.appendChildWidget(inner);
					widget.appendChildWidget(inner2);
					assert(inner.hasClass('active'));
					assertFalse(inner2.hasClass('active'));

					widget.setActiveChildWidget(inner2);
					assert(inner2.hasClass('active'));
					assertFalse(inner.hasClass('active'));
				}
		);
	};
  	this.ContainerTest.prototype.testSetActiveChildWidgetOfNonFocusedWidget = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var widget = new Container("id");
					var inner = new Button("inner");
					var inner2 = new Button("inner2");
					widget._isFocussed = false;

					widget.appendChildWidget(inner);
					widget.appendChildWidget(inner2);
					assertFalse(inner.hasClass('focus'));
					assertFalse(inner2.hasClass('focus'));

					widget.setActiveChildWidget(inner2);
					assertFalse(inner2.hasClass('focus'));
					assertFalse(inner.hasClass('focus'));
				}
		);
	};
  	this.ContainerTest.prototype.testSetActiveChildWidgetOfFocusedWidgetToFocusableWidgetChangesFocusClasses = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var widget = new Container("id");
					var inner = new Button("inner");
					var inner2 = new Button("inner2");
					widget._isFocussed = true;

					widget.appendChildWidget(inner);
					widget.appendChildWidget(inner2);
					assert(inner.hasClass('focus'));
					assertFalse(inner2.hasClass('focus'));

					widget.setActiveChildWidget(inner2);
					assert(inner2.hasClass('focus'));
					assertFalse(inner.hasClass('focus'));
				}
		);
	};
 	this.ContainerTest.prototype.testSetActiveChildIndex = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var widget = new Container("id");
					var inner = new Button("inner");
					var inner2 = new Button("inner2");
					widget.appendChildWidget(inner);
					widget.appendChildWidget(inner2);

					var setActiveChildWidgetSpy = this.sandbox.spy(widget, 'setActiveChildWidget');
					widget.setActiveChildIndex(1);
					assert(setActiveChildWidgetSpy.calledWithExactly(inner2));
				}
		);
	};
 	this.ContainerTest.prototype.testSetActiveChildIndexInvalidIndex = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					widget.appendChildWidget(new Container());
					widget.appendChildWidget(new Container());
					assertException(function() { widget.setActiveChildIndex(-1); });
					assertException(function() { widget.setActiveChildIndex(999); });
				}
		);
	};
 	this.ContainerTest.prototype.testGetChildWidgetCount = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					assertEquals(0, widget.getChildWidgetCount());
					widget.appendChildWidget(new Container());
					assertEquals(1, widget.getChildWidgetCount());
					widget.appendChildWidget(new Container());
					assertEquals(2, widget.getChildWidgetCount());
					widget.appendChildWidget(new Container());
					widget.appendChildWidget(new Container());
					assertEquals(4, widget.getChildWidgetCount());
				}
		);
	};

 	this.ContainerTest.prototype.testIsNotFocusableWithoutChildButton = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					widget.appendChildWidget(new Container());
					assertFalse(widget.isFocusable())
				}
		);
	};

 	this.ContainerTest.prototype.testIsFocusableWithChildButton = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var widget = new Container("id");
					widget.appendChildWidget(new Button());
					assert(widget.isFocusable())
				}
		);
	};

 	this.ContainerTest.prototype.testIsFocusableWithDescendantButton = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var widget = new Container("id");
					var innerContainer = new Container("inner");
					innerContainer.appendChildWidget(new Button());
					widget.appendChildWidget(innerContainer);
					assert(widget.isFocusable())
				}
		);
	};
 	this.ContainerTest.prototype.testSetAutoRenderChildrenTrue = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					widget.setAutoRenderChildren(true);
					widget.render(application.getDevice());

					var innerRenderSpy = this.sandbox.spy(inner, 'render');
					widget.appendChildWidget(inner);
					assert(innerRenderSpy.called);
				}
		);
	};
 	this.ContainerTest.prototype.testSetAutoRenderChildrenTrue = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {
					var widget = new Container("id");
					var inner = new Container("inner");
					widget.setAutoRenderChildren(false);
					widget.render(application.getDevice());

					var innerRenderSpy = this.sandbox.spy(inner, 'render');
					widget.appendChildWidget(inner);
					assertFalse(innerRenderSpy.called);
				}
		);
	};
	this.ContainerTest.prototype.testBroadcastEventBroadcastsToAllChildren = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/events/event"],
				function(application, Container, Event) {
					var widget = new Container("id");
					var inner = new Container("inner");
					var inner2 = new Container("inner2");
					widget.appendChildWidget(inner);
					widget.appendChildWidget(inner2);
					var innerBroadcastEventSpy = this.sandbox.spy(inner, 'broadcastEvent');
					var inner2BroadcastEventSpy = this.sandbox.spy(inner2, 'broadcastEvent');

					var evt = new Event('testevent');
					widget.broadcastEvent(evt);

					assert(innerBroadcastEventSpy.calledWith(evt));
					assert(inner2BroadcastEventSpy.calledWith(evt));
					assert(innerBroadcastEventSpy.calledBefore(inner2BroadcastEventSpy));
				}
		);
	};

	this.ContainerTest.prototype.testApplicationKeepsTrackOfFocusWhenFocusEventPropagationIsStoppedExplicitly = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var root = new Container("root");
					application.setRootWidget(root);

					var container = new Container("container");
					root.appendChildWidget(container);
					container.addEventListener("focus", function(evt) {
						evt.stopPropagation();
					});

					var button = new Button("button");
					container.appendChildWidget(button);

					button.focus();

					assertSame(button, application.getFocussedWidget());
				}
		);
	};

	this.ContainerTest.prototype.testApplicationKeepsTrackOfFocusWhenFocusEventPropagationIsStoppedViaTreeManipulation = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var root = new Container("root");
					application.setRootWidget(root);

					var container = new Container("container");
					root.appendChildWidget(container);
					container.addEventListener("focus", function(evt) {
						root.removeChildWidget(container);
					});

					var button = new Button("button");
					container.appendChildWidget(button);

					button.focus();

					assertSame(button, application.getFocussedWidget());
				}
		);
	};

	this.ContainerTest.prototype.testAddingButtonToRootGivesButtonFocus = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var root = new Container("root");
					application.setRootWidget(root);

					var button = new Button("button");
					root.appendChildWidget(button);

					assertSame(button, application.getFocussedWidget());
				}
		);
	};

	this.ContainerTest.prototype.testAddingContainerWithButtonGivesButtonFocus = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var root = new Container("root");
					application.setRootWidget(root);

					var container = new Container("container");

					var button = new Button("button");
					container.appendChildWidget(button);

					root.appendChildWidget(container);

					assertSame(button, application.getFocussedWidget());
				}
		);
	};

	this.ContainerTest.prototype.testAddingButtonToContainerGivesButtonFocus = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var root = new Container("root");
					application.setRootWidget(root);

					var container = new Container("container");
					root.appendChildWidget(container);

					var button = new Button("button");
					container.appendChildWidget(button);

					assertSame(button, application.getFocussedWidget());
				}
		);
	};

	this.ContainerTest.prototype.testFocusReturnsTrueWhenButtonIsEnabled = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var root = new Container("root");
					application.setRootWidget(root);

					var container1 = new Container("container1");
					root.appendChildWidget(container1);

					var container2 = new Container("container2");
					root.appendChildWidget(container2);

					var button1 = new Button("button1");
					container1.appendChildWidget(button1);

					var button2 = new Button("button2");
					container2.appendChildWidget(button2);

					assertSame(button1, application.getFocussedWidget());

					assert(container2.focus());

					assertSame(button2, application.getFocussedWidget());
				}
		);

	};

	this.ContainerTest.prototype.testFocusReturnsFalseWhenButtonIsDisabled = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var root = new Container("root");
					application.setRootWidget(root);

					var container1 = new Container("container1");
					root.appendChildWidget(container1);

					var container2 = new Container("container2");
					root.appendChildWidget(container2);

					var button1 = new Button("button1");
					container1.appendChildWidget(button1);

					var button2 = new Button("button2");
					container2.appendChildWidget(button2);

					button2.setDisabled(true);

					assertSame(button1, application.getFocussedWidget());

					assertFalse(container2.focus());

					assertSame(button1, application.getFocussedWidget());
				}
		);

	};

	this.ContainerTest.prototype.testFocusReturnsFalseWhenNoChildButton = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container","antie/widgets/button"],
				function(application, Container, Button) {
					var root = new Container("root");
					application.setRootWidget(root);

					var container1 = new Container("container1");
					root.appendChildWidget(container1);

					var container2 = new Container("container2");
					root.appendChildWidget(container2);

					var button1 = new Button("button1");
					container1.appendChildWidget(button1);

					assertSame(button1, application.getFocussedWidget());

					assertFalse(container2.focus());

					assertSame(button1, application.getFocussedWidget());
				}
		);

	};

    this.ContainerTest.prototype.testFocussingChildButtonDoesNotCauseBlurOnParentWhenParentAlreadyFocussed = function(queue) {
        expectAsserts(1);
        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/container","antie/widgets/button"],
            function(application, Container, Button) {
                var root, container1, container2, button, handlerCalled;

                    root = new Container("root");
                    application.setRootWidget(root);
                    container1 = new Container("container1");
                    root.appendChildWidget(container1);
                    container2 = new Container("container2");
                    container1.appendChildWidget(container2);
                    button = new Button('button');
                    container2.appendChildWidget(button);
                    button.focus();
                    container2.addEventListener('blur', function (evt) {
                        if (evt.target === container2) {
                            handlerCalled = true;
                        }
                    });
                    handlerCalled = false;

                    button.focus();

                    assertFalse('Blur event fired on parent', handlerCalled);
            }
        );

    };

})();