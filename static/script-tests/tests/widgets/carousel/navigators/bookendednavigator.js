/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {

    this.BookendedNavigatorTest = AsyncTestCase('BookendedNavigator');

    this.BookendedNavigatorTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.BookendedNavigatorTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.BookendedNavigatorTest.prototype.testNextIndexReturnsOneWithTwoItemsAndActiveIndexZero = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testNextIndexReturnsOneWithTwoItemsAndActiveIndexZero(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testPreviousIndexReturnsZeroWithTwoItemsAndActiveIndexOne = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testPreviousIndexReturnsZeroWithTwoItemsAndActiveIndexOne(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testGetIndexReturnsIndexOfContainerActiveWidget = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testGetIndexReturnsIndexOfContainerActiveWidget(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testSetContainer = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testSetContainerUpdatesContainer(BookendedNavigator);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testSetContainerCalledInConstructor = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testSetContainerCalledDuringInit(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testNextIndexSkipsDisabledWidget = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testNextIndexSkipsDisabledWidget(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testPreviousIndexSkipsDisabledWidget = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testPreviousIndexSkipsDisabledWidget(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testNextIndexReturnsNullWhenAllOtherWidgetsDisabled = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testNextIndexReturnsNullWhenAllOtherWidgetsDisabled(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testPreviousIndexReturnsNullWhenAllOtherWidgetsDisabled = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testPreviousIndexReturnsNullWhenAllOtherWidgetsDisabled(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testSetIndexActivatesValidIndexOfActivatableWidget = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testSetIndexActivatesValidIndexOfActivatableWidget(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testSetIndexOnInvalidIndexDoesNotChangeActivation = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testSetIndexOnInvalidIndexDoesNotChangeActivation(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testSetIndexOnIndexOfDisabledWidgetDoesNotChangeActivation = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testSetIndexOnIndexOfDisabledWidgetDoesNotChangeActivation(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testIndexCountItemCountOfContainer = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testIndexCountItemCountOfContainer(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testSelectedItemChangedEventFiredWhenIndexSetSuccessfully = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testSelectedItemChangedEventFiredWhenIndexSetSuccessfully(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testSelectedItemChangedEventNotFiredWhenIndexNotSetSuccessfully = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testSelectedItemChangedEventNotFiredWhenIndexNotSetSuccessfully(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testIndexAfterZeroWithFocussableNextWidget = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testIndexAfterZeroWithFocussableNextWidget(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testIndexBeforeOneWithFocussableIndexZero = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testIndexBeforeOneWithFocussableIndexZero(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testIndexAfterSkipsDisabledWidget = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testIndexAfterSkipsDisabledWidget(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testIndexBeforeSkipsDisabledWidget = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testIndexAfterSkipsDisabledWidget(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testIndexAfterReturnsNullWhenAllOtherWidgetsDisabled = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testIndexAfterReturnsNullWhenAllOtherWidgetsDisabled(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testIndexBeforeReturnsNullWhenAllOtherWidgetsDisabled = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testIndexBeforeReturnsNullWhenAllOtherWidgetsDisabled(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testBeforeSelectedItemChangedEventFiredBeforeIndexSetSuccessfully = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testBeforeSelectedItemChangedEventFiredBeforeIndexSetSuccessfully(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testGetIndexReturnsNullWithEmptyWidget = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, NavHelper) {
                NavHelper.testGetIndexReturnsNullWithEmptyWidget(BookendedNavigator, this.sandbox);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testPreviousIndexFromFirstItemReturnsNull = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'antie/widgets/container',
                'antie/widgets/button',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, Container, Button, NavHelper) {
                var container, navigator, button;
                NavHelper.setSandbox(this.sandbox);
                NavHelper.stubClassPrototypes([Container, Button]);
                button = NavHelper.createFocussableWidget();
                container = NavHelper.createContainerWithWidgets([button, button]);
                container.getIndexOfChildWidget.returns(0);

                navigator = new BookendedNavigator(container);

                assertTrue('previousIndex from first widget returns null', navigator.previousIndex() === null);
            }
        );
    };

    this.BookendedNavigatorTest.prototype.testNextIndexFromLastItemReturnsNull = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/navigators/bookendednavigator',
                'antie/widgets/container',
                'antie/widgets/button',
                'tests/widgets/navigators/testhelpers/navigator'
            ],
            function (application, BookendedNavigator, Container, Button, NavHelper) {
                var container, navigator, button;
                NavHelper.setSandbox(this.sandbox);
                NavHelper.stubClassPrototypes([Container, Button]);
                button = NavHelper.createFocussableWidget();
                container = NavHelper.createContainerWithWidgets([button, button]);
                container.getIndexOfChildWidget.returns(1);
                navigator = new BookendedNavigator(container);

                assertTrue('previousIndex from first widget returns null', navigator.nextIndex() === null);
            }
        );
    };



}());
