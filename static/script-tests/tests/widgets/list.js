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
	this.ListTest = AsyncTestCase("List");

	this.ListTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.ListTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};
	this.ListTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list","antie/widgets/container"],
			function(application, List, Container) {
				assertEquals('List should be a function', 'function', typeof List);
				assert('List should extend from Container', new List() instanceof Container);
		});
	};
    this.ListTest.prototype.testRender = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list"],
			function(application, List) {
				var widget = new List("id");
				var device = application.getDevice();
				var el = widget.render(device);
				assertEquals(typeof device.createContainer(), typeof el);
				assertEquals("id", el.id);
				assertClassName("list", el);
			}
		);
	};
	this.ListTest.prototype.testRenderModeDefault = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list"],
			function(application, List) {
				var widget = new List("id");
				var device = application.getDevice();
				var createContainerSpy = this.sandbox.spy(device, 'createContainer');
				var el = widget.render(device);
				assert(createContainerSpy.called);
				assertEquals(typeof device.createContainer(), typeof el);
			}
		);
	};
	this.ListTest.prototype.testRenderModeList = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list"],
			function(application, List) {
				var widget = new List("id");
				widget.setRenderMode(List.RENDER_MODE_LIST);
				var device = application.getDevice();
				var createListSpy = this.sandbox.spy(device, 'createList');
				var el = widget.render(device);
				assert(createListSpy.called);
				assertEquals(typeof device.createList(), typeof el);
			}
		);
	};
	this.ListTest.prototype.testRenderModeContainer = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list"],
			function(application, List) {
				var widget = new List("id");
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				var device = application.getDevice();
				var createContainerSpy = this.sandbox.spy(device, 'createContainer');
				var el = widget.render(device);
				assert(createContainerSpy.called);
				assertEquals(typeof device.createContainer(), typeof el);
			}
		);
	};
	this.ListTest.prototype.testRenderModeDefaultChildrenAreContainers = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/widgets/container"],
			function(application, List, Container) {
				var widget = new List("id");
				widget.appendChildWidget(new Container());
				assertInstanceOf(Container, widget.getChildWidgets()[0]);
			}
		);
	};
	this.ListTest.prototype.testRenderModeListChildrenAreListItems = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list","antie/widgets/container","antie/widgets/listitem"],
			function(application, List, Container, ListItem) {
				var widget = new List("id");
				widget.setRenderMode(List.RENDER_MODE_LIST);
				widget.appendChildWidget(new Container());
				assertInstanceOf(ListItem, widget.getChildWidgets()[0]);
			}
		);
	};
	this.ListTest.prototype.testRenderModeContainerChildrenAreContainers = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/widgets/container"],
			function(application, List, Container) {
				var widget = new List("id");
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				widget.appendChildWidget(new Container());
				assertInstanceOf(Container, widget.getChildWidgets()[0]);
			}
		);
	};
	this.ListTest.prototype.testAppendedChildrenHaveListItemClass = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/widgets/container"],
			function(application, List, Container) {
				var widget = new List("id");
				var item = new Container();
				assertFalse(item.hasClass("listitem"));
				widget.appendChildWidget(item);
				assert(item.hasClass("listitem"));
			}
		);
	};
	this.ListTest.prototype.testInsertedChildrenHaveListItemClass = function(queue) {
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/list", "antie/widgets/container"],
            function(application, List, Container) {
                var list, item;
                list = new List("id");
                item = new Container();
                assertFalse(item.hasClass("listitem"));
                list.insertChildWidget(0, item);
                assertTrue(item.hasClass("listitem"));
            }
        );
    };
	this.ListTest.prototype.testRemovedChildrenLoseListItemClass = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/widgets/container"],
			function(application, List, Container) {
				var list, insertedItem, appendedItem, i;
				function removeAndCheck(item) {
				    assertTrue(item.hasClass('listitem'));
				    list.removeChildWidget(item);
				    assertFalse(item.hasClass('listitem'));
				}
				
				list = new List("id");
				insertedItem = new Container();
				appendedItem = new Container();
				list.insertChildWidget(0, insertedItem);
				list.appendChildWidget(appendedItem);
			    removeAndCheck(insertedItem);
			    removeAndCheck(appendedItem);
			}
		);
	};
	this.ListTest.prototype.testRemovedChildrenViaRemoveWidgetsLoseListItemClass = function(queue) {
		expectAsserts(4);
		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/widgets/container"],
			function(application, List, Container) {

			    var list, insertedItem, appendedItem;
				list = new List("id");
				insertedItem = new Container();
				appendedItem = new Container();
				
				list.appendChildWidget(insertedItem);
				list.insertChildWidget(0, appendedItem);
				
				assertTrue(insertedItem.hasClass("listitem"));
				assertTrue(appendedItem.hasClass("listitem"));
				list.removeChildWidgets();
				assertFalse(insertedItem.hasClass("listitem"));
				assertFalse(appendedItem.hasClass("listitem"));
			}
		);
	};
	this.ListTest.prototype.testSynchronousDataBoundViaConstructor = function(queue) {
		expectAsserts(7);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/formatter", "antie/widgets/label"],
			function(application, List, Formatter, Label) {
				var dataSource = ["a", "b", "c"];
				var SimpleFormatter = Formatter.extend({
					format: function(iterator) {
						return new Label(iterator.next());
					}
				});
				var widget = new List("id", new SimpleFormatter(), dataSource);
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				application.getRootWidget().appendChildWidget(widget);
				assertEquals(dataSource.length, widget.getChildWidgetCount());
				var childWidgets = widget.getChildWidgets();
				assertInstanceOf(Label, childWidgets[0]);
				assertEquals(dataSource[0], childWidgets[0].getText());
				assertInstanceOf(Label, childWidgets[1]);
				assertEquals(dataSource[1], childWidgets[1].getText());
				assertInstanceOf(Label, childWidgets[2]);
				assertEquals(dataSource[2], childWidgets[2].getText());
			}
		);
	};
	this.ListTest.prototype.testAsynchronousDataBoundViaConstructor = function(queue) {
		expectAsserts(7);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/formatter", "antie/widgets/label"],
			function(application, List, Formatter, Label) {
				var dataItems = ['a', 'b', 'c'];
				var dataSource = {
				  load: function(callbacks) {
					  callbacks.onSuccess(dataItems);
				  }
				};
				var SimpleFormatter = Formatter.extend({
					format: function(iterator) {
						return new Label(iterator.next());
					}
				});
				var widget = new List("id", new SimpleFormatter(), dataSource);
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				application.getRootWidget().appendChildWidget(widget);
				assertEquals(dataItems.length, widget.getChildWidgetCount());
				var childWidgets = widget.getChildWidgets();
				assertInstanceOf(Label, childWidgets[0]);
				assertEquals(dataItems[0], childWidgets[0].getText());
				assertInstanceOf(Label, childWidgets[1]);
				assertEquals(dataItems[1], childWidgets[1].getText());
				assertInstanceOf(Label, childWidgets[2]);
				assertEquals(dataItems[2], childWidgets[2].getText());
			}
		);
	};
	this.ListTest.prototype.testSetDataSource = function(queue) {
		expectAsserts(5);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/formatter", "antie/widgets/label"],
			function(application, List, Formatter, Label) {
				var dataSource = ["a", "b", "c"];
				var SimpleFormatter = Formatter.extend({
					format: function(iterator) {
						return new Label(iterator.next());
					}
				});
				var widget = new List("id", new SimpleFormatter());
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				application.getRootWidget().appendChildWidget(widget);

				var secondDataSource = ["d", "e"];
				widget.setDataSource(secondDataSource);

				assertEquals(secondDataSource.length, widget.getChildWidgetCount());
				var childWidgets = widget.getChildWidgets();
				assertInstanceOf(Label, childWidgets[0]);
				assertEquals(secondDataSource[0], childWidgets[0].getText());
				assertInstanceOf(Label, childWidgets[1]);
				assertEquals(secondDataSource[1], childWidgets[1].getText());
			}
		);
	};
	this.ListTest.prototype.testBeforeDataBindEvent = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/formatter", "antie/widgets/label"],
			function(application, List, Formatter, Label) {
				var dataSource = ["a", "b", "c"];
				var SimpleFormatter = Formatter.extend({
					format: function(iterator) {
						return new Label(iterator.next());
					}
				});
				var widget = new List("id", new SimpleFormatter(), dataSource);
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);

				var beforeDataBind = this.sandbox.stub();
				widget.addEventListener("beforedatabind", beforeDataBind);

				application.getRootWidget().appendChildWidget(widget);

				assert(beforeDataBind.called);
			}
		);
	};
	this.ListTest.prototype.testDataBoundEvent = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/formatter", "antie/widgets/label"],
			function(application, List, Formatter, Label) {
				var dataSource = ["a", "b", "c"];
				var SimpleFormatter = Formatter.extend({
					format: function(iterator) {
						return new Label(iterator.next());
					}
				});
				var widget = new List("id", new SimpleFormatter(), dataSource);
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);

				var dataBound = this.sandbox.stub();
				widget.addEventListener("databound", dataBound);

				application.getRootWidget().appendChildWidget(widget);

				assert(dataBound.called);
			}
		);
	};
	this.ListTest.prototype.testDataBindingError = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/formatter", "antie/widgets/label"],
			function(application, List, Formatter, Label) {
				var dataSource = {
				  load: function(callbacks) {
					  callbacks.onError('description');
				  }
				};
				var SimpleFormatter = Formatter.extend({
					format: function(iterator) {
						return new Label(iterator.next());
					}
				});
				var widget = new List("id", new SimpleFormatter(), dataSource);
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);

				var dataBindingError = this.sandbox.stub();
				widget.addEventListener("databindingerror", dataBindingError);

				application.getRootWidget().appendChildWidget(widget);

				assert(dataBindingError.called);
			}
		);
	};
	this.ListTest.prototype.testAppendChildWidgetModeContainer = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/widgets/container"],
			function(application, List, Container) {
				var widget = new List("id");
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				var child = new Container();
				widget.appendChildWidget(child);
				assertEquals(1, widget.getChildWidgetCount());
				var childWidgets = widget.getChildWidgets();
				assertSame(child, childWidgets[0]);
			}
		);
	};
	this.ListTest.prototype.testAppendChildWidgetModeList = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/widgets/container", "antie/widgets/listitem"],
			function(application, List, Container, ListItem) {
				var widget = new List("id");
				widget.setRenderMode(List.RENDER_MODE_LIST);
				var child = new Container();
				widget.appendChildWidget(child);
				assertEquals(1, widget.getChildWidgetCount());
				var childWidgets = widget.getChildWidgets();
				var firstChild = childWidgets[0];
				assertInstanceOf(ListItem, firstChild);
				childWidgets = firstChild.getChildWidgets();
				assertSame(child, childWidgets[0]);
			}
		);
	};
	this.ListTest.prototype.testInsertChildWidgetModeContainer = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/widgets/container"],
			function(application, List, Container) {
				var widget = new List("id");
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				widget.appendChildWidget(new Container());
				var child = new Container();
				widget.insertChildWidget(0, child);
				assertEquals(2, widget.getChildWidgetCount());
				var childWidgets = widget.getChildWidgets();
				assertSame(child, childWidgets[0]);
			}
		);
	};
	this.ListTest.prototype.testInsertChildWidgetModeList = function(queue) {
		expectAsserts(5);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/widgets/container", "antie/widgets/listitem"],
			function(application, List, Container, ListItem) {
				var widget = new List("id");
				widget.setRenderMode(List.RENDER_MODE_LIST);
				widget.appendChildWidget(new Container());
				
				assertEquals( 0, widget._selectedIndex );
				
				var child = new Container();
				widget.insertChildWidget(0, child);
				assertEquals(2, widget.getChildWidgetCount());
				assertEquals( 1, widget._selectedIndex );
				
				var childWidgets = widget.getChildWidgets();
				var firstChild = childWidgets[0];
				assertInstanceOf(ListItem, firstChild);
				childWidgets = firstChild.getChildWidgets();
				assertSame(child, childWidgets[0]);
			}
		);
	};
	this.ListTest.prototype.testSetActiveChildWidgetRaisesSelectedItemChangeEvent = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/widgets/button"],
			function(application, List, Button) {
				var widget = new List("id");
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				var b1 = new Button();
				var b2 = new Button();
				widget.appendChildWidget(b1);
				widget.appendChildWidget(b2);
				var handler = this.sandbox.stub();
				widget.addEventListener("selecteditemchange", handler);
				widget.setActiveChildWidget(b1);
				assertFalse(handler.called);
				widget.setActiveChildWidget(b2);
				assert(handler.called);
			}
		);
	};

	this.ListTest.prototype.testResetDataBindings = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/formatter", "antie/widgets/label"],
			function(application, List, Formatter, Label) {
				var dataSource = ["a", "b", "c"];
				var SimpleFormatter = Formatter.extend({
					format: function(iterator) {
						return new Label(iterator.next());
					}
				});
				var widget = new List("id", new SimpleFormatter(), dataSource);
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				application.getRootWidget().appendChildWidget(widget);

				var dataBound = this.sandbox.stub();
				widget.addEventListener("databound", dataBound);

				widget.render(application.getDevice());
				assertFalse(dataBound.called);

				widget.resetDataBindings();

				widget.render(application.getDevice());
				assert(dataBound.called);
			}
		);
	};

	this.ListTest.prototype.testRebindDataSource = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/formatter", "antie/widgets/label"],
			function(application, List, Formatter, Label) {
				var dataSource = ["a", "b", "c"];
				var SimpleFormatter = Formatter.extend({
					format: function(iterator) {
						return new Label(iterator.next());
					}
				});
				var widget = new List("id", new SimpleFormatter(), dataSource);
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				application.getRootWidget().appendChildWidget(widget);

				assertEquals(dataSource.length, widget.getChildWidgetCount());
				dataSource.push('d');
				assertEquals(dataSource.length - 1, widget.getChildWidgetCount());
				widget.rebindDataSource();
				assertEquals(dataSource.length, widget.getChildWidgetCount());
			}
		);
	};

	this.ListTest.prototype.testRemoveChildWidget = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/formatter", "antie/widgets/label"],
			function(application, List, Formatter, Label) {
				var dataSource = ["a", "b", "c"];
				var SimpleFormatter = Formatter.extend({
					format: function(iterator) {
						return new Label(iterator.next());
					}
				});
				var widget = new List("id", new SimpleFormatter(), dataSource);
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				application.getRootWidget().appendChildWidget(widget);

				assertEquals(dataSource.length, widget._totalDataItems);
				widget.removeChildWidget(widget.getChildWidgets()[0]);
				assertEquals(dataSource.length - 1, widget._totalDataItems);
			}
		);
	};

	this.ListTest.prototype.testRemoveChildWidgets = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/formatter", "antie/widgets/label"],
			function(application, List, Formatter, Label) {
				var dataSource = ["a", "b", "c"];
				var SimpleFormatter = Formatter.extend({
					format: function(iterator) {
						return new Label(iterator.next());
					}
				});
				var widget = new List("id", new SimpleFormatter(), dataSource);
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				application.getRootWidget().appendChildWidget(widget);

				assertEquals(dataSource.length, widget._totalDataItems);
				widget.removeChildWidgets();
				assertEquals(0, widget._totalDataItems);
			}
		);
	};

	this.ListTest.prototype.testBindUnbindProgressIndicator = function(queue) {
		expectAsserts(5);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/formatter", "antie/widgets/button", "antie/widgets/horizontalprogress"],
			function(application, List, Formatter, Button, HorizontalProgress) {
				var dataSource = ["a", "b", "c", "d", "e"];
				var SimpleFormatter = Formatter.extend({
					format: function(iterator) {
						return new Button(iterator.next());
					}
				});
				var widget = new List("id", new SimpleFormatter(), dataSource);
				application.getRootWidget().render(application.getDevice());

				widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				application.getRootWidget().appendChildWidget(widget);

				var progress = new HorizontalProgress();
				application.getRootWidget().appendChildWidget(progress);

				widget.bindProgressIndicator(progress);
				var setValueSpy = this.sandbox.spy(progress, 'setValue');

				widget.setActiveChildIndex(1);
				assert("2", setValueSpy.calledWithExactly(0.25));
				widget.setActiveChildIndex(2);
				assert("3", setValueSpy.calledWithExactly(0.5));
				widget.setActiveChildIndex(3);
				assert("4", setValueSpy.calledWithExactly(0.75));
				widget.setActiveChildIndex(4);
				assert("5", setValueSpy.calledWithExactly(1.0));

				progress.setValue.restore();
				var setValueSpy2 = this.sandbox.spy(progress, 'setValue');
				widget.unbindProgressIndicator();
				widget.setActiveChildIndex(3);
				assertFalse(setValueSpy2.called);
			}
		);
	};

	this.ListTest.prototype.testSetGetDataBindingOrder = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list"],
			function(application, List) {
				var widget = new List("id")
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);

				widget.setDataBindingOrder(List.DATA_BIND_REVERSE);
				assertEquals(List.DATA_BIND_REVERSE, widget.getDataBindingOrder());

				widget.setDataBindingOrder(List.DATA_BIND_FORWARD);
				assertEquals(List.DATA_BIND_FORWARD, widget.getDataBindingOrder());
			}
		);
	};

	this.ListTest.prototype.testBindingOrderForward = function(queue) {
		expectAsserts(5);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/formatter", "antie/widgets/label"],
			function(application, List, Formatter, Label) {
				var dataSource = ["a", "b", "c"];
				var SimpleFormatter = Formatter.extend({
					format: function(iterator) {
						return new Label(iterator.next());
					}
				});
				var widget = new List("id", new SimpleFormatter());
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				widget.setDataBindingOrder(List.DATA_BIND_FORWARD);

				application.getRootWidget().appendChildWidget(widget);

				var secondDataSource = ["d", "e"];
				widget.setDataSource(secondDataSource);

				assertEquals(secondDataSource.length, widget.getChildWidgetCount());
				var childWidgets = widget.getChildWidgets();
				assertInstanceOf(Label, childWidgets[0]);
				assertEquals(secondDataSource[0], childWidgets[0].getText());
				assertInstanceOf(Label, childWidgets[1]);
				assertEquals(secondDataSource[1], childWidgets[1].getText());
			}
		);
	};

	this.ListTest.prototype.testBindingOrderReverse = function(queue) {
		expectAsserts(5);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/list", "antie/formatter", "antie/widgets/label"],
			function(application, List, Formatter, Label) {
				var dataSource = ["a", "b", "c"];
				var SimpleFormatter = Formatter.extend({
					format: function(iterator) {
						return new Label(iterator.next());
					}
				});
				var widget = new List("id", new SimpleFormatter());
				widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				widget.setDataBindingOrder(List.DATA_BIND_REVERSE);

				application.getRootWidget().appendChildWidget(widget);

				var secondDataSource = ["d", "e"];
				widget.setDataSource(secondDataSource);

				assertEquals(secondDataSource.length, widget.getChildWidgetCount());
				var childWidgets = widget.getChildWidgets();

				assertInstanceOf(Label, childWidgets[0]);
				assertEquals(secondDataSource[1], childWidgets[0].getText());

				assertInstanceOf(Label, childWidgets[1]);
				assertEquals(secondDataSource[0], childWidgets[1].getText());
			}
		);
	};
})();
