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
(function () {
    /* jshint newcap: false, strict: false */
    this.VisibleStateTest = AsyncTestCase("VisibleState");

    this.VisibleStateTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.VisibleStateTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.VisibleStateTest.prototype.testAppendDoesNotCallRenderOnWidget = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/visiblestate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, VisibleState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, VisibleState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                this.sandbox.stub(child, 'render');
                state.append(context, parent, child);

                sinon.assert.notCalled(child.render);
            }
        );
    };

    this.VisibleStateTest.prototype.testPrependDoesNotCallRenderOnWidget = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/visiblestate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, VisibleState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, VisibleState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                this.sandbox.stub(child, 'render');
                state.prepend(context, parent, child);

                sinon.assert.notCalled(child.render);
            }
        );
    };

    this.VisibleStateTest.prototype.testAppendDoesNotAppendOutputElementOfWidgetToAnything = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/visiblestate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/device'
            ],
            function (application, VisibleState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, VisibleState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                var childEl = "child";
                var parentEl = "parent";
                parent.outputElement = parentEl;
                child.outputElement = childEl;
                state.append(context, parent, child);
                sinon.assert.notCalled(Device.prototype.appendChildElement);

            }
        );
    };

    this.VisibleStateTest.prototype.testPrependDoesNotPrependOutputElementOfWidgetToAnything = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/visiblestate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, VisibleState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, VisibleState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                var childEl = "child";
                var parentEl = "parent";
                parent.outputElement = parentEl;
                child.outputElement = childEl;

                state.prepend(context, parent, child);

                sinon.assert.notCalled(Device.prototype.prependChildElement);

            }
        );
    };

    this.VisibleStateTest.prototype.testAppendDoesNotChangeState = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/visiblestate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, VisibleState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, VisibleState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                this.sandbox.stub(child, 'render');
                state.append(context, parent, child);

                sinon.assert.notCalled(WidgetContext.prototype.setState);

            }
        );
    };

    this.VisibleStateTest.prototype.testPrependDoesNotChangeState = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/visiblestate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, VisibleState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);

                var state = createState(self, WidgetContext, VisibleState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                this.sandbox.stub(child, 'render');
                state.prepend(context, parent, child);

                sinon.assert.notCalled(WidgetContext.prototype.setState);
            }
        );
    };

    this.VisibleStateTest.prototype.testDetachCallsHideElementWithWidgetElement = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/visiblestate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, VisibleState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, VisibleState);
                var context = new WidgetContext();
                var child = new Widget();
                child.outputElement = "testElement";
                state.detach(context, child);
                sinon.assert.calledOnce(Device.prototype.hideElement);
                sinon.assert.calledWith(
                    Device.prototype.hideElement,
                    sinon.match.has("el", "testElement")
                );
            }
        );
    };

    this.VisibleStateTest.prototype.testDetachChangesStateToHidden = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/visiblestate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, VisibleState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);

                var state = createState(self, WidgetContext, VisibleState);
                var context = new WidgetContext();
                var child = new Widget();
                state.detach(context, child);
                sinon.assert.calledOnce(WidgetContext.prototype.setState);
                sinon.assert.calledWith(
                    WidgetContext.prototype.setState,
                    'HIDDEN'
                );
            }
        );
    };

    this.VisibleStateTest.prototype.testHasLengthReturnsTrue = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/visiblestate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, VisibleState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, VisibleState);
                assertTrue(state.hasLength());
            }
        );
    };

    this.VisibleStateTest.prototype.testInViewReturnsTrue = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/visiblestate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, VisibleState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, VisibleState);
                assertTrue(state.inView());
            }
        );
    };

    var createState = function (self, Context, State) {
        self.sandbox.stub(Context.prototype);
        return new State();
    };

    var stubWidgetToReturnStubAppAndDevice = function (self, Widget, Device, application) {
        self.sandbox.stub(Device.prototype);
        self.sandbox.stub(Widget.prototype, 'getCurrentApplication');
        Widget.prototype.getCurrentApplication.returns(application);
        self.sandbox.stub(application, 'getDevice').returns(new Device());
    };
}());
