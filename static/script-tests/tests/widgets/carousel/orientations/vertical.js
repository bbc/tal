/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {

    this.VerticalOrientationTest = AsyncTestCase('VerticalOrientation');

    this.VerticalOrientationTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.VerticalOrientationTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.VerticalOrientationTest.prototype.testDimesionReturnsHeight = function (queue) {
        queuedRequire(
            queue,
            ['antie/widgets/carousel/orientations/vertical'],
            function (verticalOrientation) {
                assertEquals('Correct dimension returned', 'height',  verticalOrientation.dimension());
            }
        );
    };

    this.VerticalOrientationTest.prototype.testEdgeReturnsTop = function (queue) {
        queuedRequire(
            queue,
            ['antie/widgets/carousel/orientations/vertical'],
            function (verticalOrientation) {
                assertEquals('Correct edge returned', 'top', verticalOrientation.edge());
            }
        );
    };

    this.VerticalOrientationTest.prototype.testStyleClassReturnsVertical = function (queue) {
        queuedRequire(
            queue,
            ['antie/widgets/carousel/orientations/vertical'],
            function (verticalOrientation) {
                assertEquals('Correct class returned', 'vertical', verticalOrientation.styleClass());
            }
        );
    };

}());
