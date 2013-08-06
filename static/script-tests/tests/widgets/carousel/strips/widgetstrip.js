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
    this.WidgetStripTest = AsyncTestCase("WidgetStrip");

    this.WidgetStripTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.WidgetStripTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.WidgetStripTest.prototype.stubElementSizesToStartAt100AndIncreaseBy100EachCall = function (application) {
        var elCount, device;
        device = application.getDevice();
        elCount = 0;
        var firstElLength = 100;
        this.sandbox.stub(device, 'getElementSize', function (el) {
            var thisElLength;
            thisElLength = firstElLength + firstElLength * elCount;
            elCount += 1;
            return {
                width: thisElLength,
                height: thisElLength
            };
        });
    };

    this.WidgetStripTest.prototype.stubElementSizesToReturn100 = function (application) {
        var elCount, device;
        device = application.getDevice();
        elCount = 0;
        var firstElLength = 100;
        device.getElementSize = this.sandbox.stub().returns({width: 100, height: 100});
    };

    this.WidgetStripTest.prototype.createThreeButtonStrip = function (WidgetStrip, Button, orientation) {
        var strip;
        strip = new WidgetStrip('strip', orientation);
        strip.appendChildWidget(new Button());
        strip.appendChildWidget(new Button());
        strip.appendChildWidget(new Button());
        return strip;
    };

    this.WidgetStripTest.prototype.testLengthToFirstIndexIsZero = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WidgetStrip, Button, orientation) {
                var device, strip;
                this.stubElementSizesToStartAt100AndIncreaseBy100EachCall(application);
                strip = this.createThreeButtonStrip(WidgetStrip, Button, orientation);
                assertEquals('Length to first index is 0', 0, strip.getLengthToIndex(0));
            }
        );
    };

    this.WidgetStripTest.prototype.testLengthToSecondIndexIsLengthOfFirstItem = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WidgetStrip, Button, orientation) {
                var device, strip;
                this.stubElementSizesToStartAt100AndIncreaseBy100EachCall(application);
                strip = this.createThreeButtonStrip(WidgetStrip, Button, orientation);
                assertEquals('Length to second index is length of first item', 100, strip.getLengthToIndex(1));
            }
        );
    };

    this.WidgetStripTest.prototype.testLengthToNegativeIndexIsZero = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WidgetStrip, Button, orientation) {
                var strip;
                this.stubElementSizesToStartAt100AndIncreaseBy100EachCall(application);
                strip = this.createThreeButtonStrip(WidgetStrip, Button, orientation);
                assertEquals('Length to second index is length of first item', 0, strip.getLengthToIndex(-1));
            }
        );
    };

    this.WidgetStripTest.prototype.testLengthToThirdIndexIsSumOfFirstTwoItemLengths = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WidgetStrip, Button, orientation) {
                var device, strip;
                this.stubElementSizesToStartAt100AndIncreaseBy100EachCall(application);
                strip = this.createThreeButtonStrip(WidgetStrip, Button, orientation);
                assertEquals('Length to third index is sum of lengths of first two items', 300, strip.getLengthToIndex(2));
            }
        );
    };

    this.WidgetStripTest.prototype.testLengthToOutOfBoundsIndexIsLengthOfAllWidgets = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WidgetStrip, Button, orientation) {
                var strip;
                this.stubElementSizesToReturn100(application);
                strip = this.createThreeButtonStrip(WidgetStrip, Button, orientation);
                assertEquals('Length of all widgets is same as length to out of bounds index', strip.getLengthToIndex(3), strip.getLengthToIndex(4));
            }
        );
    };

    this.WidgetStripTest.prototype.testLengthToNegativeIndexIsZero = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WidgetStrip, Button, orientation) {
                var strip;
                this.stubElementSizesToReturn100(application);
                strip = this.createThreeButtonStrip(WidgetStrip, Button, orientation);
                assertEquals('Length of all widgets is same as length to out of bounds index', 0, strip.getLengthToIndex(-1));
            }
        );
    };

    this.WidgetStripTest.prototype.testWidgetStripClassSet = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WidgetStrip, orientation) {
                var strip1, classStub;

                classStub = this.sandbox.stub(WidgetStrip.prototype, 'addClass').withArgs('carouselwidgetstrip');
                strip1 = new WidgetStrip('strip1', orientation);

                assertTrue("carouselwidgetstrip class set on widget strip", classStub.calledOnce);
            }
        );
    };

    this.WidgetStripTest.prototype.testWidgetsReturnsEmptyArrayOnInit = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WidgetStrip, Button, orientation) {
                var strip1;

                strip1 = new WidgetStrip('strip1', orientation);

                assertEquals("widgets() returns empty array on init", [], strip1.widgets());
            }
        );
    };

    this.WidgetStripTest.prototype.testWidgetsReturnsAppendedWidgets = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WidgetStrip, Button, orientation) {
                var strip1, button1, button2;
                button1 = new Button();
                button2 = new Button();

                strip1 = new WidgetStrip('strip1', orientation);
                strip1.append(button1);
                strip1.append(button2);
                assertEquals("widgets() returns appended widgets", [button1, button2], strip1.widgets());
            }
        );
    };

    this.WidgetStripTest.prototype.testOrientationClassAddedToStrip = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WidgetStrip, Button, verticalOrientation) {
                var strip, orientationStyle;
                orientationStyle = verticalOrientation.styleClass();
                this.sandbox.stub(WidgetStrip.prototype, 'addClass');
                strip = new WidgetStrip('strip', verticalOrientation);
                assertTrue(
                    "orientation style added to widget strip",
                    WidgetStrip.prototype.addClass.calledWith(orientationStyle)
                );

            }
        );
    };

    this.WidgetStripTest.prototype.testOrientationUsedToGetLength = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WidgetStrip, Button, verticalOrientation) {
                var strip, device;
                device = application.getDevice();
                this.sandbox.stub(device);
                this.sandbox.spy(verticalOrientation, 'dimension');
                this.sandbox.stub(WidgetStrip.prototype, 'getChildWidgets').returns(["test", "test"]);
                strip = new WidgetStrip('strip', verticalOrientation);
                device.getElementSize.returns({width: 10, height: 10});
                strip.getLengthToIndex(1);
                assertTrue(verticalOrientation.dimension.called);
            }
        );
    };

    this.WidgetStripTest.prototype.testInsertDelegatesToInsertChildWidget = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, verticalOrientation, Container) {
                var strip, device, index, widget;
                device = application.getDevice();
                this.sandbox.stub(device);
                this.sandbox.stub(Container.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                widget = new Button();
                index = 3;
                strip.insert(index, widget);
                assertTrue(Container.prototype.insertChildWidget.calledWith(index, widget));
            }
        );
    };
}());