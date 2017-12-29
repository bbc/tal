/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {

    this.AttachedStateTest = AsyncTestCase('AttachedState');

    this.AttachedStateTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.AttachedStateTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.AttachedStateTest.prototype.testAppendDoesNotCallRenderOnWidget = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                spyOn(child, 'render');
                self.sandbox.stub(child, 'render');
                state.append(context, parent, child);
                expect(child.render).not.toHaveBeenCalled();
            }
        );
    };

    this.AttachedStateTest.prototype.testPrependDoesNotCallRenderOnWidget = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                spyOn(child, 'render');
                state.prepend(context, parent, child);
                expect(child.render).not.toHaveBeenCalled();
            }
        );
    };

    this.AttachedStateTest.prototype.testAppendDoesNotAppendOutputElementOfWidgetToAnything = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                var childEl = 'child';
                var parentEl = 'parent';
                parent.outputElement = parentEl;
                child.outputElement = childEl;
                state.append(context, parent, child);

                expect(Device.prototype.appendChildElement).not.toHaveBeenCalled();
            }
        );
    };

    this.AttachedStateTest.prototype.testPrependDoesNotPrependOutputElementOfWidgetToAnything = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                var childEl = 'child';
                var parentEl = 'parent';
                parent.outputElement = parentEl;
                child.outputElement = childEl;
                state.prepend(context, parent, child);

                expect(Device.prototype.appendChildElement).not.toHaveBeenCalled();
            }
        );
    };

    this.AttachedStateTest.prototype.testAppendDoesNotChangeState = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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

                expect(WidgetContext.prototype.setState).not.toHaveBeenCalled();
            }
        );
    };

    this.AttachedStateTest.prototype.testPrependDoesNotChangeState = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                expect(WidgetContext.prototype.setState).not.toHaveBeenCalled();
            }
        );
    };

    this.AttachedStateTest.prototype.testDetachCallsRemoveElementWithWidgetElement = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                child.outputElement = 'testElement';
                state.detach(context, child);
                expect(Device.prototype.removeElement.calls.count()).toBe(1);
                expect(Device.prototype.removeElement).toHaveBeenCalledWith('testElement');
            }
        );
    };

    this.AttachedStateTest.prototype.testDetachChangesStateToRendered = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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

                expect(WidgetContext.prototype.setState.calls.count()).toBe(1);
                expect(WidgetContext.prototype.setState).toHaveBeenCalledWith('RENDERED');
            }
        );
    };

    this.AttachedStateTest.prototype.testAttachedReturnsTrue = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                assertTrue(state.hasLength());
            }
        );
    };


    var createState = function (self, Context, State) {
        for (var i in Context.prototype) {
            if(Context.prototype.hasOwnProperty(i)) {
                spyOn(Context.prototype, i);
            }
        }
        return new State();
    };

    var stubWidgetToReturnStubAppAndDevice = function (self, Widget, Device, application) {
        for (var i in Device.prototype) {
            if(Device.prototype.hasOwnProperty(i)) {
                spyOn(Device.prototype, i);
            }
        }
        spyOn(Widget.prototype, 'getCurrentApplication').and.returnValue(application);

        spyOn(application, 'getDevice').and.returnValue(new Device());
    };
}());
