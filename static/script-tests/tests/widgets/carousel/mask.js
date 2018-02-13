/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {

    this.MaskTest = AsyncTestCase('Mask');

    this.MaskTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.MaskTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    function spyOnAll(thing) {
        for (var i in thing) {
            if(thing.hasOwnProperty(i)) {
                spyOn(thing, i);
            }
        }
    }

    this.MaskTest.prototype.testWidgetStripChildOfMask = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, verticalOrientation) {
                spyOn(Mask.prototype, 'appendChildWidget');

                var mockWidgetStrip = { };
                var mask = new Mask('myCarousel_mask', mockWidgetStrip, verticalOrientation);
                expect(mask.appendChildWidget).toHaveBeenCalledWith(mockWidgetStrip);
            }
        );
    };

    this.MaskTest.prototype.testAlignToIndexAtInitialAlignPointMovesContentsByNegativeOfLength = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, verticalOrientation) {
                var moveStub, pixelsMoved, mask;

                var mockWidgetStrip = {
                    getLengthToIndex: self.sandbox.stub().returns(50)
                };
                self.sandbox.stub(Mask.prototype, 'appendChildWidget');

                mask = new Mask('myCarousel_mask', mockWidgetStrip, verticalOrientation);

                moveStub = self.sandbox.stub(mask, '_moveContentsTo');
                mask.alignToIndex(1);

                pixelsMoved = moveStub.getCall(0).args[0];

                assertEquals('Moved to negative of length', -50, pixelsMoved);
            }
        );
    };

    this.MaskTest.prototype.testAlignToIndexAtModifiedALignPointMovesContentsByAlignPointMinusLength = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, verticalOrientation) {
                var moveStub, pixelsMoved, mask;

                var mockWidgetStrip = {
                    getLengthToIndex: self.sandbox.stub().returns(50)
                };
                self.sandbox.stub(Mask.prototype, 'appendChildWidget');

                mask = new Mask('myCarousel_mask', mockWidgetStrip, verticalOrientation);
                moveStub = self.sandbox.stub(mask, '_moveContentsTo');

                mask.setAlignPoint(25);
                mask.alignToIndex(1);

                pixelsMoved = moveStub.getCall(0).args[0];

                assertEquals('Moved to negative of length', -25, pixelsMoved);
            }
        );
    };

    this.MaskTest.prototype.testAlignToIndexAtNormalisedAlignPointMovesContentsByAlignPointMinusLength = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, verticalOrientation) {
                var moveStub, pixelsMoved, mask, device;
                device = application.getDevice();
                var mockWidgetStrip = {
                    getLengthToIndex: self.sandbox.stub().returns(50)
                };
                self.sandbox.stub(Mask.prototype, 'appendChildWidget');
                self.sandbox.stub(device);
                device.getElementSize.returns({width: 200, height: 200});
                mask = new Mask('myCarousel_mask', mockWidgetStrip, verticalOrientation);
                moveStub = self.sandbox.stub(mask, '_moveContentsTo');

                mask.setNormalisedAlignPoint(0.5);
                mask.alignToIndex(1);

                pixelsMoved = moveStub.getCall(0).args[0];

                assertEquals('Moved to negative of length', 50, pixelsMoved);
            }
        );
    };

    this.MaskTest.prototype.testNormalisedAlignPointClampedToZero = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, verticalOrientation) {
                var moveStub, pixelsMoved, mask, device;
                device = application.getDevice();
                var mockWidgetStrip = {
                    getLengthToIndex: self.sandbox.stub().returns(50)
                };
                self.sandbox.stub(Mask.prototype, 'appendChildWidget');
                self.sandbox.stub(device);
                device.getElementSize.returns({width: 200, height: 200});
                mask = new Mask('myCarousel_mask', mockWidgetStrip, verticalOrientation);
                moveStub = self.sandbox.stub(mask, '_moveContentsTo');

                mask.setNormalisedAlignPoint(-0.5);
                mask.alignToIndex(1);

                pixelsMoved = moveStub.getCall(0).args[0];

                assertEquals('Moved to negative of length', -50, pixelsMoved);
            }
        );
    };

    this.MaskTest.prototype.testNormalisedAlignPointClampedToOne = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, verticalOrientation) {
                var moveStub, pixelsMoved, mask, device;
                device = application.getDevice();
                var mockWidgetStrip = {
                    getLengthToIndex: self.sandbox.stub().returns(50)
                };
                self.sandbox.stub(Mask.prototype, 'appendChildWidget');
                self.sandbox.stub(device);
                device.getElementSize.returns({width: 200, height: 200});
                mask = new Mask('myCarousel_mask', mockWidgetStrip, verticalOrientation);
                moveStub = self.sandbox.stub(mask, '_moveContentsTo');

                mask.setNormalisedAlignPoint(2);
                mask.alignToIndex(1);

                pixelsMoved = moveStub.getCall(0).args[0];

                assertEquals('Moved to negative of length', 150, pixelsMoved);
            }
        );
    };

    this.MaskTest.prototype.testNormalisedAlignPointWorksIfSetBeforeMaskHasSize = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, verticalOrientation) {
                var moveStub, pixelsMoved, mask, device;
                device = application.getDevice();
                var mockWidgetStrip = {
                    getLengthToIndex: self.sandbox.stub().returns(50)
                };
                self.sandbox.stub(Mask.prototype, 'appendChildWidget');
                self.sandbox.stub(device);
                device.getElementSize.returns({width: 0, height: 0});
                mask = new Mask('myCarousel_mask', mockWidgetStrip, verticalOrientation);
                moveStub = self.sandbox.stub(mask, '_moveContentsTo');

                mask.setNormalisedAlignPoint(0.5);
                device.getElementSize.returns({width: 200, height: 200});
                mask.alignToIndex(1);

                pixelsMoved = moveStub.getCall(0).args[0];

                assertEquals('Moved to normalised align point', 50, pixelsMoved);
            }
        );
    };

    this.MaskTest.prototype.testNormalisedAlignPointOverriddenBySubsequentAlignPoint = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, verticalOrientation) {
                var moveStub, pixelsMoved, mask, device;
                device = application.getDevice();
                var mockWidgetStrip = {
                    getLengthToIndex: self.sandbox.stub().returns(50)
                };
                self.sandbox.stub(Mask.prototype, 'appendChildWidget');
                self.sandbox.stub(device);
                device.getElementSize.returns({width: 200, height: 200});
                mask = new Mask('myCarousel_mask', mockWidgetStrip, verticalOrientation);
                moveStub = self.sandbox.stub(mask, '_moveContentsTo');

                mask.setNormalisedAlignPoint(0.5);
                mask.setAlignPoint(20);
                mask.alignToIndex(1);

                pixelsMoved = moveStub.getCall(0).args[0];

                assertEquals('Moved to align point', -30, pixelsMoved);
            }
        );
    };

    this.MaskTest.prototype.testNormalisedWidgetAlign = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, verticalOrientation) {
                var moveStub, pixelsMoved, mask;
                application.getDevice();
                var mockWidgetStrip = {
                    getLengthToIndex: self.sandbox.stub().returns(50),
                    lengthOfWidgetAtIndex: self.sandbox.stub().returns(50)
                };
                self.sandbox.stub(Mask.prototype, 'appendChildWidget');
                mask = new Mask('myCarousel_mask', mockWidgetStrip, verticalOrientation);
                moveStub = self.sandbox.stub(mask, '_moveContentsTo');
                mask.setNormalisedWidgetAlignPoint(0.5);
                mask.alignToIndex(1);
                pixelsMoved = moveStub.getCall(0).args[0];

                assertEquals('Moved to negative of length', -75, pixelsMoved);
            }
        );
    };

    this.MaskTest.prototype.testNormalisedWidgetAlignClampedToZero = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, verticalOrientation) {
                var moveStub, pixelsMoved, mask;
                application.getDevice();
                var mockWidgetStrip = {
                    getLengthToIndex: self.sandbox.stub().returns(50),
                    lengthOfWidgetAtIndex: self.sandbox.stub().returns(50)
                };
                self.sandbox.stub(Mask.prototype, 'appendChildWidget');
                mask = new Mask('myCarousel_mask', mockWidgetStrip, verticalOrientation);
                moveStub = self.sandbox.stub(mask, '_moveContentsTo');
                mask.setNormalisedWidgetAlignPoint(-0.5);
                mask.alignToIndex(1);
                pixelsMoved = moveStub.getCall(0).args[0];

                assertEquals('Moved to negative of length', -50, pixelsMoved);
            }
        );
    };

    this.MaskTest.prototype.testNormalisedWidgetAlignClampedToOne = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, verticalOrientation) {
                var moveStub, pixelsMoved, mask;
                var mockWidgetStrip = {
                    getLengthToIndex: self.sandbox.stub().returns(50),
                    lengthOfWidgetAtIndex: self.sandbox.stub().returns(50)
                };
                self.sandbox.stub(Mask.prototype, 'appendChildWidget');
                mask = new Mask('myCarousel_mask', mockWidgetStrip, verticalOrientation);
                moveStub = self.sandbox.stub(mask, '_moveContentsTo');
                mask.setNormalisedWidgetAlignPoint(2);
                mask.alignToIndex(1);
                pixelsMoved = moveStub.getCall(0).args[0];

                assertEquals('Moved to negative of length', -100, pixelsMoved);
            }
        );
    };

    this.MaskTest.prototype.testAlignToIndexPassesOnProvidedOnComplete = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/spinner',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, Spinner, verticalOrientation) {
                var mask;
                self.sandbox.stub(Spinner.prototype);
                var mockWidgetStrip = {
                    getLengthToIndex: self.sandbox.stub().returns(50)
                };
                function fakeOnComplete() {}

                self.sandbox.stub(Mask.prototype, 'appendChildWidget');
                mask = new Mask('myCarousel_mask', mockWidgetStrip, verticalOrientation);
                mask.alignToIndex(4, { onComplete: fakeOnComplete });
                assertEquals('onComplete function passed to spinner in options object',
                             fakeOnComplete, Spinner.prototype.moveContentsTo.firstCall.args[1].onComplete);
            }
        );
    };

    this.MaskTest.prototype.testAlignToIndexPassesOnProvidedSkipAnim = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/spinner',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, Spinner, verticalOrientation) {
                var mask;
                self.sandbox.stub(Spinner.prototype);
                var mockWidgetStrip = {
                    getLengthToIndex: self.sandbox.stub().returns(50)
                };

                self.sandbox.stub(Mask.prototype, 'appendChildWidget');
                mask = new Mask('myCarousel_mask', mockWidgetStrip, verticalOrientation);
                mask.alignToIndex(4, { skipAnim: true });
                assertTrue('skipAnim parameter passed to spinner in options object', Spinner.prototype.moveContentsTo.firstCall.args[1].skipAnim);
            }
        );
    };

    this.MaskTest.prototype.testGetWidgetStripReturnsStrip = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, verticalOrientation) {
                var mask, strip;

                strip = {mock: 'strip'};
                self.sandbox.stub(Mask.prototype, 'appendChildWidget');

                mask = new Mask('myCarousel_mask', strip, verticalOrientation);

                assertEquals('Widget strip returned', strip, mask.getWidgetStrip());
            }
        );
    };

    this.MaskTest.prototype.testSetWidgetStrip = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation) {
                var mask, strip1, strip2;
                strip1 = new WidgetStrip('strip1', verticalOrientation);
                strip2 = new WidgetStrip('strip2', verticalOrientation);
                mask = new Mask('testMask', strip1, verticalOrientation);
                mask.setWidgetStrip(strip2);
                assertEquals('Container set correctly', strip2, mask.getWidgetStrip());
            }
        );
    };

    this.MaskTest.prototype.testSetWidgetStripRemovesOldStrip = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation) {
                var mask, strip1, strip2;
                strip1 = new WidgetStrip('strip1', verticalOrientation);
                strip2 = new WidgetStrip('strip2', verticalOrientation);
                mask = new Mask('testMask', strip1, verticalOrientation);

                mask.setWidgetStrip(strip1);
                self.sandbox.stub(mask, 'removeChildWidget').withArgs(strip1);
                self.sandbox.stub(mask, 'appendChildWidget');
                mask.setWidgetStrip(strip2);
                assertTrue('Old strip removed', mask.removeChildWidget.calledOnce);
            }
        );
    };

    this.MaskTest.prototype.testSetWidgetStripDoesNotRemoveNonExistantStrip = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation) {
                var mask, strip1;
                strip1 = new WidgetStrip('strip1', verticalOrientation);
                new WidgetStrip('strip2', verticalOrientation);
                self.sandbox.stub(Mask.prototype, 'removeChildWidget');
                mask = new Mask('testMask', strip1, verticalOrientation);
                assertFalse('Strip not removed before creation', mask.removeChildWidget.called);
            }
        );
    };

    this.MaskTest.prototype.testSetWidgetStripAddsNewStrip = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation) {
                var mask, strip1, strip2;
                strip1 = new WidgetStrip('strip1', verticalOrientation);
                strip2 = new WidgetStrip('strip2', verticalOrientation);
                mask = new Mask('testMask', strip1, verticalOrientation);
                self.sandbox.stub(mask, 'removeChildWidget');
                self.sandbox.stub(mask, 'appendChildWidget').withArgs(strip2);
                mask.setWidgetStrip(strip2);
                assertTrue('New strip added', mask.appendChildWidget.calledOnce);
            }
        );
    };

    this.MaskTest.prototype.testGetLength = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation) {
                var mask, strip1, device;
                device = application.getDevice();
                strip1 = new WidgetStrip('strip1', verticalOrientation);
                mask = new Mask('testMask', strip1, verticalOrientation);
                self.sandbox.stub(device, 'getElementSize').returns({width: 50, height: 50});
                assertEquals('getLength length returns length of mask element', 50, mask.getLength());
            }
        );
    };

    this.MaskTest.prototype.testGetLengthPrefersSetLengthOverMeasuredLength = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation) {
                var mask, strip1, device;
                device = application.getDevice();
                strip1 = new WidgetStrip('strip1', verticalOrientation);
                mask = new Mask('testMask', strip1, verticalOrientation);
                mask.setLength(27);
                self.sandbox.stub(device, 'getElementSize');
                assertEquals('getLength length returns set length of mask element', 27, mask.getLength());
                assertEquals('device.getElementSize is never called', 0, device.getElementSize.callCount);
            }
        );
    };

    this.MaskTest.prototype.testMaskClassSet = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation) {
                var strip1, classStub;
                application.getDevice();
                classStub = self.sandbox.stub(Mask.prototype, 'addClass').withArgs('carouselmask');
                strip1 = new WidgetStrip('strip1', verticalOrientation);
                new Mask('testMask', strip1, verticalOrientation);

                assertTrue('carouselmask class set on mask', classStub.calledOnce);
            }
        );
    };

    this.MaskTest.prototype.testMaskSetsOrientationClass = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation) {
                var strip1, classStub, orientationStyle;
                orientationStyle = verticalOrientation.styleClass();
                application.getDevice();
                classStub = self.sandbox.stub(Mask.prototype, 'addClass').withArgs(orientationStyle);
                strip1 = new WidgetStrip('strip1', verticalOrientation);
                new Mask('testMask', strip1, verticalOrientation);

                assertTrue('vertical class set on mask', classStub.calledOnce);
            }
        );
    };

    this.MaskTest.prototype.testGetLengthGetsDimensionFromOrientation = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation) {
                var mask, strip1, device, length;

                device = application.getDevice();
                self.sandbox.stub(device);
                strip1 = new WidgetStrip('strip1', verticalOrientation);
                self.sandbox.stub(verticalOrientation, 'dimension').returns('test');
                mask = new Mask('testMask', strip1, verticalOrientation);
                device.getElementSize.returns({height: 20, test: 50});
                length = mask.getLength();
                assertTrue('orientation dimension queried', verticalOrientation.dimension.called);
                assertEquals('length returns size property defined by orientation', 50, length);
            }
        );
    };

    this.MaskTest.prototype.testMaskPassesOrientationToSpinner = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner) {
                var mask, strip1, device;

                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(Spinner.prototype);
                strip1 = new WidgetStrip('strip1', verticalOrientation);
                mask = new Mask('testMask', strip1, verticalOrientation);

                assertTrue('spinner constructor receives orientation',
                           Spinner.prototype.init.calledWith(device, mask, verticalOrientation));

            }
        );
    };

    this.MaskTest.prototype.testIndicesVisibleAtAlignedIndex0WithAlignPoint0 = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner) {
                var device, mask, strip;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(Spinner.prototype);
                self.sandbox.stub(WidgetStrip.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                mask = new Mask('testMask', strip, verticalOrientation);
                strip.lengthOfWidgetAtIndex.returns(10);
                device.getElementSize.returns({width: 25, height: 25});
                strip.getChildWidgetCount.returns(5);
                assertEquals([0, 1, 2], mask.indicesVisibleWhenAlignedToIndex(0));
            }
        );
    };

    this.MaskTest.prototype.testVisibleIndicesBetweenCurrentAndFutureAlignIndexSetOnStripBeforeAlign = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner',
                'antie/widgets/container',
                'antie/widgets/widget'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner, Container, Widget) {
                var device, mask, strip;
                device = application.getDevice();
                spyOn(device, 'getElementSize').and.returnValue({width: 25, height: 25});
                spyOnAll(Spinner.prototype);
                spyOnAll(WidgetStrip.prototype);
                spyOnAll(Container.prototype);
                spyOnAll(Widget.prototype);
                Widget.prototype.getCurrentApplication.and.returnValue(application);

                strip = new WidgetStrip('strip', verticalOrientation);
                mask = new Mask('testMask', strip, verticalOrientation);
                strip.lengthOfWidgetAtIndex.and.returnValue(10);
                strip.getChildWidgetCount.and.returnValue(5);
                strip.needsVisibleIndices.and.returnValue(true);
                mask.beforeAlignTo(0, 1);
                expect(strip.attachIndexedWidgets).toHaveBeenCalledWith([0, 1, 2, 3]);
            }
        );
    };

    this.MaskTest.prototype.testVisibleIndicesBetweenCurrentAndFutureAlignIndexSetOnStripBeforeAlignToLast = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner',
                'antie/widgets/container',
                'antie/widgets/widget'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner, Container, Widget) {
                var device, mask, strip;
                device = application.getDevice();
                spyOn(device, 'getElementSize').and.returnValue({width: 25, height: 25});
                spyOnAll(Spinner.prototype);
                spyOnAll(WidgetStrip.prototype);
                spyOnAll(Container.prototype);
                spyOnAll(Widget.prototype);
                Widget.prototype.getCurrentApplication.and.returnValue(application);
                strip = new WidgetStrip('strip', verticalOrientation);
                mask = new Mask('testMask', strip, verticalOrientation);
                strip.lengthOfWidgetAtIndex.and.returnValue(10);
                strip.getChildWidgetCount.and.returnValue(5);
                strip.needsVisibleIndices.and.returnValue(true);
                mask.beforeAlignTo(0, 4);
                expect(strip.attachIndexedWidgets).toHaveBeenCalledWith([0, 1, 2, 3, 4]);
            }
        );
    };

    this.MaskTest.prototype.testVisibleIndicesSetAfterAlignIfStripNeedsThem = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/cullingstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner',
                'antie/widgets/container',
                'antie/widgets/widget'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner, Container, Widget) {
                var device, mask, strip;
                device = application.getDevice();
                spyOn(device, 'getElementSize').and.returnValue({width: 25, height: 25});
                spyOnAll(Spinner.prototype);
                spyOnAll(WidgetStrip.prototype);
                spyOnAll(Container.prototype);
                spyOnAll(Widget.prototype);
                Widget.prototype.getCurrentApplication.and.returnValue(application);
                strip = new WidgetStrip('strip', verticalOrientation);
                mask = new Mask('testMask', strip, verticalOrientation);
                strip.lengthOfWidgetAtIndex.and.returnValue(10);
                strip.getChildWidgetCount.and.returnValue(5);
                strip.needsVisibleIndices.and.returnValue(true);
                mask.afterAlignTo(3);
                expect(strip.attachIndexedWidgets).toHaveBeenCalledWith([3, 4]);
            }
        );
    };

    this.MaskTest.prototype.testIndicesVisibleAtAlignedIndex2WithAlignPoint0 = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner) {
                var device, mask, strip;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(Spinner.prototype);
                self.sandbox.stub(WidgetStrip.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                mask = new Mask('testMask', strip, verticalOrientation);
                strip.lengthOfWidgetAtIndex.returns(10);
                device.getElementSize.returns({width: 25, height: 25});
                strip.getChildWidgetCount.returns(5);
                assertEquals([2, 3, 4], mask.indicesVisibleWhenAlignedToIndex(2));
            }
        );
    };

    this.MaskTest.prototype.testIndicesVisibleAtAlignedIndex0WithAlignPoint10 = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner) {
                var device, mask, strip;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(Spinner.prototype);
                self.sandbox.stub(WidgetStrip.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                mask = new Mask('testMask', strip, verticalOrientation);
                strip.lengthOfWidgetAtIndex.returns(10);
                device.getElementSize.returns({width: 25, height: 25});
                strip.getChildWidgetCount.returns(5);
                mask.setAlignPoint(10);
                assertEquals([0, 1], mask.indicesVisibleWhenAlignedToIndex(0));
            }
        );
    };

    this.MaskTest.prototype.testIndicesVisibleAtAlignedIndex1WithAlignPoint10 = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner) {
                var device, mask, strip;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(Spinner.prototype);
                self.sandbox.stub(WidgetStrip.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                mask = new Mask('testMask', strip, verticalOrientation);
                strip.lengthOfWidgetAtIndex.returns(10);
                device.getElementSize.returns({width: 25, height: 25});
                strip.getChildWidgetCount.returns(5);
                mask.setAlignPoint(10);
                assertEquals([0, 1, 2], mask.indicesVisibleWhenAlignedToIndex(1));
            }
        );
    };

    this.MaskTest.prototype.testIndicesVisibleAtAlignedIndex1WithAlignPoint10 = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner) {
                var device, mask, strip;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(Spinner.prototype);
                self.sandbox.stub(WidgetStrip.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                mask = new Mask('testMask', strip, verticalOrientation);
                strip.lengthOfWidgetAtIndex.returns(10);
                device.getElementSize.returns({width: 25, height: 25});
                strip.getChildWidgetCount.returns(5);
                mask.setAlignPoint(10);
                assertEquals([0, 1, 2], mask.indicesVisibleWhenAlignedToIndex(1));
            }
        );
    };

    this.MaskTest.prototype.testNoIndicesVisibleAtZeroSizedMask = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner) {
                var device, mask, strip;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(Spinner.prototype);
                self.sandbox.stub(WidgetStrip.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                mask = new Mask('testMask', strip, verticalOrientation);
                strip.lengthOfWidgetAtIndex.returns(10);
                device.getElementSize.returns({width: 0, height: 0});
                strip.getChildWidgetCount.returns(5);
                mask.setAlignPoint(10);
                assertEquals([], mask.indicesVisibleWhenAlignedToIndex(1));
            }
        );
    };

    this.MaskTest.prototype.testIndexBeforeMaskNotVisible = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner) {
                var device, mask, strip;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(Spinner.prototype);
                self.sandbox.stub(WidgetStrip.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                mask = new Mask('testMask', strip, verticalOrientation);
                strip.lengthOfWidgetAtIndex.returns(10);
                device.getElementSize.returns({width: 25, height: 25});
                strip.getChildWidgetCount.returns(5);
                mask.setAlignPoint(-10);
                assertEquals([1, 2, 3], mask.indicesVisibleWhenAlignedToIndex(0));
            }
        );
    };

    this.MaskTest.prototype.testIndexAfterMaskNotVisible = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner) {
                var device, mask, strip;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(Spinner.prototype);
                self.sandbox.stub(WidgetStrip.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                mask = new Mask('testMask', strip, verticalOrientation);
                strip.lengthOfWidgetAtIndex.returns(10);
                device.getElementSize.returns({width: 25, height: 25});
                strip.getChildWidgetCount.returns(5);
                mask.setAlignPoint(25);
                assertEquals([0], mask.indicesVisibleWhenAlignedToIndex(1));
            }
        );
    };

    this.MaskTest.prototype.testIndexJustInsideMaskVisible = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner) {
                var device, mask, strip;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(Spinner.prototype);
                self.sandbox.stub(WidgetStrip.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                mask = new Mask('testMask', strip, verticalOrientation);
                strip.lengthOfWidgetAtIndex.returns(10);
                device.getElementSize.returns({width: 25, height: 25});
                strip.getChildWidgetCount.returns(5);
                mask.setAlignPoint(24);
                assertEquals([0, 1], mask.indicesVisibleWhenAlignedToIndex(1));
            }
        );
    };

    this.MaskTest.prototype.testStopAnimationPassesThroughToSpinner = function (queue) {
        var self = this;
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner) {
                var device, mask, strip;
                device = application.getDevice();
                self.sandbox.stub(device);
                self.sandbox.stub(Spinner.prototype);
                self.sandbox.stub(WidgetStrip.prototype);
                strip = new WidgetStrip('strip', verticalOrientation);
                mask = new Mask('testMask', strip, verticalOrientation);
                mask.stopAnimation();
                assertTrue(Spinner.prototype.stopAnimation.calledOnce);
            }
        );
    };

    this.MaskTest.prototype.testBeforeAlignToFiresBeforeAlignEventOnStrip = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner',
                'antie/events/beforealignevent',
                'antie/widgets/container',
                'antie/widgets/widget'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner, BeforeAlignEvent, Container, Widget) {
                var device, mask, strip;
                var targetIndex = 3;
                device = application.getDevice();
                spyOn(device, 'getElementSize').and.returnValue({width: 25, height: 25});
                spyOnAll(Spinner.prototype);
                spyOnAll(WidgetStrip.prototype);
                spyOnAll(Container.prototype);
                spyOnAll(Widget.prototype);
                spyOnAll(BeforeAlignEvent.prototype);
                Widget.prototype.getCurrentApplication.and.returnValue(application);
                strip = new WidgetStrip('strip', verticalOrientation);
                mask = new Mask('testMask', strip, verticalOrientation);
                mask.beforeAlignTo(0, targetIndex);
                expect(WidgetStrip.prototype.bubbleEvent).toHaveBeenCalledWith(jasmine.any(BeforeAlignEvent));
                expect(BeforeAlignEvent.prototype.init).toHaveBeenCalledWith(jasmine.any(WidgetStrip), targetIndex);
            }
        );
    };

    this.MaskTest.prototype.testAfterAlignToFiresBeforeAlignEventOnStrip = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner',
                'antie/events/afteralignevent',
                'antie/widgets/container',
                'antie/widgets/widget'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner, AfterAlignEvent, Container, Widget) {
                var device, mask, strip;
                var targetIndex = 3;
                device = application.getDevice();
                spyOn(device, 'getElementSize').and.returnValue({width: 25, height: 25});
                spyOnAll(Spinner.prototype);
                spyOnAll(WidgetStrip.prototype);
                spyOnAll(Container.prototype);
                spyOnAll(Widget.prototype);
                spyOnAll(AfterAlignEvent.prototype);
                Widget.prototype.getCurrentApplication.and.returnValue(application);
                strip = new WidgetStrip('strip', verticalOrientation);
                mask = new Mask('testMask', strip, verticalOrientation);
                mask.afterAlignTo(targetIndex);

                expect(WidgetStrip.prototype.bubbleEvent).toHaveBeenCalledWith(jasmine.any(AfterAlignEvent));
                expect(AfterAlignEvent.prototype.init).toHaveBeenCalledWith(jasmine.any(WidgetStrip), targetIndex);
            }
        );
    };
}());
