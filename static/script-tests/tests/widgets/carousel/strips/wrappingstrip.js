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

    this.WrappingStripTest.prototype.create1ItemStripWith1CloneEachEnd = function (WrappingStrip, Button, verticalOrientation) {
        var strip, item;
        strip = new WrappingStrip('oneItemStripTwoClones', verticalOrientation);
        strip._getMaskLength = this.sandbox.stub().returns(10);
        item = this.createFocusableButton(Button, 'item');
        strip.append(item);
        return strip;
    },

    this.WrappingStripTest.prototype.create3ItemStripFirstDisabled = function (WrappingStrip, Button, maskLength, verticalOrientation) {
        var strip, disabledItem, item2, item3;
        strip = new WrappingStrip('oneItemStripTwoClones', verticalOrientation);
        strip._getMaskLength = this.sandbox.stub().returns(maskLength);
        disabledItem = this.createNonFocusableButton(Button, 'item');
        item2 = this.createFocusableButton(Button, 'item2');
        item3 = this.createFocusableButton(Button, 'item3');
        strip.append(disabledItem);
        strip.append(item2);
        strip.append(item3);
        return strip;
    },

    this.WrappingStripTest.prototype.create5ItemStripFirst3Disabled = function (WrappingStrip, Button, maskLength, verticalOrientation) {
        var strip, item1, item2, disabledItem1, disabledItem2, disabledItem3;
        strip = new WrappingStrip('oneItemStripTwoClones', verticalOrientation);
        strip._getMaskLength = this.sandbox.stub().returns(maskLength);
        item1 = this.createFocusableButton(Button, 'item1');
        item2 = this.createFocusableButton(Button, 'item2');
        disabledItem1 = this.createNonFocusableButton(Button, 'disabled_item1');
        disabledItem2 = this.createNonFocusableButton(Button, 'disabled_item2');
        disabledItem3 = this.createNonFocusableButton(Button, 'disabled_item3');
        strip.append(disabledItem1);
        strip.append(disabledItem2);
        strip.append(disabledItem3);
        strip.append(item1);
        strip.append(item2);
        return strip;
    },

    this.WrappingStripTest.prototype.createFocusableButton = function (Button, id) {
        var button = new Button(id);
        this.sandbox.stub(button);
        button.isFocusable.returns(true);
        button.outputElement = id + "_clone";
        return button;
    };

    this.WrappingStripTest.prototype.createNonFocusableButton = function (Button, id) {
        var button = new Button(id);
        this.sandbox.stub(button);
        button.isFocusable.returns(false);
        button.outputElement = id + "_clone";
        return button;
    };

    this.WrappingStripTest.prototype.testAppendCallsCreateClones = function (queue) {
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

                strip._removeClones = this.sandbox.stub();
                strip.appendChildWidget = this.sandbox.stub().withArgs(item);
                strip._createClones = this.sandbox.stub();
                strip._getMaskLength = this.sandbox.stub().returns("test");

                strip.append(item);

                assertTrue('_createClones is called', strip._createClones.calledOnce);
                assertTrue('_getMaskLength is called', strip._createClones.calledOnce);
                assertTrue('_createClones is called with result of _getMaskLength', strip._createClones.calledWith("test"));
            }
        );
    };

    this.WrappingStripTest.prototype.testInsertCallsCreateClones = function (queue) {
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
                strip._removeClones = this.sandbox.stub();
                strip.insertChildWidget = this.sandbox.stub().withArgs(index, item);
                strip._createClones = this.sandbox.stub();
                strip._getMaskLength = this.sandbox.stub().returns("test");

                strip.insert(index, item);

                assertTrue('_createClones is called', strip._createClones.calledOnce);
                assertTrue('_getMaskLength is called', strip._getMaskLength.calledOnce);
                assertTrue('_createClones is called with result of _getMaskLength', strip._createClones.calledWith("test"));
            }
        );
    };

    this.WrappingStripTest.prototype.testRemoveCallsCreateClones = function (queue) {
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

                strip._removeClones = this.sandbox.stub();
                strip.removeChildWidget = this.sandbox.stub().withArgs(item, false);
                strip._createClones = this.sandbox.stub();
                strip._getMaskLength = this.sandbox.stub().returns("test");

                strip.remove(item, false);

                assertTrue('_createClones is called', strip._createClones.calledOnce);
                assertTrue('_getMaskLength is called', strip._getMaskLength.calledOnce);
                assertTrue('_createClones is called with result of _getMaskLength', strip._createClones.calledWith("test"));
            }
        );
    };

    this.WrappingStripTest.prototype.testAppendToWrappingStripRemovesClones = function (queue) {
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

                strip._removeClones = this.sandbox.stub();
                strip._createClones = this.sandbox.stub();
                strip.appendChildWidget = this.sandbox.stub();
                strip._getMaskLength = this.sandbox.stub();

                item = new Button('item');
                strip.append(item);

                assertTrue('Remove clones is called', strip._removeClones.calledOnce);
            }
        );
    };

    this.WrappingStripTest.prototype.testInsertRemovesClones = function (queue) {
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

                strip._removeClones = this.sandbox.stub();
                strip._createClones = this.sandbox.stub();
                strip.insertChildWidget = this.sandbox.stub();
                strip._getMaskLength = this.sandbox.stub();

                item = new Button('item');
                strip.insert(index, item);

                assertTrue('Remove clones is called', strip._removeClones.calledOnce);
            }
        );
    };

    this.WrappingStripTest.prototype.testRemoveRemovesClones = function (queue) {
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

                strip._removeClones = this.sandbox.stub();
                strip._createClones = this.sandbox.stub();
                strip.removeChildWidget = this.sandbox.stub();
                strip._getMaskLength = this.sandbox.stub();

                item = new Button('item');
                strip.remove(item, false);

                assertTrue('Remove clones is called', strip._removeClones.calledOnce);
            }
        );
    };

    this.WrappingStripTest.prototype.testRemoveRefereshesElementArray = function (queue) {
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

                strip._removeClones = this.sandbox.stub();
                strip._createClones = this.sandbox.stub();
                strip._refereshWidgetElements = this.sandbox.stub();
                strip.removeChildWidget = this.sandbox.stub();
                strip._getMaskLength = this.sandbox.stub();

                item = new Button('item');
                strip.remove(item, false);

                assertTrue('Remove clones is called', strip._refereshWidgetElements.calledOnce);
            }
        );
    };

    this.WrappingStripTest.prototype.testGetLengthReturnsLengthToIndexPlusOffsetInElementsArray = function (queue) {
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
                this.sandbox.stub(device);
                device.getElementSize = this.sandbox.stub().returns({width: 20, height: 20});
                strip = this.create1ItemStripWith1CloneEachEnd(WrappingStrip, Button, verticalOrientation);
                assertEquals('getLengthToIndex returns sum of length before widgets and within widgets up to index', 20, strip.getLengthToIndex(0));
            }
        );
    };

    this.WrappingStripTest.prototype.testGetLengthToNegativeIndexReturnsPrependedCloneLengthUpToIndex = function (queue) {
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
                this.sandbox.stub(device);
                device.getElementSize = this.sandbox.stub().returns({width: 20, height: 20});
                strip = this.create1ItemStripWith1CloneEachEnd(WrappingStrip, Button, verticalOrientation);
                assertEquals('getLengthToIndex with -1 index returns length up to last pre-clone', 0, strip.getLengthToIndex(-1));
            }
        );
    },

        this.WrappingStripTest.prototype.testGetLengthToIndexOneGreaterThenWidgetLengthReturnsLengthToFirstPostClone = function (queue) {
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
                    this.sandbox.stub(device);
                    device.getElementSize = this.sandbox.stub().returns({width: 20, height: 20});
                    strip = this.create1ItemStripWith1CloneEachEnd(WrappingStrip, Button, verticalOrientation);
                    assertEquals('getLengthToIndex with index = widgets.length +1 returns length up to first post-clone', 40, strip.getLengthToIndex(1));
                }
            );
        },


    this.WrappingStripTest.prototype.testCreateClonesWithNoItemsDoesNotCloneElements = function (queue) {
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
                device.cloneElement = this.sandbox.stub();
                strip = new WrappingStrip('testStrip', verticalOrientation);

                strip._createClones(10);
                assertFalse("device.cloneElement called", device.cloneElement.called);
                assertEquals("_getClones returns empty array", [], strip._getClones());
            }
        );
    };

    this.WrappingStripTest.prototype.testCreateClonesWithZeroNullOrUndefinedMaskDoesNotCloneElements = function (queue) {
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
                device.cloneElement = this.sandbox.stub();
                strip = new WrappingStrip('testStrip', verticalOrientation);
                item = new Button('item');
                strip.getChildWidgets = this.sandbox.stub().returns([item]);
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
                this.sandbox.stub(device);
                device.getElementSize.returns({width: 20, height: 20});
                device.cloneElement.returnsArg(0);
                item = this.createFocusableButton(Button, 'item');

                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip.getChildWidgets = this.sandbox.stub().returns([item]);
                strip.getChildWidgetCount = this.sandbox.stub().returns(1);
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
                this.sandbox.stub(device);
                device.getElementSize.returns({width: 20, height: 20});
                device.cloneElement.returnsArg(0);
                item1 = this.createFocusableButton(Button, 'item1');
                item2 = this.createFocusableButton(Button, 'item2');

                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip.outputElement = "test";
                strip.getChildWidgets = this.sandbox.stub().returns([item1, item2]);
                strip.getChildWidgetCount = this.sandbox.stub().returns(2);
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
                this.sandbox.stub(device);
                device.getElementSize.returns({width: 20, height: 20});
                device.cloneElement.returnsArg(0);
                item1 = this.createFocusableButton(Button, 'item1');
                item2 = this.createFocusableButton(Button, 'item2');
                item3 = this.createFocusableButton(Button, 'item3');
                item4 = this.createFocusableButton(Button, 'item4');

                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip.outputElement = "test";
                strip.getChildWidgets = this.sandbox.stub().returns([item1, item2, item3, item4]);
                strip.getChildWidgetCount = this.sandbox.stub().returns(4);
                strip._createClones(50);

                assertEquals('6 elements cloned', 6, device.cloneElement.callCount);
                assertEquals('Clones array consists of three clones in each direction',
                    ["item4_clone", "item3_clone", "item2_clone", "item1_clone", "item2_clone", "item3_clone"],
                    strip._getClones());
                assertTrue('appendChildElement called three times',
                    device.appendChildElement.calledThrice);
                assertTrue('prependChildElement called three times',
                    device.prependChildElement.calledThrice);
            }
        );
    };

    this.WrappingStripTest.prototype.testCorrectCloningOf5ItemStripWithFirst3Disabled = function (queue) {
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
                this.sandbox.stub(device);
                device.getElementSize = this.sandbox.stub().returns({width: 10, height: 10});
                strip = this.create5ItemStripFirst3Disabled(WrappingStrip, Button, 45, verticalOrientation);
                assertEquals("8 front clones created", 8, strip._getAppendedClones().length);
                assertEquals("5 rear clones created", 5, strip._getPrependedClones().length);
            }
        );
    };

    this.WrappingStripTest.prototype.testCloneWhenNoActiveIndexReturnsEmptyArray = function (queue) {
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
                device.getElementSize = this.sandbox.stub().returns({width: 10, height: 10});
                device.cloneElement = this.sandbox.stub();
                device.removeClassFromElement = this.sandbox.stub();
                disabledItem = new Button();
                this.sandbox.stub(disabledItem, 'isFocusable');
                disabledItem.isFocusable.returns(false);
                items = [disabledItem];
                this.sandbox.stub(WidgetStrip.prototype, 'getChildWidgets');
                WidgetStrip.prototype.getChildWidgets.returns(items);

                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip._cloneFrontItems(items, 45);
                assertEquals("no clones created", [], strip._cloneFrontItems(items, 45));
            }
        );
    };

    this.WrappingStripTest.prototype.testCloneThreeSize20ItemsOnMask10ClonesTwoAfterAndOneBeforeWhenFirstDisabled = function (queue) {
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
                this.sandbox.stub(device);
                device.getElementSize.returns({width: 20, height: 20});

                strip = this.create3ItemStripFirstDisabled(WrappingStrip, Button, 10, verticalOrientation);

                assertEquals('2 clones of front items added to rear', 2, strip._getAppendedClones().length);
                assertEquals('1 clone of rear itmes added to front', 1, strip._getPrependedClones().length);

            }
        );
    };

    this.WrappingStripTest.prototype.testClonesAddedToStripCanBeRetrieved = function (queue) {
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
                this.sandbox.stub(device);
                maskLength = 30;

                strip = new WrappingStrip('test', verticalOrientation);

                strip._cloneFrontItems = this.sandbox.stub().returns(["one", "two"]);
                strip._cloneRearItems = this.sandbox.stub().returns(["three", "four"]);
                strip._createClones(maskLength);

                assertEquals('All clones returned by _getClones()', ["three", "four", "one", "two"], strip._getClones());
            }
        );
    };



    this.WrappingStripTest.prototype.testClonesAreRemovedFromClonesArray = function (queue) {
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

                this.sandbox.stub(device, 'removeElement');
                strip._removeClones();

                assertEquals('Clone array is empty', [], strip._getClones());
                assertEquals('Device.removeElement is called', 2, device.removeElement.callCount);
            }
        );
    };

    this.WrappingStripTest.prototype.testAppendCallsAppendChildWidget = function (queue) {
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

                strip._removeClones = this.sandbox.stub();
                strip.appendChildWidget = this.sandbox.stub().withArgs(item);
                strip._createClones = this.sandbox.stub();
                strip._getMaskLength = this.sandbox.stub();

                strip.append(item);

                assertTrue('appendChildWidget is called', strip.appendChildWidget.calledOnce);
            }
        );
    };



    this.WrappingStripTest.prototype.testGetMaskLengthAsksParentForLength = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var strip, item, lengthStub;

                lengthStub = this.sandbox.stub();

                strip = new WrappingStrip('testStrip', verticalOrientation);
                item = {test: 'item'};

                strip.parentWidget = { getLength: lengthStub };
                strip._getMaskLength();

                assertTrue('_getMaskLength queries length of parent', lengthStub.calledOnce);
            }
        );
    };

    this.WrappingStripTest.prototype.testCreateClonesCreatesFrontClones = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var strip, fakeWidgets, device, maskLength;
                maskLength = 100;
                device = application.getDevice();
                fakeWidgets = ["one", "two"];
                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip.getChildWidgets = this.sandbox.stub().returns(fakeWidgets);
                strip._cloneFrontItems = this.sandbox.stub().returns([]);
                strip._cloneRearItems = this.sandbox.stub().returns([]);
                device.appendChildElement = this.sandbox.stub();

                strip._createClones(maskLength);
                assertTrue("Front items cloned", strip._cloneFrontItems.calledWith(fakeWidgets, maskLength));

            }
        );
    },

    this.WrappingStripTest.prototype.testCreateClonesCreatesRearClones = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                "antie/widgets/carousel/strips/wrappingstrip",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, WrappingStrip, verticalOrientation) {
                var strip, fakeWidgets, device, maskLength;
                maskLength = 100;
                device = application.getDevice();
                fakeWidgets = ["one", "two"];
                strip = new WrappingStrip('testStrip', verticalOrientation);
                strip.getChildWidgets = this.sandbox.stub().returns(fakeWidgets);
                strip._cloneFrontItems = this.sandbox.stub().returns([]);
                strip._cloneRearItems = this.sandbox.stub().returns([]);
                device.appendChildElement = this.sandbox.stub();

                strip._createClones(maskLength);
                assertTrue("Rear items cloned", strip._cloneRearItems.calledWith(fakeWidgets, maskLength));

            }
        );
    },

    this.WrappingStripTest.prototype.testCreateClonesAppendsFrontClones = function (queue) {
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
                strip.getChildWidgets = this.sandbox.stub();
                strip._refreshElements = this.sandbox.stub();
                strip._cloneFrontItems = this.sandbox.stub().returns(fakeElements);
                strip._cloneRearItems = this.sandbox.stub().returns([]);
                device.appendChildElement = this.sandbox.stub();

                strip._createClones(maskLength);
                assertEquals("First clone appended first", "one", device.appendChildElement.firstCall.args[1]);
                assertEquals("Second clone appended second", "two",  device.appendChildElement.secondCall.args[1]);
            }
        );
    },

    this.WrappingStripTest.prototype.testCreateClonesPrependsRearClones = function (queue) {
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
                strip.getChildWidgets = this.sandbox.stub();
                strip._refreshElements = this.sandbox.stub();
                strip._cloneFrontItems = this.sandbox.stub().returns([]);
                strip._cloneRearItems = this.sandbox.stub().returns(fakeElements);
                device.appendChildElement = this.sandbox.stub();
                device.prependChildElement = this.sandbox.stub();

                strip._createClones(maskLength);
                assertTrue("Two clones prepended", device.prependChildElement.calledTwice);
                assertEquals("Last clone prepended first", "two", device.prependChildElement.firstCall.args[1]);
                assertEquals("First clone prepended Last", "one",  device.prependChildElement.secondCall.args[1]);
            }
        );
    },

    this.WrappingStripTest.prototype.testCreateClonesStoresPrependedClones = function (queue) {
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
                strip._refreshElements = this.sandbox.stub();
                strip.getChildWidgets = this.sandbox.stub();
                strip._cloneFrontItems = this.sandbox.stub().returns(["blah"]);
                strip._cloneRearItems = this.sandbox.stub().returns(fakeElements);
                device.appendChildElement = this.sandbox.stub();
                device.prependChildElement = this.sandbox.stub();

                strip._createClones(maskLength);
                assertEquals("Prepended clones stored", fakeElements, strip._getPrependedClones());
            }
        );
    },

    this.WrappingStripTest.prototype.testCreateClonesStoresAppendedClones = function (queue) {
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
                strip._refreshElements = this.sandbox.stub();
                strip.getChildWidgets = this.sandbox.stub();
                strip._cloneFrontItems = this.sandbox.stub().returns(fakeElements);
                strip._cloneRearItems = this.sandbox.stub().returns(["blah"]);
                device.appendChildElement = this.sandbox.stub();
                device.prependChildElement = this.sandbox.stub();

                strip._createClones(maskLength);
                assertEquals("Appended clones stored", fakeElements, strip._getAppendedClones());
            }
        );
    },

    this.WrappingStripTest.prototype.testCloneFrontItemsClonesElementsBetweenZeroAndFirstIndexPastMaskSize = function (queue) {
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
                strip._cloneWidget = this.sandbox.stub();
                strip._getElementLength = this.sandbox.stub().returns(60);

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
                strip.firstIndexPastActiveLength = this.sandbox.stub().returns(firstHiddenIndex);
                strip._cloneFromIndexToLength = this.sandbox.stub().returns(expectedClones);
                assertEquals('clones returned succesfully', expectedClones, strip._cloneFrontItems(fakeWidgets, maskLength));
            }
        );
    };

    this.WrappingStripTest.prototype.testCloneRearItemsClonesElementsBetweenFirstIndexWithinMaskSizeAndLastItem = function (queue) {
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
                strip._cloneWidget = this.sandbox.stub();
                strip._getElementLength = this.sandbox.stub().returns(60);

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
                strip.lastIndexOutsideLengthFromEnd = this.sandbox.stub().returns(0);
                strip._cloneFromIndexToLength = this.sandbox.stub().returns(expectedClones);
                assertEquals('clones returned succesfully', expectedClones, strip._cloneRearItems(fakeWidgets, maskLength));
            }
        );
    };

    this.WrappingStripTest.prototype.testCloneElementRemovesStateStyles = function (queue) {
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
                device.cloneElement = this.sandbox.stub().returns("foo");

                strip = new WrappingStrip('test', verticalOrientation);
                strip._removeStateStylesFromElement = this.sandbox.stub();
                strip._cloneElement("test");

                assertTrue("elements clone", device.cloneElement.calledOnce);
                assertTrue("Styles removed from cloned element", strip._removeStateStylesFromElement.calledWith("foo"));

            }
        );
    };

    this.WrappingStripTest.prototype.testRemoveStateStylesFromElement = function (queue) {
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

                device.removeClassFromElement = this.sandbox.stub();
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
                this.sandbox.stub(device);
                this.sandbox.stub(Container.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                strip.removeAll();
                assertTrue(Container.prototype.removeChildWidgets.calledOnce);
            }
        );
    };

}());
