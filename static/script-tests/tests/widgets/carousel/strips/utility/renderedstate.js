/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {

    this.RenderedStateTest = AsyncTestCase('RenderedState');

    this.RenderedStateTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.RenderedStateTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.RenderedStateTest.prototype.testAppendDoesNotCallRenderOnWidget = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                spyOn(child, 'render');
                state.append(context, parent, child);

                expect(child.render).not.toHaveBeenCalled();
            }
        );
    };

    this.RenderedStateTest.prototype.testPrependDoesNotCallRenderOnWidget = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                spyOn(child, 'render');
                state.prepend(context, parent, child);

                expect(child.render).not.toHaveBeenCalled();
            }
        );
    };

    this.RenderedStateTest.prototype.testAppendAppendsOutputElementOfWidgetToOutputElementOfParent = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                var childEl = 'child';
                var parentEl = 'parent';
                parent.outputElement = parentEl;
                child.outputElement = childEl;

                state.append(context, parent, child);

                expect(Device.prototype.appendChildElement.calls.count()).toBe(1);
                expect(Device.prototype.appendChildElement).toHaveBeenCalledWith('parent', 'child');
            }
        );
    };

    this.RenderedStateTest.prototype.testPrependPrependsOutputElementOfWidgetToOutputElementOfParent = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                var childEl = 'child';
                var parentEl = 'parent';
                parent.outputElement = parentEl;
                child.outputElement = childEl;

                state.prepend(context, parent, child);

                expect(Device.prototype.prependChildElement.calls.count()).toBe(1);
                expect(Device.prototype.prependChildElement).toHaveBeenCalledWith('parent', 'child');
            }
        );
    };

    this.RenderedStateTest.prototype.testAppendChangesContextStateToAttached = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                spyOn(child, 'render');
                state.append(context, parent, child);

                expect(WidgetContext.prototype.setState.calls.count()).toBe(1);
                expect(WidgetContext.prototype.setState).toHaveBeenCalledWith('ATTACHED');
            }
        );
    };

    this.RenderedStateTest.prototype.testPrependChangesContextStateToAttached = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                spyOn(child, 'render');
                state.prepend(context, parent, child);
                expect(WidgetContext.prototype.setState.calls.count()).toBe(1);
                expect(WidgetContext.prototype.setState).toHaveBeenCalledWith('ATTACHED');
            }
        );
    };

    this.RenderedStateTest.prototype.testDetachDoesNotCallRemoveElement = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                var child = new Widget();
                state.detach(child);
                expect(Device.prototype.removeElement).not.toHaveBeenCalled();
            }
        );
    };

    this.RenderedStateTest.prototype.testDetachDoesNotChangeState = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                var child = new Widget();
                state.detach(context, child);
                expect(WidgetContext.prototype.setState).not.toHaveBeenCalled();
            }
        );
    };

    this.RenderedStateTest.prototype.testAttachedReturnsFalse = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                assertFalse(state.hasLength());
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
