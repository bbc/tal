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
    this.WrappingNavigatorTest = AsyncTestCase("WrappingNavigator");

    this.WrappingNavigatorTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.WrappingNavigatorTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.WrappingNavigatorTest.prototype.testNextIndexReturnsOneWithTwoItemsAndActiveIndexZero = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testNextIndexReturnsOneWithTwoItemsAndActiveIndexZero(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testPreviousIndexReturnsZeroWithTwoItemsAndActiveIndexOne = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testPreviousIndexReturnsZeroWithTwoItemsAndActiveIndexOne(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testGetIndexReturnsIndexOfContainerActiveWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testGetIndexReturnsIndexOfContainerActiveWidget(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testSetContainer = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testSetContainerUpdatesContainer(WrappingNavigator);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testSetContainerCalledFromInit = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testSetContainerCalledDuringInit(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testNextIndexSkipsDisabledWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testNextIndexSkipsDisabledWidget(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testPreviousIndexSkipsDisabledWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testPreviousIndexSkipsDisabledWidget(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testNextIndexReturnsNullWhenAllOtherWidgetsDisabled = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testNextIndexReturnsNullWhenAllOtherWidgetsDisabled(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testPreviousIndexReturnsNullWhenAllOtherWidgetsDisabled = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testPreviousIndexReturnsNullWhenAllOtherWidgetsDisabled(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testSetIndexActivatesValidIndexOfActivatableWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testSetIndexActivatesValidIndexOfActivatableWidget(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testSetIndexOnInvalidIndexDoesNotChangeActivation = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testSetIndexOnInvalidIndexDoesNotChangeActivation(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testSetIndexOnIndexOfDisabledWidgetDoesNotChangeActivation = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testSetIndexOnIndexOfDisabledWidgetDoesNotChangeActivation(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testIndexCountItemCountOfContainer = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testIndexCountItemCountOfContainer(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testSelectedItemChangedEventFiredWhenIndexSetSuccessfully = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testSelectedItemChangedEventFiredWhenIndexSetSuccessfully(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testSelectedItemChangedEventNotFiredWhenIndexNotSetSuccessfully = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testSelectedItemChangedEventNotFiredWhenIndexNotSetSuccessfully(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testIndexAfterZeroWithFocussableNextWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testIndexAfterZeroWithFocussableNextWidget(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testIndexBeforeOneWithFocussableIndexZero = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testIndexBeforeOneWithFocussableIndexZero(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testIndexAfterSkipsDisabledWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testIndexAfterSkipsDisabledWidget(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testIndexBeforeSkipsDisabledWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testIndexBeforeSkipsDisabledWidget(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testIndexAfterReturnsNullWhenAllOtherWidgetsDisabled = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testIndexAfterReturnsNullWhenAllOtherWidgetsDisabled(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testIndexBeforeReturnsNullWhenAllOtherWidgetsDisabled = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testIndexBeforeReturnsNullWhenAllOtherWidgetsDisabled(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testBeforeSelectedItemChangedEventFiredBeforeIndexSetSuccessfully = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testBeforeSelectedItemChangedEventFiredBeforeIndexSetSuccessfully(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testGetIndexReturnsNullWithEmptyWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, NavHelper) {
                NavHelper.testGetIndexReturnsNullWithEmptyWidget(WrappingNavigator, this.sandbox);
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testPreviousIndexFromFirstPositionReturnsLastIndex = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "antie/widgets/container",
                "antie/widgets/button",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, Container, Button, NavHelper) {
                var container, navigator, button;
                NavHelper.setSandbox(this.sandbox);
                NavHelper.stubClassPrototypes([Container, Button]);
                button = NavHelper.createFocussableWidget();
                container = NavHelper.createContainerWithWidgets([button, button, button]);
                container.getIndexOfChildWidget.returns(0);

                navigator = new WrappingNavigator(container);

                assertEquals('previousIndex from first widget returns last index', 2, navigator.previousIndex());
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testNextIndexFromLastPositionReturnsFirstIndex = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "antie/widgets/container",
                "antie/widgets/button",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, Container, Button, NavHelper) {
                var container, navigator, button;
                NavHelper.setSandbox(this.sandbox);
                NavHelper.stubClassPrototypes([Container, Button]);
                button = NavHelper.createFocussableWidget();
                container = NavHelper.createContainerWithWidgets([button, button, button]);
                container.getIndexOfChildWidget.returns(2);

                navigator = new WrappingNavigator(container);

                assertEquals('nextIndex from last widget returns 0 index', 0, navigator.nextIndex());
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testNextIndexFromPenultimatePositionWithDisabledLastWidgetReturnsFirstIndex = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "antie/widgets/container",
                "antie/widgets/button",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, Container, Button, NavHelper) {
                var container, navigator, button, disabledButton;
                NavHelper.setSandbox(this.sandbox);
                NavHelper.stubClassPrototypes([Container, Button]);
                button = NavHelper.createFocussableWidget();
                disabledButton = NavHelper.createNonFocussableWidget();
                container = NavHelper.createContainerWithWidgets([button, button, disabledButton]);
                container.getIndexOfChildWidget.returns(1);

                navigator = new WrappingNavigator(container);

                assertEquals('nextIndex from penultimate widget with disabled last widget returns 0 index', 0, navigator.nextIndex());
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testNextIndexFromLastPositionWithDisabledFirstWidgetReturnsSecondIndex = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "antie/widgets/container",
                "antie/widgets/button",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, Container, Button, NavHelper) {
                var container, navigator, button, disabledButton;
                NavHelper.setSandbox(this.sandbox);
                NavHelper.stubClassPrototypes([Container, Button]);
                button = NavHelper.createFocussableWidget();
                disabledButton = NavHelper.createNonFocussableWidget();
                container = NavHelper.createContainerWithWidgets([disabledButton, button, button]);
                container.getIndexOfChildWidget.returns(2);
                navigator = new WrappingNavigator(container);
                assertEquals('nextIndex from last widget with disabled last first returns second index', 1, navigator.nextIndex());
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testPreviousIndexFromSecondPositionWithDisabledFirstWidgetReturnsLastIndex = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "antie/widgets/container",
                "antie/widgets/button",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, Container, Button, NavHelper) {
                var container, navigator, button, disabledButton;
                NavHelper.setSandbox(this.sandbox);
                NavHelper.stubClassPrototypes([Container, Button]);
                button = NavHelper.createFocussableWidget();
                disabledButton = NavHelper.createNonFocussableWidget();
                container = NavHelper.createContainerWithWidgets([disabledButton, button, button]);
                container.getIndexOfChildWidget.returns(1);
                navigator = new WrappingNavigator(container);
                assertEquals('previousIndex from second widget with disabled first widget returns last index', 2, navigator.previousIndex());
            }
        );
    };

    this.WrappingNavigatorTest.prototype.testPreviousIndexFromFirstPositionWithDisabledLastWidgetReturnsPenultimateIndex = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/navigators/wrappingnavigator",
                "antie/widgets/container",
                "antie/widgets/button",
                "tests/widgets/navigators/testhelpers/navigator"
            ],
            function (application, WrappingNavigator, Container, Button, NavHelper) {
                var container, navigator, button, disabledButton;
                NavHelper.setSandbox(this.sandbox);
                NavHelper.stubClassPrototypes([Container, Button]);
                button = NavHelper.createFocussableWidget();
                disabledButton = NavHelper.createNonFocussableWidget();
                container = NavHelper.createContainerWithWidgets([button, button, disabledButton]);
                container.getIndexOfChildWidget.returns(0);
                navigator = new WrappingNavigator(container);
                assertEquals('previous from first widget with disabled last widget returns second index', 1, navigator.previousIndex());
            }
        );
    };


}());

