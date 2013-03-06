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
	this.ComponentContainerTest = AsyncTestCase("ComponentContainer");

	this.ComponentContainerTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.ComponentContainerTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};
	this.ComponentContainerTest.prototype.testInterface = function(queue) {
		expectAsserts(2);

		queuedApplicationInit(
			queue,
			"lib/mockapplication",
			["antie/widgets/componentcontainer","antie/widgets/container"],
			function(application, ComponentContainer, Container) {
				assertEquals('ComponentContainer should be a function', 'function', typeof ComponentContainer);
				assert('ComponentContainer should extend from Container', new ComponentContainer() instanceof Container);
		});
	};
 	this.ComponentContainerTest.prototype.testRender = function(queue) {
		expectAsserts(4);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/componentcontainer"],
				function(application, ComponentContainer) {
					var widget = new ComponentContainer("id");

					var device = application.getDevice();
					var createContainerSpy = this.sandbox.spy(device, 'createContainer');
					var el = widget.render(device);

					assert(createContainerSpy.called);
					assertEquals(typeof device.createListItem(), typeof el);
					assertEquals("id", el.id);
					assertClassName("componentcontainer", el);
				}
		);
	};
 	this.ComponentContainerTest.prototype.testShow = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/componentcontainer"],
				function(application, ComponentContainer) {
					var container = new ComponentContainer("container");
					application.getRootWidget().appendChildWidget(container);

					var loadStub = this.sandbox.stub();
					var beforeRenderStub = this.sandbox.stub();
					var beforeShowStub = this.sandbox.stub();

					queue.call("Wait for component to be shown", function(callbacks) {
						container.addEventListener("load", loadStub);
						container.addEventListener("beforerender", beforeRenderStub);
						container.addEventListener("beforeshow", beforeShowStub);
						container.addEventListener("aftershow", callbacks.add(function() {
							assert(loadStub.calledBefore(beforeRenderStub));
							assert(beforeRenderStub.calledBefore(beforeShowStub));
							assert(beforeShowStub.called);
						}));

						container.show("fixtures/components/emptycomponent");
					});
				}
		);
	};

 	this.ComponentContainerTest.prototype.testShowWithArgs = function(queue) {
		expectAsserts(8);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/componentcontainer"],
				function(application, ComponentContainer) {
					var container = new ComponentContainer("container");
					application.getRootWidget().appendChildWidget(container);

					var args = {hello: "world"};
					var loadStub = this.sandbox.stub();
					var beforeRenderStub = this.sandbox.stub();
					var beforeShowStub = this.sandbox.stub();

					queue.call("Wait for component to be shown", function(callbacks) {
						container.addEventListener("load", loadStub);
						container.addEventListener("beforerender", beforeRenderStub);
						container.addEventListener("beforeshow", beforeShowStub);
						container.addEventListener("aftershow", callbacks.add(function(evt) {
							assert(loadStub.called);
							assertSame(args, loadStub.args[0][0].args);
							assertSame(args, loadStub.args[0][0].args);
							assert(beforeRenderStub.called);
							assertSame(args, beforeRenderStub.args[0][0].args);
							assert(beforeShowStub.called);
							assertSame(args, beforeShowStub.args[0][0].args);
							assertSame(args, evt.args);
						}));

						container.show("fixtures/components/emptycomponent", args);
					});
				}
		);
	};

 	this.ComponentContainerTest.prototype.testShowKeepHistoryBack = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/componentcontainer"],
				function(application, ComponentContainer) {
					var container = new ComponentContainer("container");
					application.getRootWidget().appendChildWidget(container);

					queue.call("Waiting for components to show and hide", function(callbacks) {
						var performAsserts = callbacks.add(function(evt) {
							container.removeEventListener('aftershow', performAsserts);
							assertEquals("fixtures/components/emptycomponent", container.getCurrentModule());
						});
						container.addEventListener('aftershow', function() {
							container.removeEventListener('aftershow', arguments.callee);

							container.addEventListener('aftershow', function() {
								container.removeEventListener('aftershow', arguments.callee);

								container.addEventListener('aftershow', performAsserts);
								container.back();

							});
							container.show("fixtures/components/buttoncomponent", null, true);
						});

						container.show("fixtures/components/emptycomponent", null, true);
					});
				}
		);
	};

 	this.ComponentContainerTest.prototype.testPushComponent = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/componentcontainer"],
				function(application, ComponentContainer) {
					var container = new ComponentContainer("container");
					application.getRootWidget().appendChildWidget(container);

					queue.call("Waiting for components to show", function(callbacks) {
						var performAsserts = callbacks.add(function(evt) {
							container.removeEventListener('aftershow', performAsserts);
							assert(true);
						});
						container.addEventListener('aftershow', performAsserts);
						container.pushComponent("fixtures/components/emptycomponent", null);
					});
				}
		);
	};

 	this.ComponentContainerTest.prototype.testGetContent = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/componentcontainer", "antie/widgets/component"],
				function(application, ComponentContainer, Component) {
					var container = new ComponentContainer("container");
					application.getRootWidget().appendChildWidget(container);

					queue.call("Waiting for components to show", function(callbacks) {
						var performAsserts = callbacks.add(function(evt) {
							container.removeEventListener('aftershow', performAsserts);
							assertInstanceOf(Component, container.getContent());
						});
						container.addEventListener('aftershow', performAsserts);
						container.show("fixtures/components/emptycomponent", null, true);
					});
				}
		);
	};

	 this.ComponentContainerTest.prototype.testHide = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/componentcontainer", "antie/widgets/component"],
				function(application, ComponentContainer, Component) {
					var container = new ComponentContainer("container");
					application.getRootWidget().appendChildWidget(container);

					queue.call("Waiting for components to show", function(callbacks) {
						var performAsserts = callbacks.add(function(evt) {
							container.removeEventListener('afterhide', performAsserts);
							assertNull(container.getContent());
						});
						container.addEventListener('aftershow', function() {
							container.addEventListener('afterhide', performAsserts);
							container.hide();
						});
						container.show("fixtures/components/emptycomponent");
					});
				}
		);
	};

 	this.ComponentContainerTest.prototype.testGetCurrentModule = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/componentcontainer", "antie/widgets/component"],
				function(application, ComponentContainer, Component) {
					var container = new ComponentContainer("container");
					application.getRootWidget().appendChildWidget(container);

					queue.call("Waiting for components to show", function(callbacks) {
						var performAsserts = callbacks.add(function(evt) {
							container.removeEventListener('aftershow', performAsserts);
							assertEquals("fixtures/components/emptycomponent", container.getCurrentModule());
						});
						container.addEventListener('aftershow', performAsserts);
						container.show("fixtures/components/emptycomponent", null);
					});
				}
		);
	};


 	this.ComponentContainerTest.prototype.testGetCurrentArguments = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/componentcontainer", "antie/widgets/component"],
				function(application, ComponentContainer, Component) {
					var args = {hello: "world"};
					var container = new ComponentContainer("container");
					application.getRootWidget().appendChildWidget(container);

					queue.call("Waiting for components to show", function(callbacks) {
						var performAsserts = callbacks.add(function(evt) {
							container.removeEventListener('aftershow', performAsserts);
							assertSame(args, container.getCurrentArguments());
						});
						container.addEventListener('aftershow', performAsserts);
						container.show("fixtures/components/emptycomponent", args);
					});
				}
		);
	};

})();
