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
    this.MaskTest = AsyncTestCase("Mask");

    this.MaskTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.MaskTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.MaskTest.prototype.testWidgetStripChildOfMask = function (queue) {
		queuedApplicationInit(queue,
			'lib/mockapplication',
			[
                "antie/widgets/carousel/mask",
                'antie/widgets/carousel/orientations/vertical'
            ],
			function (application, Mask, verticalOrientation) {
				var mask, childStub, appendedWidget;
                function MockWidgetStripFn() {}
                childStub = this.sandbox.stub(Mask.prototype, 'appendChildWidget');

                mask = new Mask('myCarousel_mask', new MockWidgetStripFn(), verticalOrientation);
                appendedWidget = childStub.getCall(0).args[0];
				assertTrue("Widget strip is child of mask", appendedWidget instanceof MockWidgetStripFn);
			}
		);
	};

    this.MaskTest.prototype.testAlignToIndexAtInitialAlignPointMovesContentsByNegativeOfLength = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, verticalOrientation) {
                var moveStub, pixelsMoved, mask;

                function MockWidgetStripFn() {}
                MockWidgetStripFn.prototype.getLengthToIndex = this.sandbox.stub().returns(50);
                this.sandbox.stub(Mask.prototype, 'appendChildWidget');

                mask = new Mask('myCarousel_mask', new MockWidgetStripFn(), verticalOrientation);

                moveStub = sinon.stub(mask, '_moveContentsTo');
                mask.alignToIndex(1);

                pixelsMoved = moveStub.getCall(0).args[0];

                assertEquals('Moved to negative of length', -50, pixelsMoved);
            }
        );
    };

    this.MaskTest.prototype.testAlignToIndexAtModifiedALignPointMovesContentsByAlignPointMinusLength = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, verticalOrientation) {
                var moveStub, pixelsMoved, mask;

                function MockWidgetStripFn() {}
                MockWidgetStripFn.prototype.getLengthToIndex = this.sandbox.stub().returns(50);
                this.sandbox.stub(Mask.prototype, 'appendChildWidget');

                mask = new Mask('myCarousel_mask', new MockWidgetStripFn(), verticalOrientation);
                moveStub = sinon.stub(mask, '_moveContentsTo');

                mask.setAlignPoint(25);
                mask.alignToIndex(1);

                pixelsMoved = moveStub.getCall(0).args[0];

                assertEquals('Moved to negative of length', -25, pixelsMoved);
            }
        );
    };

    this.MaskTest.prototype.testAlignToIndexPassesOnProvidedOnComplete = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/spinner',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, Spinner, verticalOrientation) {
                var moveStub, pixelsMoved, mask;
                this.sandbox.stub(Spinner.prototype);
                function MockWidgetStripFn() {}
                function fakeOnComplete() {}
                MockWidgetStripFn.prototype.getLengthToIndex = this.sandbox.stub().returns(50);

                this.sandbox.stub(Mask.prototype, 'appendChildWidget');
                mask = new Mask('myCarousel_mask', new MockWidgetStripFn(), verticalOrientation);
                mask.alignToIndex(4, { onComplete: fakeOnComplete });
                assertEquals("onComplete function passed to spinner in options object",
                    fakeOnComplete, Spinner.prototype.moveContentsTo.firstCall.args[1].onComplete);
            }
        );
    };

    this.MaskTest.prototype.testAlignToIndexPassesOnProvidedSkipAnim = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/spinner',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, Spinner, verticalOrientation) {
                var moveStub, pixelsMoved, mask;
                this.sandbox.stub(Spinner.prototype);
                function MockWidgetStripFn() {}
                MockWidgetStripFn.prototype.getLengthToIndex = this.sandbox.stub().returns(50);

                this.sandbox.stub(Mask.prototype, 'appendChildWidget');
                mask = new Mask('myCarousel_mask', new MockWidgetStripFn(), verticalOrientation);
                mask.alignToIndex(4, { skipAnim: true });
                assertTrue("skipAnim parameter passed to spinner in options object", Spinner.prototype.moveContentsTo.firstCall.args[1].skipAnim);
            }
        );
    };

    this.MaskTest.prototype.testGetWidgetStripReturnsStrip = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, verticalOrientation) {
                var mask, strip;

                strip = {mock: 'strip'};
                this.sandbox.stub(Mask.prototype, 'appendChildWidget');

                mask = new Mask('myCarousel_mask', strip, verticalOrientation);

                assertEquals('Widget strip returned', strip, mask.getWidgetStrip());
            }
        );
    };

    this.MaskTest.prototype.testSetWidgetStrip = function (queue) {
        queuedApplicationInit(queue,
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
                assertEquals("Container set correctly", strip2, mask.getWidgetStrip());
            }
        );
    };

    this.MaskTest.prototype.testSetWidgetStripRemovesOldStrip = function (queue) {
        queuedApplicationInit(queue,
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
                mask.removeChildWidget = sinon.stub().withArgs(strip1);
                mask.appendChildWidget = sinon.stub();
                mask.setWidgetStrip(strip2);
                assertTrue("Old strip removed", mask.removeChildWidget.calledOnce);
            }
        );
    };

    this.MaskTest.prototype.testSetWidgetStripDoesNotRemoveNonExistantStrip = function (queue) {
        queuedApplicationInit(queue,
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
                Mask.prototype.removeChildWidget = sinon.stub();
                mask = new Mask('testMask', strip1, verticalOrientation);
                assertFalse("Strip not removed before creation", mask.removeChildWidget.called);
            }
        );
    };

    this.MaskTest.prototype.testSetWidgetStripAddsNewStrip = function (queue) {
        queuedApplicationInit(queue,
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
                mask.removeChildWidget = sinon.stub();
                mask.appendChildWidget = sinon.stub().withArgs(strip2);
                mask.setWidgetStrip(strip2);
                assertTrue("New strip added", mask.appendChildWidget.calledOnce);
            }
        );
    };

    this.MaskTest.prototype.testGetLength = function (queue) {
        queuedApplicationInit(queue,
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
                device.getElementSize = sinon.stub().returns({width: 50, height: 50});
                assertEquals("getLength length returns length of mask element", 50, mask.getLength());
            }
        );
    };

    this.MaskTest.prototype.testMaskClassSet = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation) {
                var mask, strip1, device, classStub;
                device = application.getDevice();
                classStub = this.sandbox.stub(Mask.prototype, 'addClass').withArgs('carouselmask');
                strip1 = new WidgetStrip('strip1', verticalOrientation);
                mask = new Mask('testMask', strip1, verticalOrientation);

                assertTrue("carouselmask class set on mask", classStub.calledOnce);
            }
        );
    };

    this.MaskTest.prototype.testMaskSetsOrientationClass = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation) {
                var mask, strip1, device, classStub, orientationStyle;
                orientationStyle = verticalOrientation.styleClass();
                device = application.getDevice();
                classStub = this.sandbox.stub(Mask.prototype, 'addClass').withArgs(orientationStyle);
                strip1 = new WidgetStrip('strip1', verticalOrientation);
                mask = new Mask('testMask', strip1, verticalOrientation);

                assertTrue("vertical class set on mask", classStub.calledOnce);
            }
        );
    };

    this.MaskTest.prototype.testGetLengthGetsDimensionFromOrientation = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation) {
                var mask, strip1, device, length;

                device = application.getDevice();
                this.sandbox.stub(device);
                strip1 = new WidgetStrip('strip1', verticalOrientation);
                this.sandbox.stub(verticalOrientation, 'dimension').returns("test");
                mask = new Mask('testMask', strip1, verticalOrientation);
                device.getElementSize.returns({height: 20, test: 50});
                length = mask.getLength();
                assertTrue("orientation dimension queried", verticalOrientation.dimension.called);
                assertEquals("length returns size property defined by orientation", 50, length);
            }
        );
    };

    this.MaskTest.prototype.testMaskPassesOrientationToSpinner = function (queue) {
        queuedApplicationInit(queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/strips/widgetstrip',
                'antie/widgets/carousel/orientations/vertical',
                'antie/widgets/carousel/spinner'
            ],
            function (application, Mask, WidgetStrip, verticalOrientation, Spinner) {
                var mask, strip1, device, length;

                device = application.getDevice();
                this.sandbox.stub(device);
                this.sandbox.stub(Spinner.prototype);
                strip1 = new WidgetStrip('strip1', verticalOrientation);
                mask = new Mask('testMask', strip1, verticalOrientation);

                assertTrue("spinner constructor receives orientation",
                    Spinner.prototype.init.calledWith(device, mask, verticalOrientation));

            }
        );
    };

}());