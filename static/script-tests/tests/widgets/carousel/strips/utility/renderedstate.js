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
    this.RenderedStateTest = AsyncTestCase("RenderedState");

    this.RenderedStateTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.RenderedStateTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.RenderedStateTest.prototype.testAppendDoesNotCallRenderOnWidget = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/renderedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, RenderedState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, RenderedState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                self.sandbox.stub(child, 'render');
                state.append(context, parent, child);

                sinon.assert.notCalled(child.render);
            }
        );
    };

    this.RenderedStateTest.prototype.testPrependDoesNotCallRenderOnWidget = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/renderedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, RenderedState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, RenderedState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                self.sandbox.stub(child, 'render');
                state.prepend(context, parent, child);

                sinon.assert.notCalled(child.render);
            }
        );
    };

    this.RenderedStateTest.prototype.testAppendAppendsOutputElementOfWidgetToOutputElementOfParent = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/renderedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/device'
            ],
            function (application, RenderedState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, RenderedState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                var childEl = "child";
                var parentEl = "parent";
                parent.outputElement = parentEl;
                child.outputElement = childEl;

                state.append(context, parent, child);

                sinon.assert.calledOnce(Device.prototype.appendChildElement);
                sinon.assert.calledWith(
                    Device.prototype.appendChildElement,
                    "parent",
                    "child"
                );
            }
        );
    };

    this.RenderedStateTest.prototype.testPrependPrependsOutputElementOfWidgetToOutputElementOfParent = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/renderedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, RenderedState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, RenderedState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                var childEl = "child";
                var parentEl = "parent";
                parent.outputElement = parentEl;
                child.outputElement = childEl;

                state.prepend(context, parent, child);

                sinon.assert.calledOnce(Device.prototype.prependChildElement);
                sinon.assert.calledWith(
                    Device.prototype.prependChildElement,
                    "parent",
                    "child"
                );
            }
        );
    };

    this.RenderedStateTest.prototype.testAppendChangesContextStateToAttached = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/renderedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, RenderedState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, RenderedState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                self.sandbox.stub(child, 'render');
                state.append(context, parent, child);

                sinon.assert.calledOnce(WidgetContext.prototype.setState);
                sinon.assert.calledWith(
                    WidgetContext.prototype.setState,
                    'ATTACHED'
                );
            }
        );
    };

    this.RenderedStateTest.prototype.testPrependChangesContextStateToAttached = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/renderedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, RenderedState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);

                var state = createState(self, WidgetContext, RenderedState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                self.sandbox.stub(child, 'render');
                state.prepend(context, parent, child);

                sinon.assert.calledOnce(WidgetContext.prototype.setState);
                sinon.assert.calledWith(
                    WidgetContext.prototype.setState,
                    'ATTACHED'
                );
            }
        );
    };

    this.RenderedStateTest.prototype.testDetachDoesNotCallRemoveElement = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/renderedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice',
                'antie/widgets/carousel/strips/utility/attachedstate'
            ],
            function (application, RenderedState, WidgetContext, Widget, Device, AttachedState) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, RenderedState);
                var child = new Widget();
                state.detach(child);
                sinon.assert.notCalled(Device.prototype.removeElement);
            }
        );
    };

    this.RenderedStateTest.prototype.testDetachDoesNotChangeState = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/renderedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice',
                'antie/widgets/carousel/strips/utility/attachedstate'
            ],
            function (application, RenderedState, WidgetContext, Widget, Device, AttachedState) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, RenderedState);
                var context = new WidgetContext();
                var child = new Widget();
                state.detach(context, child);
                sinon.assert.notCalled(WidgetContext.prototype.setState);
            }
        );
    };

    this.RenderedStateTest.prototype.testAttachedReturnsFalse = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/renderedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice',
                'antie/widgets/carousel/strips/utility/attachedstate'
            ],
            function (application, RenderedState, WidgetContext, Widget, Device, AttachedState) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, RenderedState);
                assertFalse(state.hasLength());
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
