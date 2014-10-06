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
    this.WidgetContextTest = AsyncTestCase("WidgetContext");

    this.WidgetContextTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.WidgetContextTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.WidgetContextTest.prototype.testStateINITOnInit = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/carousel/strips/utility/states'
            ],
            function (application, WidgetContext, States) {
                self.sandbox.stub(States.INIT.prototype);
                var context = createContext(self, WidgetContext, {}, {}, States);
                context.append();
                sinon.assert.calledOnce(States.INIT.prototype.append);
            }
        );
    };

    this.WidgetContextTest.prototype.testAppendCalledOnNewStateAfterSetState = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
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
                sinon.assert.calledOnce(States[stateName].prototype.append);
            }
        );
    };

    this.WidgetContextTest.prototype.testAppendPassedParentAndWidgetContextInitialisedWith = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
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
                sinon.assert.calledWith(
                    States[stateName].prototype.append,
                    context,
                    parent,
                    widget
                );
            }
        );
    };

    this.WidgetContextTest.prototype.testPrependPassedParentAndWidgetContextInitialisedWith = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
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
                sinon.assert.calledWith(
                    States[stateName].prototype.prepend,
                    context,
                    parent,
                    widget
                );
            }
        );
    };

    this.WidgetContextTest.prototype.testDetatchPassedWidgetContextInitialisedWith = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
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
                sinon.assert.calledWith(
                    States[stateName].prototype.detach,
                    context,
                    widget
                );
            }
        );
    };

    this.WidgetContextTest.prototype.testAttachedReturnsValueFromState = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
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
                States[stateName].prototype.hasLength.returns("boo");
                var attached = context.hasLength();
                assertEquals('value from state returned on hasLength', "boo", attached);
            }
        );
    };

    this.WidgetContextTest.prototype.testStateInititalisedOnStateChange = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
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
                self.sandbox.stub(States[stateName].prototype);
                var context = new WidgetContext(widget, parent, States);
                States[stateName].prototype.init.reset();
                context.setState(stateName);
                sinon.assert.calledOnce(
                    States[stateName].prototype.init
                );
            }
        );
    };

    var createContextInState = function (self, Context, STATES, stateName, widget, parent) {
        var context = createContext(self, Context, widget, parent, STATES);
        self.sandbox.stub(STATES[stateName].prototype);
        context.setState(stateName);
        return context;
    };

    var createContext = function (self, Context, widget, parent, STATES) {
        self.sandbox.stub(widget);
        self.sandbox.stub(parent);
        return new Context(widget, parent, STATES);
    };
}());
