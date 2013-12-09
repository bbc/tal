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
    this.InitStateTest = AsyncTestCase("InitState");

    this.InitStateTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.InitStateTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.InitStateTest.prototype.testAppendCallsRenderOnWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/initstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, InitState, WidgetContext, Widget, Device) {
                this.stubWidgetToReturnStubAppAndDevice(Widget, Device, application);
                var state = this.createState(WidgetContext, InitState);
                var parent = new Widget();
                var child = new Widget();
                this.sandbox.stub(child, 'render');
                state.append(parent, child);

                sinon.assert.calledOnce(child.render);
                sinon.assert.calledWith(
                    child.render,
                    sinon.match.instanceOf(Device)
                );
            }
        );
    };

    this.InitStateTest.prototype.testPrependCallsRenderOnWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/initstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, InitState, WidgetContext, Widget, Device) {
                this.stubWidgetToReturnStubAppAndDevice(Widget, Device, application);
                var state = this.createState(WidgetContext, InitState);
                var parent = new Widget();
                var child = new Widget();
                this.sandbox.stub(child, 'render');
                state.prepend(parent, child);

                sinon.assert.calledOnce(child.render);
                sinon.assert.calledWith(
                    child.render,
                    sinon.match.instanceOf(Device)
                );
            }
        );
    };

    this.InitStateTest.prototype.testAppendAppendsOutputElementOfWidgetToOutputElementOfParent = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/initstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/device'
            ],
            function (application, InitState, WidgetContext, Widget, Device) {
                this.stubWidgetToReturnStubAppAndDevice(Widget, Device, application);
                var state = this.createState(WidgetContext, InitState);
                var parent = new Widget();
                var child = new Widget();
                var childEl = "child";
                var parentEl = "parent";
                parent.outputElement = parentEl;
                this.sandbox.stub(child, 'render', function () {
                    this.outputElement = childEl;
                });

                state.append(parent, child);

                sinon.assert.calledOnce(Device.prototype.appendChildElement);
                sinon.assert.calledWith(
                    Device.prototype.appendChildElement,
                    "parent",
                    "child"
                );
            }
        );
    };

    this.InitStateTest.prototype.testPrependPrependsOutputElementOfWidgetToOutputElementOfParent = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/initstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, InitState, WidgetContext, Widget, Device) {
                this.stubWidgetToReturnStubAppAndDevice(Widget, Device, application);
                var state = this.createState(WidgetContext, InitState);
                var parent = new Widget();
                var child = new Widget();
                var childEl = "child";
                var parentEl = "parent";
                parent.outputElement = parentEl;
                this.sandbox.stub(child, 'render', function () {
                    this.outputElement = childEl;
                });

                state.prepend(parent, child);

                sinon.assert.calledOnce(Device.prototype.prependChildElement);
                sinon.assert.calledWith(
                    Device.prototype.prependChildElement,
                    "parent",
                    "child"
                );
            }
        );
    };

    this.InitStateTest.prototype.testAppendChangesContextStateToAttached = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/initstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice',
                'antie/widgets/carousel/strips/utility/attachedstate'
            ],
            function (application, InitState, WidgetContext, Widget, Device, AttachedState) {
                this.stubWidgetToReturnStubAppAndDevice(Widget, Device, application);
                var state = this.createState(WidgetContext, InitState);
                var parent = new Widget();
                var child = new Widget();
                this.sandbox.stub(child, 'render');
                state.append(parent, child);

                sinon.assert.calledOnce(WidgetContext.prototype.setState);
                sinon.assert.calledWith(
                    WidgetContext.prototype.setState,
                    AttachedState
                );
            }
        );
    };

    this.InitStateTest.prototype.testPrependChangesContextStateToAttached = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/initstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice',
                'antie/widgets/carousel/strips/utility/attachedstate'
            ],
            function (application, InitState, WidgetContext, Widget, Device, AttachedState) {
                this.stubWidgetToReturnStubAppAndDevice(Widget, Device, application);
                var state = this.createState(WidgetContext, InitState);
                var parent = new Widget();
                var child = new Widget();
                this.sandbox.stub(child, 'render');
                state.prepend(parent, child);

                sinon.assert.calledOnce(WidgetContext.prototype.setState);
                sinon.assert.calledWith(
                    WidgetContext.prototype.setState,
                    AttachedState
                );
            }
        );
    };

    this.InitStateTest.prototype.testDetachDoesNotCallRemoveElement = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/initstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice',
                'antie/widgets/carousel/strips/utility/attachedstate'
            ],
            function (application, InitState, WidgetContext, Widget, Device, AttachedState) {
                this.stubWidgetToReturnStubAppAndDevice(Widget, Device, application);
                var state = this.createState(WidgetContext, InitState);
                var child = new Widget();
                state.detach(child);
                sinon.assert.notCalled(Device.prototype.removeElement);
            }
        );
    };

    this.InitStateTest.prototype.testDetachDoesNotChangeState = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/initstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice',
                'antie/widgets/carousel/strips/utility/attachedstate'
            ],
            function (application, InitState, WidgetContext, Widget, Device, AttachedState) {
                this.stubWidgetToReturnStubAppAndDevice(Widget, Device, application);
                var state = this.createState(WidgetContext, InitState);
                var child = new Widget();
                state.detach(child);
                sinon.assert.notCalled(WidgetContext.prototype.setState);
            }
        );
    };

    this.InitStateTest.prototype.testAttachedReturnsFalse = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/initstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice',
                'antie/widgets/carousel/strips/utility/attachedstate'
            ],
            function (application, InitState, WidgetContext, Widget, Device, AttachedState) {
                this.stubWidgetToReturnStubAppAndDevice(Widget, Device, application);
                var state = this.createState(WidgetContext, InitState);
                assertFalse(state.attached());
            }
        );
    };


    this.InitStateTest.prototype.createState = function (Context, State) {
        this.sandbox.stub(Context.prototype);
        return new State(new Context());
    };

    this.InitStateTest.prototype.stubWidgetToReturnStubAppAndDevice = function (Widget, Device, application) {
        this.sandbox.stub(Device.prototype);
        this.sandbox.stub(Widget.prototype, 'getCurrentApplication');
        Widget.prototype.getCurrentApplication.returns(application);
        this.sandbox.stub(application, 'getDevice').returns(new Device());
    };
}());