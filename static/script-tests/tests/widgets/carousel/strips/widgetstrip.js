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

    var stubElementOffsetToReturn0 = function (self, application) {
        var device;
        device = application.getDevice();
        self.sandbox.stub(device, "getElementOffset").returns({ left: 0, top: 0 });
    };

    var stubElementOffsetToReturn100 = function (self, application) {
        var device;
        device = application.getDevice();
        self.sandbox.stub(device, "getElementOffset").returns({top: 100, left: 100});
    };

    var createThreeButtonStrip = function (WidgetStrip, Button, orientation) {
        var strip;
        strip = new WidgetStrip('strip', orientation);
        strip.appendChildWidget(new Button());
        strip.appendChildWidget(new Button());
        strip.appendChildWidget(new Button());
        return strip;
    };

    this.WidgetStripTest.prototype.testLengthToFirstIndexIsZero = function (queue) {
	var self = this;
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
                stubElementOffsetToReturn0(self, application);
                strip = createThreeButtonStrip(WidgetStrip, Button, orientation);
                assertEquals('Length to first index is 0', 0, strip.getLengthToIndex(0));
            }
        );
    };

    this.WidgetStripTest.prototype.testLengthToNegativeIndexIsZero = function (queue) {
	var self = this;
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
                stubElementOffsetToReturn0(self, application);
                strip = createThreeButtonStrip(WidgetStrip, Button, orientation);
                assertEquals('Length to second index is length of first item', 0, strip.getLengthToIndex(-1));
            }
        );
    };

    this.WidgetStripTest.prototype.testLengthToOutOfBoundsIndexIsLengthOfAllWidgets = function (queue) {
	var self = this;
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
                stubElementOffsetToReturn100(self, application);
                strip = createThreeButtonStrip(WidgetStrip, Button, orientation);
                assertEquals('Length of all widgets is same as length to out of bounds index', strip.getLengthToIndex(3), strip.getLengthToIndex(4));
            }
        );
    };

    this.WidgetStripTest.prototype.testLengthToNegativeIndexIsZero = function (queue) {
	var self = this;
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
                stubElementOffsetToReturn100(self, application);
                strip = createThreeButtonStrip(WidgetStrip, Button, orientation);
                assertEquals('Length of negative index is zero', 0, strip.getLengthToIndex(-1));
            }
        );
    };

    this.WidgetStripTest.prototype.testWidgetStripClassSet = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WidgetStrip, orientation) {
                var strip1, classStub;

                classStub = self.sandbox.stub(WidgetStrip.prototype, 'addClass').withArgs('carouselwidgetstrip');
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
	var self = this;
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
                self.sandbox.stub(WidgetStrip.prototype, 'addClass');
                strip = new WidgetStrip('strip', verticalOrientation);
                assertTrue(
                    "orientation style added to widget strip",
                    WidgetStrip.prototype.addClass.calledWith(orientationStyle)
                );

            }
        );
    };

    this.WidgetStripTest.prototype.testOrientationUsedToGetEdge = function (queue) {
	var self = this;
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
                self.sandbox.stub(device);
                self.sandbox.spy(verticalOrientation, 'edge');
                self.sandbox.stub(WidgetStrip.prototype, 'getChildWidgets').returns(["test", "test"]);
                strip = new WidgetStrip('strip', verticalOrientation);
                device.getElementSize.returns({width: 10, height: 10});
                device.getElementOffset.returns({top: 10, left: 10});
                strip.getLengthToIndex(1);
                assertTrue(verticalOrientation.edge.called);
            }
        );
    };

    this.WidgetStripTest.prototype.testInsertDelegatesToInsertChildWidget = function (queue) {
	var self = this;
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
                self.sandbox.stub(device);
                self.sandbox.stub(Container.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                widget = new Button();
                index = 3;
                strip.insert(index, widget);
                assertTrue(Container.prototype.insertChildWidget.calledWith(index, widget));
            }
        );
    };

    this.WidgetStripTest.prototype.testRemoveDelegatesToRemoveChildWidget = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, verticalOrientation, Container) {
                var strip, device, widget;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(Container.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                widget = new Button();
                strip.getChildWidgets = self.sandbox.stub().returns([widget]);
                strip.remove(widget, false);
                assertTrue(Container.prototype.removeChildWidget.calledWith(widget, false));
            }
        );
    };

    this.WidgetStripTest.prototype.testRemoveAllDelegatesToRemoveChildWidget = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, verticalOrientation, Container) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(Container.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                strip.removeAll();
                assertTrue(Container.prototype.removeChildWidgets.calledOnce);
            }
        );
    };

    this.WidgetStripTest.prototype.testLengthOfWidgetAtIndexReturnsHeightIfVertical = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, verticalOrientation, Container) {
                var strip, device;
                device = application.getDevice();
                this.sandbox.stub(device);
                device.getElementSize.returns({width: 70, height: 50});
                strip = new WidgetStrip('strip', verticalOrientation);
                strip.getChildWidgets = self.sandbox.stub().returns(["widget"]);
                strip.append(new Button());
                assertEquals(50, strip.lengthOfWidgetAtIndex(0));
            }
        );
    };

    this.WidgetStripTest.prototype.testLengthOfWidgetAtIndexReturnsWidthIfHorizontal = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/horizontal',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, horizontalOrientation, Container) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementSize.returns({width: 70, height: 50});
                strip = new WidgetStrip('strip', horizontalOrientation);
                strip.getChildWidgets = self.sandbox.stub().returns(["widget"]);
                strip.append(new Button());
                assertEquals(70, strip.lengthOfWidgetAtIndex(0));
            }
        );
    };

    this.WidgetStripTest.prototype.testLengthOfWidgetAtReturnsSetLengthIfProvidedOnAppend = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/horizontal',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, horizontalOrientation, Container) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementSize.returns({width: 70, height: 50});
                strip = new WidgetStrip('strip', horizontalOrientation);
                strip.getChildWidgets = self.sandbox.stub().returns(["widget"]);
                strip.append(new Button(), 20);
                assertEquals(20, strip.lengthOfWidgetAtIndex(0));
            }
        );
    };

    this.WidgetStripTest.prototype.testLengthOfWidgetAtReturnsCalculatedLengthIfNotProvidedOnAppend = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/horizontal',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, horizontalOrientation, Container) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementSize.returns({width: 70, height: 50});
                strip = new WidgetStrip('strip', horizontalOrientation);
                strip.getChildWidgets = self.sandbox.stub().returns(["widget", "widget"]);
                strip.append(new Button(), 20);
                strip.append(new Button());
                assertEquals(70, strip.lengthOfWidgetAtIndex(1));
            }
        );
    };

    this.WidgetStripTest.prototype.testGetLengthToIndexUsesProvidedLengthsWhenAllUpToIndexProvided = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/horizontal',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, horizontalOrientation, Container) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementOffset.returns({left: 40, top: 40});
                strip = new WidgetStrip('strip', horizontalOrientation);
                strip.getChildWidgets = self.sandbox.stub().returns(["widget", "widget"]);
                strip.append(new Button(), 30);
                strip.append(new Button(), 50);
                strip.append(new Button());
                assertEquals(80, strip.getLengthToIndex(2));
            }
        );
    };

    this.WidgetStripTest.prototype.testGetLengthToIndexUsesCalculatedOffsetWhenAllUpToIndexNotProvided = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/horizontal',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, horizontalOrientation, Container) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementOffset.returns({left: 40, top: 40});
                strip = new WidgetStrip('strip', horizontalOrientation);
                strip.getChildWidgets = self.sandbox.stub().returns(["widget", "widget"]);
                strip.append(new Button(), 30);
                strip.append(new Button());
                strip.append(new Button());
                assertEquals(40, strip.getLengthToIndex(2));
            }
        );
    };

    this.WidgetStripTest.prototype.testGetLengthToIndexUsesSuppliedLengthWhenInsertingWidget = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/horizontal',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, horizontalOrientation, Container) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementOffset.returns({left: 40, top: 40});
                strip = new WidgetStrip('strip', horizontalOrientation);
                strip.getChildWidgets = self.sandbox.stub().returns(["widget", "widget"]);
                strip.append(new Button(), 30);
                strip.append(new Button());
                strip.insert(1, new Button(), 50);
                assertEquals(80, strip.getLengthToIndex(2));
            }
        );
    };

    this.WidgetStripTest.prototype.testGetLengthToIndexUsesSuppliedLengthWhenInsertingWidgetAtStart = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/horizontal',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, horizontalOrientation, Container) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementOffset.returns({left: 40, top: 40});
                strip = new WidgetStrip('strip', horizontalOrientation);
                strip.getChildWidgets = self.sandbox.stub().returns(["widget", "widget"]);
                strip.append(new Button(), 30);
                strip.append(new Button());
                strip.insert(0, new Button(), 50);
                assertEquals(50, strip.getLengthToIndex(1));
            }
        );
    };

    this.WidgetStripTest.prototype.testGetLengthToIndexUsesSuppliedLengthAfterRemovingWidget = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/horizontal',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, horizontalOrientation, Container) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementOffset.returns({left: 40, top: 40});
                strip = new WidgetStrip('strip', horizontalOrientation);
                strip.getChildWidgets = self.sandbox.stub().returns([{widget: "widget1"}, {widget: "widget2"}]);
                strip.append(new Button(), 30);
                strip.append(new Button(), 40);
                strip.remove(strip.widgets()[1]);
                strip.append(new Button(), 50);
                strip.append(new Button());
                assertEquals(80, strip.getLengthToIndex(2));
            }
        );
    };

    this.WidgetStripTest.prototype.testGetLengthToIndexUsesCalculateLengthAfterRemoveAll = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/horizontal',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, horizontalOrientation, Container) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementOffset.returns({left: 40, top: 40});
                strip = new WidgetStrip('strip', horizontalOrientation);
                strip.getChildWidgets = self.sandbox.stub().returns(["widget1", "widget2"]);
                strip.append(new Button(), 30);
                strip.append(new Button(), 40);
                strip.append(new Button(), 50);
                strip.removeAll();
                assertEquals(40, strip.getLengthToIndex(2));
            }
        );
    };

    this.WidgetStripTest.prototype.testGetLengthToIndexUsesSetLengthsWithSingleDigit = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/horizontal',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, horizontalOrientation, Container) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementOffset.returns({left: 40, top: 40});
                strip = new WidgetStrip('strip', horizontalOrientation);
                strip.getChildWidgets = self.sandbox.stub().returns(["widget1", "widget2"]);
                strip.append(new Button(), 30);
                strip.append(new Button(), 40);
                strip.append(new Button(), 50);
                strip.setLengths(10);
                assertEquals(20, strip.getLengthToIndex(2));
            }
        );
    };

    this.WidgetStripTest.prototype.testGetLengthToIndexUsesSetLengthsWithArray = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/horizontal',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, horizontalOrientation, Container) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementOffset.returns({left: 40, top: 40});
                strip = new WidgetStrip('strip', horizontalOrientation);
                strip.getChildWidgets = self.sandbox.stub().returns(["widget1", "widget2"]);
                strip.append(new Button(), 30);
                strip.append(new Button(), 40);
                strip.append(new Button(), 50);
                strip.setLengths([20, 50, 10]);
                assertEquals(70, strip.getLengthToIndex(2));
            }
        );
    };

    this.WidgetStripTest.prototype.testHasDetachedWidgetsIsFalse = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/horizontal',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, horizontalOrientation, Container) {
                var strip;
                strip = new WidgetStrip('strip', horizontalOrientation);
                assertFalse(strip.needsVisibleIndices());
            }
        );
    };
}());
