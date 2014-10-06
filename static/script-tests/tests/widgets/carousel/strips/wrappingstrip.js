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
    this.WrappingStripTest = AsyncTestCase("WrappingStrip");

    this.WrappingStripTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.WrappingStripTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    var create1ItemStripWith1CloneEachEnd = function (self, WrappingStrip, Button, verticalOrientation) {
        var strip, item;
        strip = new WrappingStrip('oneItemStripTwoClones', verticalOrientation);
        strip._getMaskLength = self.sandbox.stub().returns(10);
        item = createFocusableButton(self, Button, 'item');
        strip.append(item);
        return strip;
    };

    var create3ItemStripFirstDisabled = function (self, WrappingStrip, Button, maskLength, verticalOrientation) {
        var strip, disabledItem, item2, item3;
        strip = new WrappingStrip('oneItemStripTwoClones', verticalOrientation);
        strip._getMaskLength = self.sandbox.stub().returns(maskLength);
        disabledItem = createNonFocusableButton(self, Button, 'item');
        item2 = createFocusableButton(self, Button, 'item2');
        item3 = createFocusableButton(self, Button, 'item3');
        strip.append(disabledItem);
        strip.append(item2);
        strip.append(item3);
        return strip;
    };

    var create5ItemStripFirst3Disabled = function (self, WrappingStrip, Button, maskLength, verticalOrientation) {
        var strip, item1, item2, disabledItem1, disabledItem2, disabledItem3;
        strip = new WrappingStrip('oneItemStripTwoClones', verticalOrientation);
        strip._getMaskLength = self.sandbox.stub().returns(maskLength);
        item1 = createFocusableButton(self, Button, 'item1');
        item2 = createFocusableButton(self, Button, 'item2');
        disabledItem1 = createNonFocusableButton(self, Button, 'disabled_item1');
        disabledItem2 = createNonFocusableButton(self, Button, 'disabled_item2');
        disabledItem3 = createNonFocusableButton(self, Button, 'disabled_item3');
        strip.append(disabledItem1);
        strip.append(disabledItem2);
        strip.append(disabledItem3);
        strip.append(item1);
        strip.append(item2);
        return strip;
    };

    var createFocusableButton = function (self, Button, id) {
        var button = new Button(id);
        self.sandbox.stub(button);
        button.isFocusable.returns(true);
        button.outputElement = id + "_clone";
        return button;
    };

    var createNonFocusableButton = function (self, Button, id) {
        var button = new Button(id);
        self.sandbox.stub(button);
        button.isFocusable.returns(false);
        button.outputElement = id + "_clone";
        return button;
    };

    this.WrappingStripTest.prototype.testAppendCallsCreateClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var strip, item;

                strip = new WrappingStrip('testStrip', verticalOrientation);
                item = {test: 'item'};

                strip._removeClones = self.sandbox.stub();
                strip.appendChildWidget = self.sandbox.stub().withArgs(item);
                strip._createClones = self.sandbox.stub();
                strip._getMaskLength = self.sandbox.stub().returns("test");

                strip.append(item);

                assertTrue('_createClones is called', strip._createClones.calledOnce);
                assertTrue('_getMaskLength is called', strip._createClones.calledOnce);
                assertTrue('_createClones is called with result of _getMaskLength', strip._createClones.calledWith("test"));
            }
        );
    };

    this.WrappingStripTest.prototype.testInsertCallsCreateClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var strip, item, index;

                strip = new WrappingStrip('testStrip', verticalOrientation);
                item = {test: 'item'};
                index = 2;
                strip._removeClones = self.sandbox.stub();
                strip.insertChildWidget = self.sandbox.stub().withArgs(index, item);
                strip._createClones = self.sandbox.stub();
                strip._getMaskLength = self.sandbox.stub().returns("test");

                strip.insert(index, item);

                assertTrue('_createClones is called', strip._createClones.calledOnce);
                assertTrue('_getMaskLength is called', strip._getMaskLength.calledOnce);
                assertTrue('_createClones is called with result of _getMaskLength', strip._createClones.calledWith("test"));
            }
        );
    };

    this.WrappingStripTest.prototype.testRemoveCallsCreateClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var strip, item;

                strip = new WrappingStrip('testStrip', verticalOrientation);
                item = {test: 'item'};

                strip._removeClones = self.sandbox.stub();
                strip.removeChildWidget = self.sandbox.stub().withArgs(item, false);
                strip._createClones = self.sandbox.stub();
                strip._getMaskLength = self.sandbox.stub().returns("test");

                strip.remove(item, false);

                assertTrue('_createClones is called', strip._createClones.calledOnce);
                assertTrue('_getMaskLength is called', strip._getMaskLength.calledOnce);
                assertTrue('_createClones is called with result of _getMaskLength', strip._createClones.calledWith("test"));
            }
        );
    };

    this.WrappingStripTest.prototype.testAppendToWrappingStripRemovesClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                "antie/widgets/button",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, Button, verticalOrientation) {
                var strip, item;

                strip = new WrappingStrip('testStrip', verticalOrientation);

                strip._removeClones = self.sandbox.stub();
                strip._createClones = self.sandbox.stub();
                strip.appendChildWidget = self.sandbox.stub();
                strip._getMaskLength = self.sandbox.stub();

                item = new Button('item');
                strip.append(item);

                assertTrue('Remove clones is called', strip._removeClones.calledOnce);
            }
        );
    };

    this.WrappingStripTest.prototype.testInsertRemovesClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                "antie/widgets/button",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, Button, verticalOrientation) {
                var strip, item, index;
                index = 3;
                strip = new WrappingStrip('testStrip', verticalOrientation);

                strip._removeClones = self.sandbox.stub();
                strip._createClones = self.sandbox.stub();
                strip.insertChildWidget = self.sandbox.stub();
                strip._getMaskLength = self.sandbox.stub();

                item = new Button('item');
                strip.insert(index, item);

                assertTrue('Remove clones is called', strip._removeClones.calledOnce);
            }
        );
    };

    this.WrappingStripTest.prototype.testRemoveRemovesClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                "antie/widgets/button",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, Button, verticalOrientation) {
                var strip, item;

                strip = new WrappingStrip('testStrip', verticalOrientation);

                strip._removeClones = self.sandbox.stub();
                strip._createClones = self.sandbox.stub();
                strip.removeChildWidget = self.sandbox.stub();
                strip._getMaskLength = self.sandbox.stub();

                item = new Button('item');
                strip.remove(item, false);

                assertTrue('Remove clones is called', strip._removeClones.calledOnce);
            }
        );
    };

    this.WrappingStripTest.prototype.testGetLengthReturnsLengthToIndexPlusOffsetInElementsArray = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/button",
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Button, WrappingStrip, verticalOrientation) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);

                self.sandbox.stub(WrappingStrip.prototype,
                    '_getOffsetToLastElementInArray',
                    function (array) {
                        return 20 * Math.max(0, array.length - 1);
                    }
                );
                device.getElementSize.returns({width: 20, height: 20});

                strip = create1ItemStripWith1CloneEachEnd(self, WrappingStrip, Button, verticalOrientation);
                assertEquals('getLengthToIndex returns sum of length before widgets and within widgets up to index', 20, strip.getLengthToIndex(0));
            }
        );
    };

    this.WrappingStripTest.prototype.testGetLengthToNegativeIndexReturnsPrependedCloneLengthUpToIndex = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/button",
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Button, WrappingStrip, verticalOrientation) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(WrappingStrip.prototype,
                    '_getOffsetToLastElementInArray',
                    function (array) {
                        return 20 * Math.max(0, array.length - 1);
                    }
                );
                device.getElementSize.returns({width: 20, height: 20});

                strip = create1ItemStripWith1CloneEachEnd(self, WrappingStrip, Button, verticalOrientation);
                assertEquals('getLengthToIndex with -1 index returns length up to last pre-clone', 0, strip.getLengthToIndex(-1));
            }
        );
    },

    this.WrappingStripTest.prototype.testGetLengthToIndexOneGreaterThenWidgetLengthReturnsLengthToFirstPostClone = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/button",
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Button, WrappingStrip, verticalOrientation) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(WrappingStrip.prototype,
                    '_getOffsetToLastElementInArray',
                    function (array) {
                        return 20 * Math.max(0, array.length - 1);
                    }
                );
                device.getElementSize.returns({width: 20, height: 20});
                strip = create1ItemStripWith1CloneEachEnd(self, WrappingStrip, Button, verticalOrientation);
                assertEquals('getLengthToIndex with index = widgets.length +1 returns length up to first post-clone', 40, strip.getLengthToIndex(1));
            }
        );
    },

    this.WrappingStripTest.prototype.testLengthOfWidgetAtIndexReturnsHeightIfVertical = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/wrappingstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/container'
            ],
            function (application, WrappingStrip, Button, verticalOrientation, Container) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementSize.returns({width: 70, height: 50});
                device.getElementOffset.returns({top: 0, left: 0});
                strip = new WrappingStrip('strip', verticalOrientation);
                strip._getMaskLength = self.sandbox.stub();
                strip.getChildWidgets = self.sandbox.stub().returns([new Button()]);
                strip.append(new Button());
                assertEquals(50, strip.lengthOfWidgetAtIndex(0));
            }
        );
    };

    this.WrappingStripTest.prototype.testLengthOfWidgetAtIndexReturnsWidthIfHorizontal = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/wrappingstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/horizontal',
                'antie/widgets/container'
            ],
            function (application, WrappingStrip, Button, horizontalOrientation, Container) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementSize.returns({width: 70, height: 50});
                device.getElementOffset.returns({top: 0, left: 0});
                strip = new WrappingStrip('strip', horizontalOrientation);
                strip._getMaskLength = self.sandbox.stub();
                strip.getChildWidgets = self.sandbox.stub().returns([new Button()]);
                strip.append(new Button());
                assertEquals(70, strip.lengthOfWidgetAtIndex(0));
            }
        );
    };

    this.WrappingStripTest.prototype.testCreateClonesWithNoItemsDoesNotCloneElements = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                "antie/widgets/button",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, Button, verticalOrientation) {
                var strip, item, disabledItem, items, device;
                device = application.getDevice();
                device.cloneElement = self.sandbox.stub();
                strip = new WrappingStrip('testStrip', verticalOrientation);

                strip._createClones(10);
                assertFalse("device.cloneElement called", device.cloneElement.called);
                assertEquals("_getClones returns empty array", [], strip._getClones());
            }
        );
    };

    this.WrappingStripTest.prototype.testCreateClonesWithZeroNullOrUndefinedMaskDoesNotCloneElements = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                "antie/widgets/button",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, Button, verticalOrientation) {
                var strip, item, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(WrappingStrip.prototype,
                    '_getOffsetToLastElementInArray',
                    function (array) {
                        return 20 * Math.max(0, array.length - 1);
                    }
                );
                device.getElementSize.returns({width: 20, height: 20});
                strip = new WrappingStrip('testStrip', verticalOrientation);
                item = new Button('item');
                strip.getChildWidgets = self.sandbox.stub().returns([item]);
                strip._createClones(0);
                strip._createClones(null);
                strip._createClones(undefined);
                strip._createClones("");
                assertFalse("device.cloneElement called", device.cloneElement.called);
                assertEquals("_getClones returns empty array", [], strip._getClones());
            }
        );
    };

    this.WrappingStripTest.prototype.testCloneItemsWithOneMaskFillingItemRepeatsThatItemOnceInEachDirection = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                "antie/widgets/button",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, Button, verticalOrientation) {
                var device, strip, item;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementSize.returns({width: 20, height: 20});
                device.cloneElement.returnsArg(0);
                item = createFocusableButton(self, Button, 'item');

                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip.getChildWidgets = self.sandbox.stub().returns([item]);
                strip.getChildWidgetCount = self.sandbox.stub().returns(1);
                strip._createClones(15);

                assertEquals('clones array consists of one clone in each direction',
                    ["item_clone", "item_clone"], strip._getClones());
                assertTrue('appendChildElement called once',
                    device.appendChildElement.calledOnce);
                assertTrue('prependChildElement called once',
                    device.appendChildElement.calledOnce);
            }
        );
    };

    this.WrappingStripTest.prototype.testCloneItemsWithTwoMaskFillingItemsRepeatsItemsOnceInEachDirection = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                "antie/widgets/button",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, Button, verticalOrientation) {
                var device, strip, item1, item2;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementSize.returns({width: 20, height: 20});
                device.cloneElement.returnsArg(0);
                item1 = createFocusableButton(self, Button, 'item1');
                item2 = createFocusableButton(self, Button, 'item2');

                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip.outputElement = "test";
                strip.getChildWidgets = self.sandbox.stub().returns([item1, item2]);
                strip.getChildWidgetCount = self.sandbox.stub().returns(2);
                strip._createClones(15);

                assertTrue('2 elements cloned',
                    device.cloneElement.calledTwice);
                assertEquals('clones array consists of one clone in each direction',
                    ["item2_clone", "item1_clone"], strip._getClones());
                assertTrue('appendChildElement called with clone of item 1',
                    device.appendChildElement.withArgs("test", 'item1_clone').calledOnce);
                assertTrue('prependChildElement called with clone of item 2',
                    device.prependChildElement.withArgs("test", 'item2_clone').calledOnce);
            }
        );
    };

    this.WrappingStripTest.prototype.testCloneItemsWithFourLength20ItemsAndMask50RepeatsThree = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                "antie/widgets/button",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, Button, verticalOrientation) {
                var device, strip, item1, item2, item3, item4;
                device = application.getDevice();
                self.sandbox.stub(device);
                device.getElementSize.returns({width: 20, height: 20});
                device.cloneElement.returnsArg(0);
                item1 = createFocusableButton(self, Button, 'item1');
                item2 = createFocusableButton(self, Button, 'item2');
                item3 = createFocusableButton(self, Button, 'item3');
                item4 = createFocusableButton(self, Button, 'item4');

                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip.outputElement = "test";
                strip.getChildWidgets = self.sandbox.stub().returns([item1, item2, item3, item4]);
                strip.getChildWidgetCount = self.sandbox.stub().returns(4);
                strip._createClones(50);

                assertEquals('6 elements cloned', 6, device.cloneElement.callCount);
                assertEquals('Clones array consists of three clones in each direction',
                    ["item2_clone", "item3_clone", "item4_clone", "item1_clone", "item2_clone", "item3_clone"],
                    strip._getClones());
                assertTrue('appendChildElement called three times',
                    device.appendChildElement.calledThrice);
                assertTrue('prependChildElement called three times',
                    device.prependChildElement.calledThrice);
            }
        );
    };

    this.WrappingStripTest.prototype.testCorrectCloningOf5ItemStripWithFirst3Disabled = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                "antie/widgets/button",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, Button, verticalOrientation) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(WrappingStrip.prototype,
                    '_getOffsetToLastElementInArray',
                    function (array) {
                        return 10 * Math.max(0, array.length - 1);
                    }
                );
                device.getElementSize.returns({width: 10, height: 10});

                strip = create5ItemStripFirst3Disabled(self, WrappingStrip, Button, 45, verticalOrientation);
                assertEquals("8 front clones created", 8, strip._getAppendedClones().length);
                assertEquals("5 rear clones created", 5, strip._getPrependedClones().length);
            }
        );
    };

    this.WrappingStripTest.prototype.testCloneWhenNoActiveIndexReturnsEmptyArray = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                "antie/widgets/carousel/strips/widgetstrip",
                "antie/widgets/button",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, WidgetStrip, Button, verticalOrientation) {
                var strip, disabledItem, items, device;
                device = application.getDevice();
                device.getElementSize = self.sandbox.stub().returns({width: 10, height: 10});
                device.cloneElement = self.sandbox.stub();
                device.removeClassFromElement = self.sandbox.stub();
                disabledItem = new Button();
                self.sandbox.stub(disabledItem, 'isFocusable');
                disabledItem.isFocusable.returns(false);
                items = [disabledItem];
                self.sandbox.stub(WidgetStrip.prototype, 'getChildWidgets');
                WidgetStrip.prototype.getChildWidgets.returns(items);

                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip._cloneFrontItems(items, 45);
                assertEquals("no clones created", [], strip._cloneFrontItems(items, 45));
            }
        );
    };

    this.WrappingStripTest.prototype.testCloneThreeSize20ItemsOnMask10ClonesTwoAfterAndOneBeforeWhenFirstDisabled = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                "antie/widgets/button",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, Button, verticalOrientation) {
                var strip, items, device;

                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(WrappingStrip.prototype,
                    '_getOffsetToLastElementInArray',
                    function (array) {
                        return 20 * Math.max(0, array.length - 1);
                    }
                );
                device.getElementSize.returns({width: 20, height: 20});

                strip = create3ItemStripFirstDisabled(self, WrappingStrip, Button, 10, verticalOrientation);

                assertEquals('2 clones of front items added to rear', 2, strip._getAppendedClones().length);
                assertEquals('1 clone of rear itmes added to front', 1, strip._getPrependedClones().length);

            }
        );
    };

    this.WrappingStripTest.prototype.testClonesAddedToStripCanBeRetrieved = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                "antie/widgets/button",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, Button, verticalOrientation) {
                var strip, item, i, device, maskLength, clones;

                device = application.getDevice();
                self.sandbox.stub(device);
                maskLength = 30;

                strip = new WrappingStrip('test', verticalOrientation);

                strip._cloneFrontItems = self.sandbox.stub().returns(["one", "two"]);
                strip._cloneRearItems = self.sandbox.stub().returns(["four", "three"]);
                strip._createClones(maskLength);

                assertEquals('All clones returned by _getClones()', ["three", "four", "one", "two"], strip._getClones());
            }
        );
    };



    this.WrappingStripTest.prototype.testClonesAreRemovedFromClonesArray = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var strip, device;

                device = application.getDevice();

                strip = new WrappingStrip('testStrip', verticalOrientation);

                strip._clones.push("clone1");
                strip._clones.push("clone2");

                self.sandbox.stub(device, 'removeElement');
                strip._removeClones();

                assertEquals('Clone array is empty', [], strip._getClones());
                assertEquals('Device.removeElement is called', 2, device.removeElement.callCount);
            }
        );
    };

    this.WrappingStripTest.prototype.testAppendCallsAppendChildWidget = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                "antie/widgets/button",
                'antie/widgets/carousel/orientations/vertical'

            ],
            function (application, WrappingStrip, Button, verticalOrientation) {
                var strip, item;

                strip = new WrappingStrip('testStrip', verticalOrientation);
                item = {test: 'item'};

                strip._removeClones = self.sandbox.stub();
                strip.appendChildWidget = self.sandbox.stub().withArgs(item);
                strip._createClones = self.sandbox.stub();
                strip._getMaskLength = self.sandbox.stub();

                strip.append(item);

                assertTrue('appendChildWidget is called', strip.appendChildWidget.calledOnce);
            }
        );
    };



    this.WrappingStripTest.prototype.testGetMaskLengthAsksParentForLength = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var strip, item, lengthStub;

                lengthStub = self.sandbox.stub();

                strip = new WrappingStrip('testStrip', verticalOrientation);
                item = {test: 'item'};

                strip.parentWidget = { getLength: lengthStub };
                strip._getMaskLength();

                assertTrue('_getMaskLength queries length of parent', lengthStub.calledOnce);
            }
        );
    };

    this.WrappingStripTest.prototype.testCreateClonesCreatesFrontClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical',
                "antie/widgets/button"
            ],
            function (application, WrappingStrip, verticalOrientation, Button) {
                var strip, fakeWidgets, device, maskLength;
                maskLength = 100;
                device = application.getDevice();
                self.sandbox.stub(Button.prototype);
                fakeWidgets = [new Button("one"), new Button("two")];
                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip.getChildWidgets = self.sandbox.stub().returns(fakeWidgets);
                strip._cloneFrontItems = self.sandbox.stub().returns([]);
                strip._cloneRearItems = self.sandbox.stub().returns([]);
                device.appendChildElement = self.sandbox.stub();

                strip._createClones(maskLength);
                assertTrue("Front items cloned", strip._cloneFrontItems.calledWith(fakeWidgets, maskLength));

            }
        );
    },

    this.WrappingStripTest.prototype.testCreateClonesCreatesRearClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical',
                "antie/widgets/button"
            ],
            function (application, WrappingStrip, verticalOrientation, Button) {
                var strip, fakeWidgets, device, maskLength;
                maskLength = 100;
                device = application.getDevice();
                self.sandbox.stub(Button.prototype);
                fakeWidgets = [new Button("one"), new Button("two")];
                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip.getChildWidgets = self.sandbox.stub().returns(fakeWidgets);
                strip._cloneFrontItems = self.sandbox.stub().returns([]);
                strip._cloneRearItems = self.sandbox.stub().returns([]);
                device.appendChildElement = self.sandbox.stub();

                strip._createClones(maskLength);
                assertTrue("Rear items cloned", strip._cloneRearItems.calledWith(fakeWidgets, maskLength));

            }
        );
    },

    this.WrappingStripTest.prototype.testCreateClonesAppendsFrontClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var strip, fakeElements, device, maskLength;
                maskLength = 100;
                device = application.getDevice();
                fakeElements = ["one", "two"];
                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip.getChildWidgets = self.sandbox.stub();
                strip._refreshElements = self.sandbox.stub();
                strip._cloneFrontItems = self.sandbox.stub().returns(fakeElements);
                strip._cloneRearItems = self.sandbox.stub().returns([]);
                device.appendChildElement = self.sandbox.stub();

                strip._createClones(maskLength);
                assertEquals("First clone appended first", "one", device.appendChildElement.firstCall.args[1]);
                assertEquals("Second clone appended second", "two",  device.appendChildElement.secondCall.args[1]);
            }
        );
    };

    this.WrappingStripTest.prototype.testCreateClonesPrependsRearClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var strip, fakeElements, device, maskLength;
                maskLength = 100;
                device = application.getDevice();
                fakeElements = ["two", "one"];
                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip.getChildWidgets = self.sandbox.stub();
                strip._refreshElements = self.sandbox.stub();
                strip._cloneFrontItems = self.sandbox.stub().returns([]);
                strip._cloneRearItems = self.sandbox.stub().returns(fakeElements);
                device.appendChildElement = self.sandbox.stub();
                device.prependChildElement = self.sandbox.stub();

                strip._createClones(maskLength);
                assertTrue("Two clones prepended", device.prependChildElement.calledTwice);
                assertEquals("Last clone prepended first", "two", device.prependChildElement.firstCall.args[1]);
                assertEquals("First clone prepended Last", "one",  device.prependChildElement.secondCall.args[1]);
            }
        );
    },

    this.WrappingStripTest.prototype.testCreateClonesStoresPrependedClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var strip, fakeElements, device, maskLength;
                maskLength = 100;
                device = application.getDevice();
                fakeElements = ["one", "two"];
                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip._refreshElements = self.sandbox.stub();
                strip.getChildWidgets = self.sandbox.stub();
                strip._cloneFrontItems = self.sandbox.stub().returns(["blah"]);
                strip._cloneRearItems = self.sandbox.stub().returns(fakeElements);
                device.appendChildElement = self.sandbox.stub();
                device.prependChildElement = self.sandbox.stub();

                strip._createClones(maskLength);
                assertEquals("Prepended clones stored", fakeElements, strip._getPrependedClones());
            }
        );
    },

    this.WrappingStripTest.prototype.testCreateClonesStoresAppendedClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var strip, fakeElements, device, maskLength;
                maskLength = 100;
                device = application.getDevice();
                fakeElements = ["one", "two"];
                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip._refreshElements = self.sandbox.stub();
                strip.getChildWidgets = self.sandbox.stub();
                strip._cloneFrontItems = self.sandbox.stub().returns(fakeElements);
                strip._cloneRearItems = self.sandbox.stub().returns(["blah"]);
                device.appendChildElement = self.sandbox.stub();
                device.prependChildElement = self.sandbox.stub();

                strip._createClones(maskLength);
                assertEquals("Appended clones stored", fakeElements, strip._getAppendedClones());
            }
        );
    };

    this.WrappingStripTest.prototype.testCloneFrontItemsClonesElementsBetweenZeroAndFirstIndexPastMaskSize = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var fakeWidget1, fakeWidget2, fakeWidget3, strip, fakeWidgets, maskLength, firstHiddenIndex, cloneElementsBetweenCall;
                maskLength = 100;
                fakeWidget1 = {isFocusable: function () { return true; } };
                fakeWidget2 = {isFocusable: function () { return true; } };
                fakeWidget3 = {isFocusable: function () { return true; } };
                fakeWidgets = [fakeWidget1, fakeWidget2, fakeWidget3];

                strip = new WrappingStrip('test', verticalOrientation);
                strip._cloneWidget = self.sandbox.stub();
                strip._getElementLength = self.sandbox.stub().returns(60);

                strip._cloneFrontItems(fakeWidgets, maskLength);

                assertTrue("Two clones created",
                    strip._cloneWidget.calledTwice
                );
                assertTrue("First item cloned",
                    strip._cloneWidget.calledWith(fakeWidget1)
                );
                assertTrue("Second item cloned",
                    strip._cloneWidget.calledWith(fakeWidget2)
                );
                assertFalse("Third item cloned",
                    strip._cloneWidget.calledWith(fakeWidget3)
                );
            }
        );
    };

    this.WrappingStripTest.prototype.testCloneFrontItemsReturnsArrayOfClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var fakeWidget, firstHiddenIndex, expectedClones, strip, fakeWidgets, maskLength;
                maskLength = 100;
                firstHiddenIndex = 3;
                fakeWidget = {isFocusable: function () { return true; } };
                expectedClones = ['clone1', 'clone2', 'clone3'];
                fakeWidgets = [fakeWidget, fakeWidget, fakeWidget];
                strip = new WrappingStrip('test', verticalOrientation);
                strip.firstIndexPastActiveLength = self.sandbox.stub().returns(firstHiddenIndex);
                strip._cloneFromIndexToLength = self.sandbox.stub().returns(expectedClones);
                assertEquals('clones returned succesfully', expectedClones, strip._cloneFrontItems(fakeWidgets, maskLength));
            }
        );
    };

    this.WrappingStripTest.prototype.testCloneRearItemsClonesElementsBetweenFirstIndexWithinMaskSizeAndLastItem = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var strip, fakeWidget1, fakeWidget2, fakeWidget3, fakeWidgets, maskLength, lastHiddenIndex, cloneElementsBetweenCall;
                maskLength = 100;
                fakeWidget1 = {isFocusable: function () { return true; } };
                fakeWidget2 = {isFocusable: function () { return true; } };
                fakeWidget3 = {isFocusable: function () { return true; } };
                fakeWidgets = [fakeWidget1, fakeWidget2, fakeWidget3];

                strip = new WrappingStrip('test', verticalOrientation);
                strip._cloneWidget = self.sandbox.stub();
                strip._getElementLength = self.sandbox.stub().returns(60);

                strip._cloneRearItems(fakeWidgets, maskLength);

                assertTrue("Two clones created",
                    strip._cloneWidget.calledTwice
                );
                assertTrue("Third item cloned",
                    strip._cloneWidget.calledWith(fakeWidget3)
                );
                assertTrue("Second item cloned",
                    strip._cloneWidget.calledWith(fakeWidget2)
                );
                assertFalse("First item cloned",
                    strip._cloneWidget.calledWith(fakeWidget1)
                );
            }
        );
    };

    this.WrappingStripTest.prototype.testCloneRearItemsReturnsArrayOfClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var expectedClones, strip, fakeWidgets, fakeWidget, maskLength;
                maskLength = 100;
                fakeWidget = {isFocusable: function () { return true; } };
                expectedClones = ['clone1', 'clone2', 'clone3'];
                fakeWidgets = [fakeWidget, fakeWidget, fakeWidget];
                strip = new WrappingStrip('test', verticalOrientation);
                strip.lastIndexOutsideLengthFromEnd = self.sandbox.stub().returns(0);
                strip._cloneFromIndexToLength = self.sandbox.stub().returns(expectedClones);
                assertEquals('clones returned succesfully', expectedClones, strip._cloneRearItems(fakeWidgets, maskLength));
            }
        );
    };

    this.WrappingStripTest.prototype.testCloneElementRemovesStateStyles = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var device, strip, FakeWidget, fakeWidgets, firstIndex, onePastEndIndex;
                FakeWidget = function (id) {
                    this.outputElement = id;
                };

                device = application.getDevice();
                device.cloneElement = self.sandbox.stub().returns("foo");

                strip = new WrappingStrip('test', verticalOrientation);
                strip._removeStateStylesFromElement = self.sandbox.stub();
                strip._cloneElement("test");

                assertTrue("elements clone", device.cloneElement.calledOnce);
                assertTrue("Styles removed from cloned element", strip._removeStateStylesFromElement.calledWith("foo"));

            }
        );
    };

    this.WrappingStripTest.prototype.testRemoveStateStylesFromElement = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var strip, fakeElement, removeFocusStub, removeActiveStub, removeButtonFocussedStub, device;

                fakeElement = {fake: "element"};
                device = application.getDevice();

                device.removeClassFromElement = self.sandbox.stub();
                removeFocusStub = device.removeClassFromElement.withArgs(fakeElement, 'focus', true);
                removeActiveStub = device.removeClassFromElement.withArgs(fakeElement, 'active', true);
                removeButtonFocussedStub = device.removeClassFromElement.withArgs(fakeElement, 'buttonFocussed', true);

                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip._removeStateStylesFromElement(fakeElement);

                assertTrue('Focus style removed from clone', removeFocusStub.calledOnce);
                assertTrue('Active style removed from clone', removeActiveStub.calledOnce);
                assertTrue('Button focussed style removed from clone', removeButtonFocussedStub.calledOnce);
            }
        );
    };

    this.WrappingStripTest.prototype.testRemoveAllDelegatesToRemoveChildWidget = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/wrappingstrip',
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

    this.WrappingStripTest.prototype.testRecalcualteRemovesClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/wrappingstrip',
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
                Container.prototype.getChildWidgets.returns([]);
                strip._getMaskLength = self.sandbox.stub().returns(45);
                self.sandbox.stub(strip, '_removeClones');
                self.sandbox.stub(strip, '_createClones');
                strip.recalculate();
                assertTrue(strip._removeClones.calledOnce);
            }
        );
    };

    this.WrappingStripTest.prototype.testRecalcualteCreatesClones = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/wrappingstrip',
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
                strip._getMaskLength = self.sandbox.stub().returns(45);
                Container.prototype.getChildWidgets.returns([]);
                self.sandbox.stub(strip, '_removeClones');
                self.sandbox.stub(strip, '_createClones');
                strip.recalculate();
                assertTrue(strip._createClones.calledOnce);
            }
        );
    };

    this.WrappingStripTest.prototype.testRecalcualteNotCalledOnAppendRemoveOrInsertWhenAutoCalculateOff = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/wrappingstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/container'
            ],
            function (application, WidgetStrip, Button, verticalOrientation, Container) {
                var strip, device, item;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(Container.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                strip._getMaskLength = self.sandbox.stub().returns(45);
                Container.prototype.getChildWidgets.returns([]);
                self.sandbox.stub(strip, '_removeClones');
                self.sandbox.stub(strip, '_createClones');
                item = new Button();
                strip.autoCalculate(false);
                strip.append(item);
                strip.insert(3, item);
                strip.remove(item);
                assertFalse(strip._removeClones.called);
                assertFalse(strip._createClones.called);
            }
        );
    };

    this.WrappingStripTest.prototype.testManualRecalcualteStillRecalculatesWithAutoCalculateOff = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/wrappingstrip',
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
                strip._getMaskLength = self.sandbox.stub().returns(45);
                Container.prototype.getChildWidgets.returns([]);
                self.sandbox.stub(strip, '_removeClones');
                self.sandbox.stub(strip, '_createClones');
                strip.autoCalculate(false);
                strip.recalculate();
                assertTrue(strip._removeClones.called);
                assertTrue(strip._createClones.called);
            }
        );
    };

    this.WrappingStripTest.prototype.testLengthOfWidgetAtIndexReturnsHeightIfVertical = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/wrappingstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/vertical',
                "antie/widgets/carousel/mask"
            ],
            function (application, WidgetStrip, Button, verticalOrientation, Mask) {
                var strip, device;
                self.sandbox.stub(application.getDevice(), "getElementSize").returns({width: 70, height: 50});
                strip = new WidgetStrip('strip', verticalOrientation);
                strip.autoCalculate(false);
                strip.parentWidget = new Mask('mask', strip, verticalOrientation);
                strip.append(new Button());
                assertEquals(50, strip.lengthOfWidgetAtIndex(0));
            }
        );
    };

    this.WrappingStripTest.prototype.testLengthOfWidgetAtIndexReturnsWidthIfHorizontal = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/strips/wrappingstrip',
                'antie/widgets/button',
                'antie/widgets/carousel/orientations/horizontal',
                "antie/widgets/carousel/mask"
            ],
            function (application, WidgetStrip, Button, horizontalOrientation, Mask) {
                var strip, device;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(Button.prototype);
                self.sandbox.stub(Mask.prototype);
                device.getElementSize.returns({width: 70, height: 50});
                strip = new WidgetStrip('strip', horizontalOrientation);
                strip.autoCalculate(false);
                strip.parentWidget = new Mask();
                strip.getChildWidgets = self.sandbox.stub().returns(new Button());
                strip.append(new Button());
                assertEquals(70, strip.lengthOfWidgetAtIndex(0));
            }
        );
    };

    this.WrappingStripTest.prototype.testClonesRendered = function (queue) {
	var self = this;
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                "antie/widgets/button",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, Button, verticalOrientation) {
                var strip, items, device, initialCallCount, finalCallCount;

                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(WrappingStrip.prototype,
                    '_getOffsetToLastElementInArray',
                    function (array) {
                        return 20 * Math.max(0, array.length - 1);
                    }
                );
                device.getElementSize.returns({width: 20, height: 20});
                strip = create3ItemStripFirstDisabled(self, WrappingStrip, Button, 10, verticalOrientation);
                initialCallCount = device.appendChildElement.callCount;
                strip.render(device);
                finalCallCount = device.appendChildElement.callCount;
                assertEquals('6 elements appended to strip (3 widgets + 3 clones)', 6, finalCallCount - initialCallCount);

            }
        );
    };

}());
