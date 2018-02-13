/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {

    this.WidgetContextTest = AsyncTestCase('WidgetContext');

    this.WidgetContextTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.WidgetContextTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.WidgetContextTest.prototype.testStateINITOnInit = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/carousel/strips/utility/states'
            ],
            function (application, WidgetContext, States) {
                spyOn(States.INIT.prototype, 'append');
                var context = createContext(self, WidgetContext, {}, {}, States);
                context.append();
                expect(States.INIT.prototype.append.calls.count()).toBe(1);
            }
        );
    };

    this.WidgetContextTest.prototype.testAppendCalledOnNewStateAfterSetState = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/carousel/strips/utility/states',
                'antie/widgets/widget'
            ],
            function (application, WidgetContext, States, Widget) {
                var stateName = 'ATTACHED';
                var context = createContextInState(self, WidgetContext, States, stateName, new Widget());
                context.append();
                expect(States[stateName].prototype.append.calls.count()).toBe(1);
            }
        );
    };

    this.WidgetContextTest.prototype.testAppendPassedParentAndWidgetContextInitialisedWith = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/carousel/strips/utility/states',
                'antie/widgets/widget'
            ],
            function (application, WidgetContext, States, Widget) {
                var stateName = 'ATTACHED';
                var widget = new Widget();
                var parent = new Widget();
                var context = createContextInState(self, WidgetContext, States, stateName, widget, parent);
                context.append();
                expect(States[stateName].prototype.append).toHaveBeenCalledWith(context, parent, widget);
            }
        );
    };

    this.WidgetContextTest.prototype.testPrependPassedParentAndWidgetContextInitialisedWith = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/carousel/strips/utility/states',
                'antie/widgets/widget'
            ],
            function (application, WidgetContext, States, Widget) {
                var stateName = 'ATTACHED';
                var widget = new Widget();
                var parent = new Widget();
                var context = createContextInState(self, WidgetContext, States, stateName, widget, parent);
                context.prepend();
                expect(States[stateName].prototype.prepend).toHaveBeenCalledWith(context, parent, widget);
            }
        );
    };

    this.WidgetContextTest.prototype.testDetatchPassedWidgetContextInitialisedWith = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/carousel/strips/utility/states',
                'antie/widgets/widget'
            ],
            function (application, WidgetContext, States, Widget) {
                var stateName = 'ATTACHED';
                var widget = new Widget();
                var parent = new Widget();
                var context = createContextInState(self, WidgetContext, States, stateName, widget, parent);
                context.detach();
                expect(States[stateName].prototype.detach).toHaveBeenCalledWith(context, widget);
            }
        );
    };

    this.WidgetContextTest.prototype.testAttachedReturnsValueFromState = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/carousel/strips/utility/states',
                'antie/widgets/widget'
            ],
            function (application, WidgetContext, States, Widget) {
                var stateName = 'ATTACHED';
                var widget = new Widget();
                var parent = new Widget();
                var context = createContextInState(self, WidgetContext, States, stateName, widget, parent);
                States[stateName].prototype.hasLength.and.returnValue('boo');
                var attached = context.hasLength();
                assertEquals('value from state returned on hasLength', 'boo', attached);
            }
        );
    };

    this.WidgetContextTest.prototype.testStateInititalisedOnStateChange = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/carousel/strips/utility/states',
                'antie/widgets/widget'
            ],
            function (application, WidgetContext, States, Widget) {
                var stateName = 'ATTACHED';
                var widget = new Widget();
                var parent = new Widget();
                spyOn(States[stateName].prototype, 'init');
                var context = new WidgetContext(widget, parent, States);
                context.setState(stateName);
                expect(States[stateName].prototype.init.calls.count()).toBe(1);
            }
        );
    };

    var createContextInState = function (self, Context, STATES, stateName, widget, parent) {
        var context = createContext(self, Context, widget, parent, STATES);
        for (var i in STATES[stateName].prototype) {
            if(STATES[stateName].prototype.hasOwnProperty(i)) {
                spyOn(STATES[stateName].prototype, i);
            }
        }
        context.setState(stateName);
        return context;
    };

    var createContext = function (self, Context, widget, parent, STATES) {
        for (var i in widget) {
            if(widget.hasOwnProperty(i)) {
                spyOn(widget, i);
            }
        }
        for (i in parent) {
            if(parent.hasOwnProperty(i)) {
                spyOn(parent, i);
            }
        }
        return new Context(widget, parent, STATES);
    };
}());
