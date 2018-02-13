/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {

    this.HiddenStateTest = AsyncTestCase('HiddenState');

    this.HiddenStateTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.HiddenStateTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.HiddenStateTest.prototype.testAppendDoesNotCallRenderOnWidget = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/hiddenstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, HiddenState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, HiddenState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                spyOn(child, 'render');
                state.append(context, parent, child);

                expect(child.render).not.toHaveBeenCalled();
            }
        );
    };

    this.HiddenStateTest.prototype.testPrependDoesNotCallRenderOnWidget = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/hiddenstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, HiddenState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, HiddenState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                spyOn(child, 'render');
                state.prepend(context, parent, child);
                expect(child.render).not.toHaveBeenCalled();
            }
        );
    };

    this.HiddenStateTest.prototype.testAppendShowsElement = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/hiddenstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/device'
            ],
            function (application, HiddenState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, HiddenState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                var childEl = 'child';
                var parentEl = 'parent';
                parent.outputElement = parentEl;
                child.outputElement = childEl;

                state.append(context, parent, child);

                expect(Device.prototype.showElement.calls.count()).toBe(1);
                expect(Device.prototype.showElement).toHaveBeenCalledWith(jasmine.objectContaining({el: childEl}));
            }
        );
    };

    this.HiddenStateTest.prototype.testPrependPrependsOutputElementOfWidgetToOutputElementOfParent = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/hiddenstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, HiddenState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, HiddenState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                var childEl = 'child';
                var parentEl = 'parent';
                parent.outputElement = parentEl;
                child.outputElement = childEl;
                state.prepend(context, parent, child);

                expect(Device.prototype.showElement.calls.count()).toBe(1);
                expect(Device.prototype.showElement).toHaveBeenCalledWith(jasmine.objectContaining({el: childEl}));
            }
        );
    };

    this.HiddenStateTest.prototype.testAppendChangesContextStateToVisible = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/hiddenstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, HiddenState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, HiddenState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                self.sandbox.stub(child, 'render');
                state.append(context, parent, child);

                expect(WidgetContext.prototype.setState.calls.count()).toBe(1);
                expect(WidgetContext.prototype.setState).toHaveBeenCalledWith('ATTACHED');
            }
        );
    };

    this.HiddenStateTest.prototype.testPrependChangesContextStateToVisible = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/hiddenstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, HiddenState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);

                var state = createState(self, WidgetContext, HiddenState);
                var context = new WidgetContext();
                var parent = new Widget();
                var child = new Widget();
                self.sandbox.stub(child, 'render');
                state.prepend(context, parent, child);

                expect(WidgetContext.prototype.setState.calls.count()).toBe(1);
                expect(WidgetContext.prototype.setState).toHaveBeenCalledWith('ATTACHED');
            }
        );
    };

    this.HiddenStateTest.prototype.testDetachDoesNotCallRemoveElement = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/hiddenstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, HiddenState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, HiddenState);
                var child = new Widget();
                state.detach(child);
                expect(Device.prototype.removeElement).not.toHaveBeenCalled();
            }
        );
    };

    this.HiddenStateTest.prototype.testDetachDoesNotChangeState = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/hiddenstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, HiddenState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, HiddenState);
                var context = new WidgetContext();
                var child = new Widget();
                state.detach(context, child);
                expect(WidgetContext.prototype.setState).not.toHaveBeenCalled();
            }
        );
    };

    this.HiddenStateTest.prototype.testHasLengthReturnsTrue = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/hiddenstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, HiddenState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, HiddenState);
                assertTrue(state.hasLength());
            }
        );
    };

    this.HiddenStateTest.prototype.testNotInView = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/hiddenstate',
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/widget',
                'antie/devices/browserdevice'
            ],
            function (application, HiddenState, WidgetContext, Widget, Device) {
                stubWidgetToReturnStubAppAndDevice(self, Widget, Device, application);
                var state = createState(self, WidgetContext, HiddenState);
                assertFalse(state.inView());
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
