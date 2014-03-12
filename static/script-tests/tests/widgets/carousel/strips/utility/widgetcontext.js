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
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/carousel/strips/utility/states'
            ],
            function (application, WidgetContext, States) {
                this.sandbox.stub(States.INIT.prototype);
                var context = new WidgetContext();
                context.append();
                sinon.assert.calledOnce(States.INIT.prototype.append);
            }
        );
    };

    this.WidgetContextTest.prototype.testAppendCalledOnNewStateAfterSetState = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/utility/widgetcontext',
                'antie/widgets/carousel/strips/utility/states',
                'antie/widgets/widget'
            ],
            function (application, WidgetContext, States, Widget) {
                var stateName = 'ATTACHED';
                var context = this.createContextInState(WidgetContext, States, stateName, new Widget());
                context.append();
                sinon.assert.calledOnce(States[stateName].prototype.append);
            }
        );
    };

    this.WidgetContextTest.prototype.testAppendPassedParentAndWidgetContextInitialisedWith = function (queue) {
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
                var context = this.createContextInState(WidgetContext, States, stateName, widget, parent);
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
                var context = this.createContextInState(WidgetContext, States, stateName, widget, parent);
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
                var context = this.createContextInState(WidgetContext, States, stateName, widget, parent);
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
                var context = this.createContextInState(WidgetContext, States, stateName, widget, parent);
                States[stateName].prototype.hasLength.returns("boo");
                var attached = context.hasLength();
                assertEquals('value from state returned on hasLength', "boo", attached);
            }
        );
    };

    this.WidgetContextTest.prototype.testStateInititalisedOnStateChange = function (queue) {
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
                this.sandbox.stub(States[stateName].prototype);
                var context = new WidgetContext(widget, parent);
                States[stateName].prototype.init.reset();
                context.setState(stateName);
                sinon.assert.calledOnce(
                    States[stateName].prototype.init
                );
            }
        );
    };

    this.WidgetContextTest.prototype.createContextInState = function (Context, States, stateName, widget, parent) {
        var context = this.createContext(Context, widget, parent);
        this.sandbox.stub(States[stateName].prototype);
        context.setState(stateName);
        return context;
    };

    this.WidgetContextTest.prototype.createContext = function (Context, widget, parent) {
        this.sandbox.stub(widget);
        this.sandbox.stub(parent);
        return new Context(widget, parent);
    };
}());