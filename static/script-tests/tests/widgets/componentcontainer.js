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

    this.ComponentContainerTest.prototype.testLifecycleEventsOnShow = function(queue) {
        expectAsserts(6);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/componentcontainer",
                // We don't expose the next two, but we must require them so that the loading of the module done
                // through require in the ComponentContainer works as expected with the fake timers.
                "antie/widgets/component", "fixtures/components/eventtestcomponent"],
            function(application, ComponentContainer) {

                var clock = sinon.useFakeTimers();

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

                container.show("fixtures/components/eventtestcomponent", stubs);

                // Nudge the require along:
                clock.tick(1);

                assert('load event fired first', stubs.load.calledBefore(stubs.beforerender));
                assert('beforeRender event fired before beforeShow', stubs.beforerender.calledBefore(stubs.beforeshow));
                assert('beforeShow event fired before afterShow', stubs.beforeshow.calledBefore(stubs.aftershow));
                assert('afterShow (on the component) fired', stubs.aftershow.calledOnce);
                assert('beforehide never called', stubs.beforehide.notCalled);
                assert('afterhide never called', stubs.afterhide.notCalled);

                clock.restore();
            }
        );
    };

    this.ComponentContainerTest.prototype.testMultipleShowsOfSameComponentDoesntCallLoadComponentMoreThanOnce = function (queue) {
        expectAsserts(2);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/componentcontainer",
                // We don't expose the next two, but we must require them so that the loading of the module done
                // through require in the ComponentContainer works as expected with the fake timers.
                "antie/widgets/component", "fixtures/components/eventtestcomponent"],
            function(application, ComponentContainer) {

                var clock = sinon.useFakeTimers();

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

                container.show("fixtures/components/eventtestcomponent", stubs);

                // Nudge the require along:
                clock.tick(1);

                assert(stubs.load.calledOnce);

                container.show("fixtures/components/eventtestcomponent", stubs);

                // There shouldn't be another require, but let's make sure:
                clock.tick(1);

                assert(stubs.load.calledOnce);

                clock.restore();
            }
        );
    };

 	this.ComponentContainerTest.prototype.testShowWithArgs = function(queue) {
		expectAsserts(4);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/componentcontainer",
                // We don't expose the next two, but we must require them so that the loading of the module done
                // through require in the ComponentContainer works as expected with the fake timers.
                "antie/widgets/component", "fixtures/components/emptycomponent"],
            function(application, ComponentContainer) {

                var clock = sinon.useFakeTimers();

                var container = new ComponentContainer("container");
                application.getRootWidget().appendChildWidget(container);

                var loadStub =  this.sandbox.stub();
                var beforeRenderStub = this.sandbox.stub();
                var beforeShowStub = this.sandbox.stub();
                var afterShowStub = this.sandbox.stub();

                container.addEventListener("load", loadStub);
                container.addEventListener("beforerender", beforeRenderStub);
                container.addEventListener("beforeshow", beforeShowStub);
                container.addEventListener("aftershow", afterShowStub);

                var args = { };

                container.show("fixtures/components/emptycomponent", args);

                // Nudge the require along:
                clock.tick(1);

                assertSame(args, loadStub.args[0][0].args);
                assertSame(args, beforeRenderStub.args[0][0].args);
                assertSame(args, beforeShowStub.args[0][0].args);
                assertSame(args, afterShowStub.args[0][0].args);

                clock.restore();
            }
        );
	};

	this.ComponentContainerTest.prototype.testShowIncludesComponent = function(queue) {
		expectAsserts(4);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/componentcontainer",
                // We don't expose the next two, but we must require them so that the loading of the module done
                // through require in the ComponentContainer works as expected with the fake timers.
                "antie/widgets/component", "fixtures/components/emptycomponent"],
            function(application, ComponentContainer) {

                var clock = sinon.useFakeTimers();

                var container = new ComponentContainer("container");
                application.getRootWidget().appendChildWidget(container);

                var loadStub =  this.sandbox.stub();
                var beforeRenderStub = this.sandbox.stub();
                var beforeShowStub = this.sandbox.stub();
                var afterShowStub = this.sandbox.stub();

                container.addEventListener("load", loadStub);
                container.addEventListener("beforerender", beforeRenderStub);
                container.addEventListener("beforeshow", beforeShowStub);
                container.addEventListener("aftershow", afterShowStub);

                var args = { };

                container.show("fixtures/components/emptycomponent", args);

                // Nudge the require along:
                clock.tick(1);

                var component = container.getContent();

                assertSame(component, loadStub.args[0][0].component);
                assertSame(component, beforeRenderStub.args[0][0].component);
                assertSame(component, beforeShowStub.args[0][0].component);
                assertSame(component, afterShowStub.args[0][0].component);

                clock.restore();
            }
        );
	};

 	this.ComponentContainerTest.prototype.testShowKeepHistoryBack = function(queue) {
		expectAsserts(3);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/componentcontainer",
                // We don't expose the next few, but we must require them so that the loading of the module done
                // through require in the ComponentContainer works as expected with the fake timers.
                "antie/widgets/component", "fixtures/components/emptycomponent", "fixtures/components/buttoncomponent"],
            function(application, ComponentContainer) {

                var clock = sinon.useFakeTimers();

                var container = new ComponentContainer("container");
                application.getRootWidget().appendChildWidget(container);

                container.show("fixtures/components/emptycomponent", null, true);

                // Nudge the require along:
                clock.tick(1);

                assertEquals("fixtures/components/emptycomponent", container.getCurrentModule());

                container.show("fixtures/components/buttoncomponent", null, true);

                // Nudge the require along:
                clock.tick(1);

                assertEquals("fixtures/components/buttoncomponent", container.getCurrentModule());

                container.back();

                // Shouldn't need to nudge require along; be paranoid:
                clock.tick(1);

                assertEquals("fixtures/components/emptycomponent", container.getCurrentModule());

                clock.restore();
            }
        );
	};

 	this.ComponentContainerTest.prototype.testPushComponent = function(queue) {
		expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/componentcontainer",
                // We don't expose the next few, but we must require them so that the loading of the module done
                // through require in the ComponentContainer works as expected with the fake timers.
                "antie/widgets/component", "fixtures/components/emptycomponent"],
            function(application, ComponentContainer) {

                var clock = sinon.useFakeTimers();

                var container = new ComponentContainer("container");
                application.getRootWidget().appendChildWidget(container);

                var afterShowStub = this.sandbox.stub();
                container.addEventListener("aftershow", afterShowStub);

                container.pushComponent("fixtures/components/emptycomponent", null);

                // Nudge the require along:
                clock.tick(1);

                assert(afterShowStub.calledOnce);

                clock.restore();
            }
        );
	};

 	this.ComponentContainerTest.prototype.testGetContent = function(queue) {
		expectAsserts(1);

		queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/componentcontainer", "fixtures/components/emptycomponent"],
            function(application, ComponentContainer, EmptyComponent) {
                var clock = sinon.useFakeTimers();

                var container = new ComponentContainer("container");
                application.getRootWidget().appendChildWidget(container);

                container.pushComponent("fixtures/components/emptycomponent", null);

                // Nudge the require along:
                clock.tick(1);

                assertInstanceOf(EmptyComponent, container.getContent());

                clock.restore();
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
                    var clock = sinon.useFakeTimers();

                    var container = new ComponentContainer("container");
                    application.getRootWidget().appendChildWidget(container);

                    container.show("fixtures/components/emptycomponent");

                    // Nudge the require along:
                    clock.tick(1);

                    container.hide();

                    assertNull(container.getContent());

                    clock.restore();
				}
		);
	};

    this.ComponentContainerTest.prototype.testLifecycleEventsOnHide = function(queue) {
        expectAsserts(5);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/componentcontainer",
                // We don't expose the next two, but we must require them so that the loading of the module done
                // through require in the ComponentContainer works as expected with the fake timers.
                "antie/widgets/component", "fixtures/components/eventtestcomponent"],
            function(application, ComponentContainer) {

                var clock = sinon.useFakeTimers();

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

                container.show("fixtures/components/eventtestcomponent", stubs);

                // Nudge the require along:
                clock.tick(1);

                assert('beforehide never called', stubs.beforehide.notCalled);
                assert('afterhide never called', stubs.afterhide.notCalled);

                container.hide(false, stubs);

                assert('beforehide fired', stubs.beforehide.calledOnce);
                assert('afterhide fired', stubs.afterhide.calledOnce);
                assert('beforehide event fired first', stubs.beforehide.calledBefore(stubs.afterhide));

                clock.restore();
            }
        );
    };

 	this.ComponentContainerTest.prototype.testGetCurrentModule = function(queue) {
		expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/componentcontainer",
                // We don't expose the next few, but we must require them so that the loading of the module done
                // through require in the ComponentContainer works as expected with the fake timers.
                "antie/widgets/component", "fixtures/components/emptycomponent"],
            function(application, ComponentContainer) {

                var clock = sinon.useFakeTimers();

                var container = new ComponentContainer("container");
                application.getRootWidget().appendChildWidget(container);

                container.show("fixtures/components/emptycomponent", null, true);

                // Nudge the require along:
                clock.tick(1);

                assertEquals("fixtures/components/emptycomponent", container.getCurrentModule());

                clock.restore();
            }
        );
	};


 	this.ComponentContainerTest.prototype.testGetCurrentArguments = function(queue) {
		expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/componentcontainer",
                // We don't expose the next few, but we must require them so that the loading of the module done
                // through require in the ComponentContainer works as expected with the fake timers.
                "antie/widgets/component", "fixtures/components/emptycomponent"],
            function(application, ComponentContainer) {

                var clock = sinon.useFakeTimers();

                var container = new ComponentContainer("container");
                application.getRootWidget().appendChildWidget(container);

                var args = {hello: "world"};

                container.show("fixtures/components/emptycomponent", args);

                // Nudge the require along:
                clock.tick(1);

                assertSame(args, container.getCurrentArguments());

                clock.restore();
            }
        );
	};

})();
