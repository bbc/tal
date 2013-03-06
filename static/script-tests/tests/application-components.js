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
	this.ApplicationComponentsTest = AsyncTestCase("Application (Components)");

	this.ApplicationComponentsTest.prototype.setUp = function() {
		this.sandbox = sinon.sandbox.create();
	};

	this.ApplicationComponentsTest.prototype.tearDown = function() {
		this.sandbox.restore();
	};

	this.ApplicationComponentsTest.prototype.testSetGetRootWidget = function(queue) {
		expectAsserts(3);

		queuedApplicationInit(
				queue,
				"lib/mockapplication",
				["antie/widgets/container"],
				function(application, Container) {

					assertException("Passing a non-widget causes an exception", function() {application.setRootWidget("TEST")});

					var container = new Container();
					assertNoException("Passing a widget causes no exception", function() {application.setRootWidget(container)});

					assertSame("getRootWidget returns previously setRootWidget", container, application.getRootWidget());
				}
		);
	};
	this.ApplicationComponentsTest.prototype.testGetFocusedWidget = function(queue) {
	   expectAsserts(1);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   ["antie/widgets/button"],
			   function(application, Button) {
				   var root = application.getRootWidget();
				   var button = new Button();
				   root.appendChildWidget(button);

				   assertSame(button, application.getFocussedWidget());
			   }
	   );
    };
	this.ApplicationComponentsTest.prototype.testAddComponentContainerAddsChild = function(queue) {
	   expectAsserts(4);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   ["antie/widgets/componentcontainer"],
			   function(application, ComponentContainer) {
				   var root = application.getRootWidget();

				   assertEquals(0, root.getChildWidgetCount())
				   application.addComponentContainer("test");
				   assertEquals(1, root.getChildWidgetCount())

				   var firstChild = root.getChildWidgets()[0];
				   assertInstanceOf(ComponentContainer, firstChild);
				   assertEquals("test", firstChild.id);
			   }
	   );
    };
	this.ApplicationComponentsTest.prototype.testAddComponentContainerWithModuleLoadsModule = function(queue) {
	   expectAsserts(1);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   [],
			   function(application) {
				   	queue.call("Wait for component load", function(callbacks) {
					   	var onLoad = callbacks.add(function() {
							   assert(true);
						   });
					   	application.addEventListener("load", onLoad);
				   		application.addComponentContainer("test","fixtures/components/emptycomponent");
				   	});
			   }
	   );
    };
	this.ApplicationComponentsTest.prototype.testAddComponentContainerWithModuleLoadsModuleWithArgs = function(queue) {
	   expectAsserts(1);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   [],
			   function(application) {
				   	queue.call("Wait for component load", function(callbacks) {
					   	var args = {"an":"object"};
						var onLoad = callbacks.add(function(evt) {
							assertSame(args, evt.args);
						});
					   	application.addEventListener("load", onLoad);
				   		application.addComponentContainer("test","fixtures/components/emptycomponent", args);
				   	});
			   }
	   );
    };

	this.ApplicationComponentsTest.prototype.testPushComponent = function(queue) {
	   expectAsserts(1);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   [],
			   function(application) {
				   	queue.call("Wait for component load", function(callbacks) {
					   	var onLoad = callbacks.add(function() {
							   assert(true);
						   });
					   	var container = application.addComponentContainer("test");
						container.addEventListener("load", onLoad);
				   		application.pushComponent("test","fixtures/components/emptycomponent");
				   	});
			   }
	   );
    };
	this.ApplicationComponentsTest.prototype.testPushComponentWithArgs = function(queue) {
	   expectAsserts(1);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   [],
			   function(application) {
				   	queue.call("Wait for component load", function(callbacks) {
					   	var args = {"an":"object"};
						var onLoad = callbacks.add(function(evt) {
							assertSame(args, evt.args);
						});
					   	var container = application.addComponentContainer("test");
						container.addEventListener("load", onLoad);
				   		application.pushComponent("test", "fixtures/components/emptycomponent", args);
				   	});
			   }
	   );
    };
	this.ApplicationComponentsTest.prototype.testPopComponentWithOneItemOnStack = function(queue) {
	   expectAsserts(1);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   [],
			   function(application) {
				   	queue.call("Wait for component hide", function(callbacks) {
					   	application.addComponentContainer("test");

						var onAfterHide = callbacks.add(function() {
							assert(true);
						});
						application.addEventListener("aftershow", function() {
							application.popComponent("test");
						});
						application.addEventListener("afterhide", onAfterHide);

				   		application.pushComponent("test", "fixtures/components/emptycomponent");
				   	});
			   }
	   );
    };
	this.ApplicationComponentsTest.prototype.testPopComponentWithTwoDifferentComponentsOnStack = function(queue) {
	   expectAsserts(3);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   [],
			   function(application) {
				   	queue.call("Wait for component hide", function(callbacks) {
					    var container = application.addComponentContainer("test");

						var done = callbacks.add(function() {
							assertEquals("fixtures/components/emptycomponent", container.getCurrentModule());
						});

						var callCount = 0;
						container.addEventListener("aftershow", function() {
							container.removeEventListener("aftershow", arguments.callee);
							assertEquals("fixtures/components/emptycomponent", container.getCurrentModule());

							container.addEventListener("aftershow", function() {
								container.removeEventListener("aftershow", arguments.callee);
								assertEquals("fixtures/components/buttoncomponent", container.getCurrentModule());

								container.addEventListener("aftershow", function() {
									container.removeEventListener("aftershow", arguments.callee);
									done();
								});

								application.popComponent("test");
							});

							application.pushComponent("test", "fixtures/components/buttoncomponent", {depth:2});
						});

				   		application.pushComponent("test", "fixtures/components/emptycomponent", {depth:1});
				   	});
			   });
	};
	this.ApplicationComponentsTest.prototype.testHideComponent = function(queue) {
	   expectAsserts(2);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   [],
			   function(application) {
				   	queue.call("Wait for component load", function(callbacks) {
					   	var onAfterHide = callbacks.add(function() {
							assertNull(application.getComponent("test").getContent());
						});
					   	application.addEventListener("aftershow", function() {
							assertNotNull(application.getComponent("test").getContent());
							application.hideComponent("test");
						});
						application.addEventListener("afterhide", onAfterHide);
				   		application.addComponentContainer("test","fixtures/components/emptycomponent");
				   	});
			   }
	   );
    };
	this.ApplicationComponentsTest.prototype.testHideComponent = function(queue) {
	   expectAsserts(1);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   [],
			   function(application) {
				   	var container = application.addComponentContainer("test");
				   	assertSame(container, application.getComponent("test"));
			   }
	   );
    };
	this.ApplicationComponentsTest.prototype.testSetActiveComponent = function(queue) {
	   expectAsserts(1);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   [],
			   function(application) {
				   	queue.call("Wait for component load", function(callbacks) {
					   	var container = application.addComponentContainer("test");
						var root = application.getRootWidget();
						var onLoad = callbacks.add(function() {
							application.setActiveComponent("test");
							assertSame(container, root.getActiveChildWidget());
						});
					   	application.addEventListener("aftershow", onLoad);
				   		application.showComponent("test", "fixtures/components/buttoncomponent");
				   	});
			   }
	   );
    };
})();
