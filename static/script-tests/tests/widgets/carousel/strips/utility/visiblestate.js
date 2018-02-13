/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {

    this.VisibleStateTest = AsyncTestCase('VisibleState');

    this.VisibleStateTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.VisibleStateTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.VisibleStateTest.prototype.testAppendDoesNotCallRenderOnWidget = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                spyOn(child, 'render');
                state.append(context, parent, child);

                expect(child.render).not.toHaveBeenCalled();
            }
        );
    };

    this.VisibleStateTest.prototype.testPrependDoesNotCallRenderOnWidget = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                spyOn(child, 'render');
                state.prepend(context, parent, child);

                expect(child.render).not.toHaveBeenCalled();
            }
        );
    };

    this.VisibleStateTest.prototype.testAppendDoesNotAppendOutputElementOfWidgetToAnything = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                var childEl = 'child';
                var parentEl = 'parent';
                parent.outputElement = parentEl;
                child.outputElement = childEl;
                state.append(context, parent, child);

                expect(Device.prototype.appendChildElement).not.toHaveBeenCalled();
            }
        );
    };

    this.VisibleStateTest.prototype.testPrependDoesNotPrependOutputElementOfWidgetToAnything = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                var childEl = 'child';
                var parentEl = 'parent';
                parent.outputElement = parentEl;
                child.outputElement = childEl;
                state.prepend(context, parent, child);

                expect(Device.prototype.prependChildElement).not.toHaveBeenCalled();
            }
        );
    };

    this.VisibleStateTest.prototype.testAppendDoesNotChangeState = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                spyOn(child, 'render');
                state.append(context, parent, child);

                expect(WidgetContext.prototype.setState).not.toHaveBeenCalled();
            }
        );
    };

    this.VisibleStateTest.prototype.testPrependDoesNotChangeState = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                spyOn(child, 'render');
                state.prepend(context, parent, child);
                expect(WidgetContext.prototype.setState).not.toHaveBeenCalled();
            }
        );
    };

    this.VisibleStateTest.prototype.testDetachCallsHideElementWithWidgetElement = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                child.outputElement = 'testElement';
                state.detach(context, child);
                expect(Device.prototype.hideElement.calls.count()).toBe(1);
                expect(Device.prototype.hideElement).toHaveBeenCalledWith(jasmine.objectContaining({el: 'testElement'}));
            }
        );
    };

    this.VisibleStateTest.prototype.testDetachChangesStateToHidden = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
                expect(WidgetContext.prototype.setState.calls.count()).toBe(1);
                expect(WidgetContext.prototype.setState).toHaveBeenCalledWith('HIDDEN');
            }
        );
    };

    this.VisibleStateTest.prototype.testHasLengthReturnsTrue = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
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
        queuedApplicationInit(
            queue,
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
