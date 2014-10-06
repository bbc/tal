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
    this.AttachedStateTest = AsyncTestCase("AttachedState");

    this.AttachedStateTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.AttachedStateTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.AttachedStateTest.prototype.testAppendDoesNotCallRenderOnWidget = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/attachedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, AttachedState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, AttachedState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                self.sandbox.stub(child, 'render');
                state.append(context, parent, child);

                sinon.assert.notCalled(child.render);
            }
        );
    };

    this.AttachedStateTest.prototype.testPrependDoesNotCallRenderOnWidget = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/attachedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, AttachedState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, AttachedState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                self.sandbox.stub(child, 'render');
                state.prepend(context, parent, child);

                sinon.assert.notCalled(child.render);
            }
        );
    };

    this.AttachedStateTest.prototype.testAppendDoesNotAppendOutputElementOfWidgetToAnything = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/attachedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/device'
            ],
            function (application, AttachedState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, AttachedState);
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

    this.AttachedStateTest.prototype.testPrependDoesNotPrependOutputElementOfWidgetToAnything = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/attachedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, AttachedState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, AttachedState);
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

    this.AttachedStateTest.prototype.testAppendDoesNotChangeState = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/attachedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, AttachedState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, AttachedState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                self.sandbox.stub(child, 'render');
                state.append(context, parent, child);

                sinon.assert.notCalled(WidgetContext.prototype.setState);

            }
        );
    };

    this.AttachedStateTest.prototype.testPrependDoesNotChangeState = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/attachedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, AttachedState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);

                var state = createState(self, WidgetContext, AttachedState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                self.sandbox.stub(child, 'render');
                state.prepend(context, parent, child);

                sinon.assert.notCalled(WidgetContext.prototype.setState);
            }
        );
    };

    this.AttachedStateTest.prototype.testDetachCallsRemoveElementWithWidgetElement = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/attachedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice',
                'antie/widgets/carousel/strips/utility/attachedstate'
            ],
            function (application, AttachedState, WidgetContext, Widget, Device, AttachedState) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, AttachedState);
                var context = new WidgetContext();
                var child = new Widget();
                child.outputElement = "testElement";
                state.detach(context, child);
                sinon.assert.calledOnce(Device.prototype.removeElement);
                sinon.assert.calledWith(
                    Device.prototype.removeElement,
                    "testElement"
                );
            }
        );
    };

    this.AttachedStateTest.prototype.testDetachChangesStateToRendered = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/attachedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, AttachedState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);

                var state = createState(self, WidgetContext, AttachedState);
                var context = new WidgetContext();
                var child = new Widget();
                state.detach(context, child);
                sinon.assert.calledOnce(WidgetContext.prototype.setState);
                sinon.assert.calledWith(
                    WidgetContext.prototype.setState,
                    'RENDERED'
                );
            }
        );
    };

    this.AttachedStateTest.prototype.testAttachedReturnsTrue = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/attachedstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice',
                'antie/widgets/carousel/strips/utility/attachedstate'
            ],
            function (application, AttachedState, WidgetContext, Widget, Device, AttachedState) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, AttachedState);
                assertTrue(state.hasLength());
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
