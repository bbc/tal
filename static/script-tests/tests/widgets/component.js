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
	this.ComponentTest = AsyncTestCase("Component");

	this.ComponentTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.ComponentTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};
	this.ComponentTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/component","antie/widgets/container"],
			function(application, Component, Container) {
				assertEquals('Component should be a function', 'function', typeof Component);
				assert('Component should extend from Container', new Component() instanceof Container);
		});
	};
 	this.ComponentTest.prototype.testRender = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/component"],
				function(application, Component) {
					var widget = new Component("id");

					var device = application.getDevice();
					var createContainerSpy = this.sandbox.spy(device, 'createContainer');
					var el = widget.render(device);

					assert(createContainerSpy.called);
					assertEquals(typeof device.createListItem(), typeof el);
					assertEquals("id", el.id);
					assertClassName("container", el);
				}
		);
	};
 	this.ComponentTest.prototype.testSetGetIsModal = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/component"],
				function(application, Component) {
					var widget = new Component("id");
					assertFalse(widget.getIsModal());
					widget.setIsModal(true);
					assert(widget.getIsModal());
					widget.setIsModal(false);
					assertFalse(widget.getIsModal());
				}
		);
	};
 	this.ComponentTest.prototype.testGetConfig = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/component"],
				function(application, Component) {
					var widget = new Component("id");
					assertSame(antie.framework.deviceConfiguration, widget.getConfig());
				}
		);
	};
 	this.ComponentTest.prototype.testGetCurrentState = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/component"],
				function(application, Component) {
					var widget = new Component("id");
					assertNull(widget.getCurrentState());
				}
		);
	};
 	this.ComponentTest.prototype.testHide = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/component", "antie/widgets/componentcontainer"],
				function(application, Component, ComponentContainer) {
					var container = new ComponentContainer("container");
					var widget = new Component("id");
					container.appendChildWidget(widget);

					var hideSpy = this.sandbox.spy(container, 'hide');
					widget.hide();
					assert(hideSpy.called);
				}
		);
	};
	/**
	 * Test that all required lifecycle events are fired in the correct sequence when a component is
	 * shown via its container.
	 */
	this.ComponentTest.prototype.testLifecycleEventsOnShow = function(queue) {
		expectAsserts(6);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/componentcontainer"],
				function(application, ComponentContainer) {
					var container = new ComponentContainer("container");
					application.getRootWidget().appendChildWidget(container);

					var stubs = {
						load: this.sandbox.stub(),
						beforerender: this.sandbox.stub(),
						beforeshow: this.sandbox.stub(),
						aftershow: this.sandbox.stub(),
						beforehide: this.sandbox.stub(),
						afterhide: this.sandbox.stub()
					};

					// Show the component, ensure the events are all fired in the correct order.
					queue.call("Wait for component to be shown", function(callbacks) {
						container.addEventListener("aftershow", callbacks.add(function() {
							assert('load event fired first', stubs.load.calledBefore(stubs.beforerender));
							assert('beforeRender event fired before beforeShow', stubs.beforerender.calledBefore(stubs.beforeshow));
							assert('beforeShow event fired before afterShow', stubs.beforeshow.calledBefore(stubs.aftershow));
							assert('afterShow (on the component) fired', stubs.aftershow.calledOnce);
						}));

						container.show("fixtures/components/eventtestcomponent", stubs);
					});
					
					// Ensure that none of the hide-related events have been fired.
					queue.call("Ensure hiding events are never called", function(callbacks) {
						assert('beforehide never called', !stubs.beforehide.called);
						assert('afterhide never called', !stubs.afterhide.called);
					});
				}
		);
	};
	/**
	 * Test that all required lifecycle events are fired in the correct sequence when a component is
	 * hidden via its container.
	 */
	this.ComponentTest.prototype.testLifecycleEventsOnHide = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/componentcontainer"],
				function(application, ComponentContainer) {
					var container = new ComponentContainer("container");
					application.getRootWidget().appendChildWidget(container);

					var stubs = {
						load: this.sandbox.stub(),
						beforerender: this.sandbox.stub(),
						beforeshow: this.sandbox.stub(),
						aftershow: this.sandbox.stub(),
						beforehide: this.sandbox.stub(),
						afterhide: this.sandbox.stub()
					};

					// Show the component first - not part of this test.
					queue.call("Wait for component to be shown", function(callbacks) {
						container.addEventListener("aftershow", callbacks.add(function() {
							assert('Component has been shown', true);
						}));

						container.show("fixtures/components/eventtestcomponent", stubs);
					});
					
					// Hide the component and ensure that the events are fired.
					queue.call("Wait for component to be hidden", function(callbacks) {
						container.addEventListener("afterhide", callbacks.add(function() {
							assert('beforehide event fired first', stubs.beforehide.calledBefore(stubs.afterhide));
							assert('afterhide (on the component) fired', stubs.afterhide.calledOnce);
						}));
						
						container.hide(false, stubs);
					});
				}
		);
	};

})();
