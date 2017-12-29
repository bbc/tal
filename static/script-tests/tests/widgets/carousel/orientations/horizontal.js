/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {

    this.HorizontalOrientationTest = AsyncTestCase('HorizontalOrientation');

    this.HorizontalOrientationTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.HorizontalOrientationTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.HorizontalOrientationTest.prototype.testDimesionReturnsWidth = function (queue) {
        queuedRequire(
            queue,
            ['antie/widgets/carousel/orientations/horizontal'],
            function (horizontalOrientation) {
                assertEquals('Correct dimension returned', 'width', horizontalOrientation.dimension());
            }
        );
    };

    this.HorizontalOrientationTest.prototype.testEdgeReturnsLeft = function (queue) {
        queuedRequire(
            queue,
            ['antie/widgets/carousel/orientations/horizontal'],
            function (horizontalOrientation) {
                assertEquals('Correct edge returned', 'left', horizontalOrientation.edge());
            }
        );
    };

    this.HorizontalOrientationTest.prototype.testStyleClassReturnsHorizontal = function (queue) {
        queuedRequire(
            queue,
            ['antie/widgets/carousel/orientations/horizontal'],
            function (horizontalOrientation) {
                assertEquals('Correct class returned', 'horizontal', horizontalOrientation.styleClass());
            }
        );
    };

}());
