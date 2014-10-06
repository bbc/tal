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

require.def('tests/widgets/navigators/testhelpers/navigator',
    [
        'antie/widgets/button',
        'antie/widgets/label',
        'antie/widgets/container'
    ],
    function (Button, Label, Container) {

        return {
            setSandbox: function (sandbox) {
                this.sandbox = sandbox;
            },

            stubClassPrototypes: function (classArray) {
                function stubUnstubbedFunctions(Class) {
                    var prototype, propertyName, property;
                    prototype = Class.prototype;
                    for (propertyName in prototype) {
                        property = prototype[propertyName];
                        if ((typeof property === 'function') && !(property.restore && property.restore.sinon) && propertyName !== 'self') {
                            self.sandbox.stub(prototype, propertyName);
                        }
                    }
                }
                var i, currentClass, self;
                self = this;

                for (i = 0; i !== classArray.length; i += 1) {
                    currentClass = classArray[i];
                    stubUnstubbedFunctions(classArray[i]);
                }
            },

            createContainerWithWidgets: function (widgetArray) {
                var container;
                container = new Container();
                container.getChildWidgetCount.returns(widgetArray.length);
                container.getChildWidgets.returns(widgetArray);
                return container;
            },

            createNonFocussableWidget: function () {
                var widget;
                widget = new Button();
                widget.isFocusable = this.sandbox.stub().returns(false);
                return widget;
            },

            createFocussableWidget: function () {
                var widget;
                widget = new Button();
                widget.isFocusable = this.sandbox.stub().returns(true);
                return widget;
            },

            testNextIndexReturnsOneWithTwoItemsAndActiveIndexZero: function (NavClass, sandbox) {
                var container, navigator, widget;
                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container]);
                container = new Container();
                widget = this.createFocussableWidget();
                container.getChildWidgets.returns([widget, widget]);
                container.getIndexOfChildWidget.returns(0);
                container.getChildWidgetCount.returns(2);

                navigator = new NavClass(container);
                assertEquals('Index of second item returned', 1, navigator.nextIndex());
            },

            testIndexAfterZeroWithFocussableNextWidget: function (NavClass, sandbox) {
                var container, navigator, widget;
                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container]);
                container = new Container();
                widget = this.createFocussableWidget();
                container.getChildWidgets.returns([widget, widget]);
                container.getChildWidgetCount.returns(2);

                navigator = new NavClass(container);
                assertEquals('Index of second item returned', 1, navigator.indexAfter(0));
            },

            testPreviousIndexReturnsZeroWithTwoItemsAndActiveIndexOne: function (NavClass, sandbox) {
                var container, navigator, widget;
                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container]);
                container = new Container();
                widget = this.createFocussableWidget();
                container.getChildWidgets.returns([widget, widget]);
                container.getIndexOfChildWidget.returns(1);
                container.getChildWidgetCount.returns(2);

                navigator = new NavClass(container);
                assertEquals('Index of second item returned', 0, navigator.previousIndex());
            },

            testIndexBeforeOneWithFocussableIndexZero: function (NavClass, sandbox) {
                var container, navigator, widget;
                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container]);
                container = new Container();
                widget = this.createFocussableWidget();
                container.getChildWidgets.returns([widget, widget]);
                container.getChildWidgetCount.returns(2);
                navigator = new NavClass(container);
                assertEquals('Index of first item returned', 0, navigator.indexBefore(1));
            },

            testGetIndexReturnsIndexOfContainerActiveWidget: function (NavClass, sandbox) {
                var container, navigator, index;
                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container]);

                container = new Container();
                navigator = new NavClass(container);

                container.getActiveChildWidget.returns("widget");
                container.getIndexOfChildWidget.returns(4);

                index = navigator.currentIndex();

                assertTrue('getActiveChildWidget called on container', container.getActiveChildWidget.calledOnce);
                assertTrue('result of getActiveChildWidget passed to getIndexOfChildWidget on container', container.getIndexOfChildWidget.calledWith("widget"));
                assertEquals('return value of getIndexOfChildWidget returned from currentIndex', 4, index);
            },

            testGetIndexReturnsNullWithEmptyWidget: function (NavClass, sandbox) {
                var container, navigator, index;
                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container]);

                container = new Container();
                container.getIndexOfChildWidget.returns(-1);
                navigator = new NavClass(container);

                index = navigator.currentIndex();

                assertTrue('currentIndex null with empty container', null === index);
            },

            testSetContainerUpdatesContainer: function (NavClass) {
                var navigator;
                var container1, container2;
                container1 = { container: 1 };
                container2 = { container: 2 };
                navigator = new NavClass(container1);
                navigator.setContainer(container2);
                assertEquals("Container set correctly", container2, navigator._container);
            },

            testSetContainerCalledDuringInit: function (NavClass, sandbox) {
                var navigator, container;
                container = {test: 'test'};
                sandbox.stub(NavClass.prototype, "setContainer");
                navigator = new NavClass(container);
                assertTrue("Container set from constructor", NavClass.prototype.setContainer.calledOnce);
            },


            testNextIndexSkipsDisabledWidget: function (NavClass, sandbox) {
                var navigator, container, widget, disabledWidget, index;

                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container, Button]);

                widget = this.createFocussableWidget();
                disabledWidget = this.createNonFocussableWidget();
                container = this.createContainerWithWidgets([widget, disabledWidget, widget]);
                container.getIndexOfChildWidget.returns(0);

                navigator = new NavClass(container);
                index = navigator.nextIndex();

                assertEquals("Next enabled widget index returned", 2, index);
            },

            testIndexAfterSkipsDisabledWidget: function (NavClass, sandbox) {
                var navigator, container, widget, disabledWidget, index;

                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container, Button]);

                widget = this.createFocussableWidget();
                disabledWidget = this.createNonFocussableWidget();
                container = this.createContainerWithWidgets([widget, disabledWidget, widget]);
                navigator = new NavClass(container);
                index = navigator.indexAfter(0);

                assertEquals("Next enabled widget index returned", 2, index);
            },

            testPreviousIndexSkipsDisabledWidget: function (NavClass, sandbox) {
                var navigator, container, widget, disabledWidget, index;

                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container, Button]);

                widget = this.createFocussableWidget();
                disabledWidget = this.createNonFocussableWidget();
                container = this.createContainerWithWidgets([widget, disabledWidget, widget]);
                container.getIndexOfChildWidget.returns(2);

                navigator = new NavClass(container);
                index = navigator.previousIndex();

                assertEquals("Previous enabled widget index returned", 0, index);
            },

            testIndexBeforeSkipsDisabledWidget: function (NavClass, sandbox) {
                var navigator, container, widget, disabledWidget, index;

                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container, Button]);

                widget = this.createFocussableWidget();
                disabledWidget = this.createNonFocussableWidget();
                container = this.createContainerWithWidgets([widget, disabledWidget, widget]);

                navigator = new NavClass(container);
                index = navigator.indexBefore(2);

                assertEquals("Previous enabled widget index returned", 0, index);
            },

            testNextIndexReturnsNullWhenAllOtherWidgetsDisabled: function (NavClass, sandbox) {
                var navigator, container, widget, disabledWidget, index;

                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container, Button]);

                widget = this.createFocussableWidget();
                disabledWidget = this.createNonFocussableWidget();
                container = this.createContainerWithWidgets([widget, disabledWidget, disabledWidget]);
                container.getIndexOfChildWidget.returns(0);

                navigator = new NavClass(container);
                index = navigator.nextIndex();

                assertTrue("Next index null when all following disabled", index === null);
            },

            testIndexAfterReturnsNullWhenAllOtherWidgetsDisabled: function (NavClass, sandbox) {
                var navigator, container, widget, disabledWidget, index;

                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container, Button]);

                widget = this.createFocussableWidget();
                disabledWidget = this.createNonFocussableWidget();
                container = this.createContainerWithWidgets([widget, disabledWidget, disabledWidget]);

                navigator = new NavClass(container);
                index = navigator.indexAfter(0);
                assertEquals("Index after 0 null when all following disabled", null, index);
                assertTrue("Index after 0 null when all following disabled", index === null);
            },

            testPreviousIndexReturnsNullWhenAllOtherWidgetsDisabled: function (NavClass, sandbox) {
                var navigator, container, widget, disabledWidget, index;

                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container, Button]);

                widget = this.createFocussableWidget();
                disabledWidget = this.createNonFocussableWidget();
                container = this.createContainerWithWidgets([disabledWidget, disabledWidget, widget]);
                container.getIndexOfChildWidget.returns(2);

                navigator = new NavClass(container);
                index = navigator.previousIndex();

                assertTrue("Next index null when all preceding disabled", index === null);
            },

            testIndexBeforeReturnsNullWhenAllOtherWidgetsDisabled: function (NavClass, sandbox) {
                var navigator, container, widget, disabledWidget, index;

                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container, Button]);

                widget = this.createFocussableWidget();
                disabledWidget = this.createNonFocussableWidget();
                container = this.createContainerWithWidgets([disabledWidget, disabledWidget, widget]);

                navigator = new NavClass(container);
                index = navigator.indexBefore(2);
                assertEquals("Index before 2 null when all preceding disabled", null, index);
                assertTrue("Index before 2  null when all preceding disabled", index === null);
            },

            testSetIndexActivatesValidIndexOfActivatableWidget: function (NavClass, sandbox) {
                var navigator, container, widget;

                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container, Button]);

                widget = this.createFocussableWidget();
                container = this.createContainerWithWidgets([widget, widget]);

                navigator = new NavClass(container);
                navigator.setIndex(1);

                assertTrue("Widget set active", container.setActiveChildIndex.withArgs(1).called);
            },

            testSetIndexOnInvalidIndexDoesNotChangeActivation: function (NavClass, sandbox) {
                var navigator, container, widget;

                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container, Button]);

                widget = this.createFocussableWidget();
                container = this.createContainerWithWidgets([widget, widget]);

                navigator = new NavClass(container);
                navigator.setIndex(2);
                navigator.setIndex(-1);
                navigator.setIndex(null);
                navigator.setIndex();
                navigator.setIndex("invalid");

                assertFalse("Active widget changed", container.setActiveChildIndex.called);
            },

            testSetIndexOnIndexOfDisabledWidgetDoesNotChangeActivation: function (NavClass, sandbox) {
                var navigator, container, widget, disabledWidget;

                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container, Button]);

                widget = this.createFocussableWidget();
                disabledWidget = this.createNonFocussableWidget();
                container = this.createContainerWithWidgets([widget, disabledWidget]);
                navigator = new NavClass(container);
                navigator.setIndex(1);

                assertFalse("Active widget changed", container.setActiveChildIndex.called);
            },

            testIndexCountItemCountOfContainer: function (NavClass, sandbox) {
                var navigator, container, widget;

                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container, Button]);

                widget = this.createFocussableWidget();
                container = this.createContainerWithWidgets([widget, widget, widget, widget]);
                navigator = new NavClass(container);

                assertEquals("length returns item count of container", 4, navigator.indexCount());
            },

            testSelectedItemChangedEventFiredWhenIndexSetSuccessfully: function (NavClass, sandbox) {
                var navigator, container, widget;

                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container, Button]);

                widget = this.createFocussableWidget();
                container = this.createContainerWithWidgets([widget, widget]);
                container.bubbleEvent = this.sandbox.stub();
                navigator = new NavClass(container);
                navigator.setIndex(1);

                assertEquals("selecteditemchange event fired on container", 'selecteditemchange', container.bubbleEvent.secondCall.args[0].type);
            },

            testBeforeSelectedItemChangedEventFiredBeforeIndexSetSuccessfully: function (NavClass, sandbox) {
                var navigator, container, widget;

                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container, Button]);

                widget = this.createFocussableWidget();
                container = this.createContainerWithWidgets([widget, widget]);
                container.bubbleEvent = this.sandbox.stub();
                navigator = new NavClass(container);
                navigator.setIndex(1);

                assertEquals("beforeselecteditemchange event fired on container", 'beforeselecteditemchange', container.bubbleEvent.firstCall.args[0].type);
            },

            testSelectedItemChangedEventNotFiredWhenIndexNotSetSuccessfully: function (NavClass, sandbox) {
                var navigator, container, widget, disabledWidget;

                this.setSandbox(sandbox);
                this.stubClassPrototypes([Container, Button]);

                widget = this.createFocussableWidget();
                disabledWidget = this.createNonFocussableWidget();
                container = this.createContainerWithWidgets([widget, disabledWidget]);
                container.bubbleEvent = this.sandbox.stub();
                navigator = new NavClass(container);
                navigator.setIndex(1);

                assertFalse("event fired on container", container.bubbleEvent.calledOnce);
            },

            getNestedContainer: function () {
                var outer, inner;
                outer = new Container('outer');
                inner = new Container('inner');
                outer.appendChildWidget(inner);
                return inner;
            }




        };
    }
);
