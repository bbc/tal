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
	this.ApplicationComponentsTest = AsyncTestCase("Application_Components");

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
	   expectAsserts(7);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   [
                   'antie/widgets/componentcontainer'
               ],
			   function(application, ComponentContainer) {
                   var appendStub = this.sandbox.stub(application.getRootWidget(), "appendChildWidget");
                   var getStub = this.sandbox.stub(application.getRootWidget(), "getChildWidget");
                   var showStub = this.sandbox.stub();
                   getStub.returns({ show: showStub });

                   application.addComponentContainer("test","fixtures/components/emptycomponent");


                   assert(appendStub.calledOnce);
                   assertInstanceOf(ComponentContainer, appendStub.args[0][0]);
                   assertEquals("test", appendStub.args[0][0].id);

                   assert(getStub.calledOnce);
                   assert(getStub.calledWith("test"));

                   assert(showStub.calledOnce);
                   assert(showStub.calledWith("fixtures/components/emptycomponent"));
			   }
	   );
    };
	this.ApplicationComponentsTest.prototype.testAddComponentContainerWithModuleLoadsModuleWithArgs = function(queue) {
	   expectAsserts(7);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
           [
               'antie/widgets/componentcontainer'
           ],
           function(application, ComponentContainer) {
               var appendStub = this.sandbox.stub(application.getRootWidget(), "appendChildWidget");
               var getStub = this.sandbox.stub(application.getRootWidget(), "getChildWidget");
               var showStub = this.sandbox.stub();
               getStub.returns({ show: showStub });

               var args = {"an":"object"};
               application.addComponentContainer("test","fixtures/components/emptycomponent", args);


               assert(appendStub.calledOnce);
               assertInstanceOf(ComponentContainer, appendStub.args[0][0]);
               assertEquals("test", appendStub.args[0][0].id);

               assert(getStub.calledOnce);
               assert(getStub.calledWith("test"));

               assert(showStub.calledOnce);
               assert(showStub.calledWith("fixtures/components/emptycomponent", args));
           }
	   );
    };

	this.ApplicationComponentsTest.prototype.testPushComponent = function(queue) {
	   expectAsserts(4);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   [],
			   function(application) {
                   var getStub = this.sandbox.stub(application.getRootWidget(), "getChildWidget");
                   var pushStub = this.sandbox.stub();
                   getStub.returns({ pushComponent: pushStub });

                   application.pushComponent("test","fixtures/components/emptycomponent");

                   assert(getStub.calledOnce);
                   assert(getStub.calledWith("test"));

                   assert(pushStub.calledOnce);
                   assert(pushStub.calledWith("fixtures/components/emptycomponent"));
			   }
	   );
    };
	this.ApplicationComponentsTest.prototype.testPushComponentWithArgs = function(queue) {
	   expectAsserts(4);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   [],
			   function(application) {

                   var getStub = this.sandbox.stub(application.getRootWidget(), "getChildWidget");
                   var pushStub = this.sandbox.stub();
                   getStub.returns({ pushComponent: pushStub });

                   var args = {"an":"object"};
                   application.pushComponent("test","fixtures/components/emptycomponent", args);

                   assert(getStub.calledOnce);
                   assert(getStub.calledWith("test"));

                   assert(pushStub.calledOnce);
                   assert(pushStub.calledWith("fixtures/components/emptycomponent", args));
			   }
	   );
    };
	this.ApplicationComponentsTest.prototype.testPopComponent = function(queue) {
	   expectAsserts(4);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   [],
			   function(application) {
                   var getStub = this.sandbox.stub(application.getRootWidget(), "getChildWidget");
                   var backStub = this.sandbox.stub();
                   getStub.returns({ back: backStub });

                   application.popComponent("test");

                   assert(getStub.calledOnce);
                   assert(getStub.calledWith("test"));

                   assert(backStub.calledOnce);
                   assert(backStub.calledWith());
			   }
	   );
    };

	this.ApplicationComponentsTest.prototype.testHideComponent = function(queue) {
	   expectAsserts(4);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   [],
			   function(application) {
                   var getStub = this.sandbox.stub(application.getRootWidget(), "getChildWidget");
                   var hideStub = this.sandbox.stub();
                   getStub.returns({ hide: hideStub });

                   application.hideComponent("test");

                   assert(getStub.calledOnce);
                   assert(getStub.calledWith("test"));

                   assert(hideStub.calledOnce);
                   assert(hideStub.calledWith());
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
	   expectAsserts(4);

	   queuedApplicationInit(
			   queue,
			   "lib/mockapplication",
			   [],
			   function(application) {

                   var obj  = { my: "object" };

                   var getStub = this.sandbox.stub(application.getRootWidget(), "getChildWidget");
                   getStub.returns(obj);
                   var setActiveStub = this.sandbox.stub(application.getRootWidget(), "setActiveChildWidget");

                   application.setActiveComponent("test");

                   assert(getStub.calledOnce);
                   assert(getStub.calledWith("test"));

                   assert(setActiveStub.calledOnce);
                   assert(setActiveStub.calledWith(obj));
			   }
	   );
    };
})();
