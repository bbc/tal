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
    this.SpinnerTest = AsyncTestCase("Spinner");

    this.SpinnerTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.SpinnerTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.SpinnerTest.prototype.testMoveContentsToCallsMoveToOnWidgetStripElement = function (queue) {
        queuedRequire(queue,
            [
                "antie/widgets/carousel/spinner",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (Spinner, verticalOrientation) {
                var device, mask, spinner, dummyStrip, dummyElement, spunElement;

                dummyElement = {dummy: 'element'};

                dummyStrip = {
                    outputElement: dummyElement
                };

                device = {
                    moveElementTo: this.sandbox.stub()
                };
                mask = {
                    getWidgetStrip: this.sandbox.stub().returns(dummyStrip)
                };
                spinner = new Spinner(device, mask, verticalOrientation);
                spinner.moveContentsTo(-100);
                assertTrue('Spinner asks mask for widget strip', mask.getWidgetStrip.calledOnce);
                spunElement = device.moveElementTo.getCall(0).args[0].el;
                assertEquals('Spun element is widget strip output element', dummyElement, spunElement);
            }
        );
    };

    this.SpinnerTest.prototype.testMoveContentsToUsesPassedInOptions = function (queue) {
        queuedRequire(queue,
            [   "antie/widgets/carousel/spinner",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (Spinner, verticalOrientation) {
                var device, animOptions, mask, spinner, dummyStrip, dummyElement, moveArgs;

                animOptions = {
                    onComplete: this.sandbox.stub(),
                    skipAnim: "test"
                };

                dummyElement = {dummy: 'element'};
                dummyStrip = { outputElement: dummyElement };
                device = { moveElementTo: this.sandbox.stub().yieldsTo('onComplete') };
                mask = { getWidgetStrip: this.sandbox.stub().returns(dummyStrip) };
                spinner = new Spinner(device, mask, verticalOrientation);

                spinner.moveContentsTo(-100, animOptions);
                moveArgs = device.moveElementTo.getCall(0).args[0];

                assertEquals('skipAnim passed to moveElementTo', animOptions.skipAnim, moveArgs.skipAnim);
                assertTrue('onComplete passed to moveElementTo', animOptions.onComplete.calledOnce);
            }
        );
    };

    this.SpinnerTest.prototype.testMoveContentsToGetsEdgeFromOrientation = function (queue) {
        queuedRequire(queue,
            [
                "antie/widgets/carousel/spinner",
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (Spinner, verticalOrientation) {
                var device, animOptions, mask, spinner, dummyStrip, dummyElement, moveArgs;

                animOptions = {
                    onComplete: function () { return true; },
                    skipAnim: "test"
                };

                dummyElement = {dummy: 'element'};
                dummyStrip = { outputElement: dummyElement };
                device = { moveElementTo: this.sandbox.stub() };
                mask = { getWidgetStrip: this.sandbox.stub().returns(dummyStrip) };
                this.sandbox.stub(verticalOrientation, 'edge');
                spinner = new Spinner(device, mask, verticalOrientation);

                spinner.moveContentsTo(-100, animOptions);

                assertTrue('verticalOrientation edge queried', verticalOrientation.edge.called);

            }
        );
    };

    this.SpinnerTest.prototype.testInProgressAnimationIsStoppedBySubsequentAnimation = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/spinner',
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Spinner, Mask, verticalOrientation) {
                var device, spinner;
                device = application.getDevice();
                this.sandbox.stub(device, 'moveElementTo').returns("test");
                device.stopAnimation = this.sandbox.stub();
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.getWidgetStrip.returns({outputElement: "test"});
                spinner = new Spinner(device, new Mask(), verticalOrientation);
                spinner.moveContentsTo(10, {});
                assertFalse("stopAnimation called after first move", device.stopAnimation.called);
                spinner.moveContentsTo(20, {});
                assertTrue("stopAnimation called after second move", device.stopAnimation.called);
                assertEquals("stopAnimation called with first move handle after second move",
                    "test",
                    device.stopAnimation.getCall(0).args[0]);
            }
        );
    };

    this.SpinnerTest.prototype.testCompletedAnimationNotStoppedBySubsequentAnimation = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/spinner',
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Spinner, Mask, verticalOrientation) {
                var device, spinner;
                device = application.getDevice();
                this.sandbox.stub(device, 'moveElementTo').yieldsTo('onComplete');
                device.stopAnimation = this.sandbox.stub();
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.getWidgetStrip.returns({outputElement: "test"});
                spinner = new Spinner(device, new Mask(), verticalOrientation);
                spinner.moveContentsTo(10, {});
                spinner.moveContentsTo(20, {});
                assertFalse("stopAnimation called after second move",
                    device.stopAnimation.called);
            }
        );
    };

    this.SpinnerTest.prototype.testChainedAnimationNotStopped = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/spinner',
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Spinner, Mask, verticalOrientation) {
                var device, spinner, stopStub;

                function chain() {
                    spinner.moveContentsTo(20, {});
                }

                device = application.getDevice();
                this.sandbox.stub(device, 'moveElementTo').yieldsTo('onComplete');
                device.moveElementTo.returns("test");
                stopStub = this.sandbox.stub(device, 'stopAnimation');
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.getWidgetStrip.returns({outputElement: "test"});
                spinner = new Spinner(device, new Mask(), verticalOrientation);
                spinner.moveContentsTo(10, { onComplete: chain });
                assertTrue("chained move executed", device.moveElementTo.calledTwice);
                assertFalse("stopAnimation called after chained move",
                    stopStub.called);
            }
        );
    };

    this.SpinnerTest.prototype.testStopAnimationStopsInProgressAnimation = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/spinner',
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Spinner, Mask, verticalOrientation) {
                var device, spinner, stopStub;

                device = application.getDevice();
                this.sandbox.stub(device);
                device.moveElementTo.returns("test");
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.getWidgetStrip.returns({outputElement: "test"});
                spinner = new Spinner(device, new Mask(), verticalOrientation);
                spinner.moveContentsTo(10);

                assertFalse("device stopAnimation called before stopAnimation", device.stopAnimation.calledOnce);
                spinner.stopAnimation();
                assertTrue("device stopAnimation called on stopAnimation", device.stopAnimation.calledOnce);
            }
        );
    };

    this.SpinnerTest.prototype.testStopAnimationDoesNotCallDeviceWhenNoAnimation = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/spinner',
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Spinner, Mask, verticalOrientation) {
                var device, spinner, stopStub;

                device = application.getDevice();
                this.sandbox.stub(device);
                device.moveElementTo.returns("test");
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.getWidgetStrip.returns({outputElement: "test"});
                spinner = new Spinner(device, new Mask(), verticalOrientation);
                spinner.stopAnimation();
                assertFalse("device stopAnimation called when no animation in progress", device.stopAnimation.calledOnce);
            }
        );
    };

    this.SpinnerTest.prototype.testOptionParamatersUsedWhenPresent = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/spinner',
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Spinner, Mask, verticalOrientation) {
                var device, spinner, options;
                options = {
                    duration: "test1",
                    fps: "test2",
                    easing: "test3",
                    skipAnim: "test4"
                };
                device = application.getDevice();
                this.sandbox.stub(device);
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.getWidgetStrip.returns({outputElement: "test"});
                spinner = new Spinner(device, new Mask(), verticalOrientation);
                spinner.moveContentsTo(10, options);

                assertEquals("Passed in duration used", "test1", device.moveElementTo.firstCall.args[0].duration);
                assertEquals("Passed in fps used", "test2", device.moveElementTo.firstCall.args[0].fps);
                assertEquals("Passed in easing used", "test3", device.moveElementTo.firstCall.args[0].easing);
                assertEquals("Passed in skipAnim used", "test4", device.moveElementTo.firstCall.args[0].skipAnim);
            }
        );
    };

    this.SpinnerTest.prototype.testSkipAnimTrueByDefault = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/spinner',
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Spinner, Mask, verticalOrientation) {
                var device, spinner, options;
                device = application.getDevice();
                this.sandbox.stub(device);
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.getWidgetStrip.returns({outputElement: "test"});
                spinner = new Spinner(device, new Mask(), verticalOrientation);
                spinner.moveContentsTo(10);
                assertEquals("Skipanim true", true, device.moveElementTo.firstCall.args[0].skipAnim);
            }
        );
    };

    this.SpinnerTest.prototype.testSkipAnimCanBeOveridden = function (queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/widgets/carousel/spinner',
                'antie/widgets/carousel/mask',
                'antie/widgets/carousel/orientations/vertical'
            ],
            function (application, Spinner, Mask, verticalOrientation) {
                var device, spinner, options;
                device = application.getDevice();
                this.sandbox.stub(device);
                this.sandbox.stub(Mask.prototype);
                Mask.prototype.getWidgetStrip.returns({outputElement: "test"});
                spinner = new Spinner(device, new Mask(), verticalOrientation);
                spinner.moveContentsTo(10, {skipAnim: false});
                assertEquals("Skipanim overriden to false", false, device.moveElementTo.firstCall.args[0].skipAnim);
            }
        );
    };

// removing as this should only ever happen if a modifier incorrectly returns null without calling oncomplete
// can happen with CSS3 if prefix sniffing fails, but that's a CSS3 modifier problem and masking it by preventing this exception
// is probably a bad idea
//    this.SpinnerTest.prototype.testStopAfterNullMoveDoesNotCallDeviceStopWithNull = function (queue) {
//        queuedApplicationInit(
//            queue,
//            'lib/mockapplication',
//            [
//                'antie/widgets/carousel/spinner',
//                'antie/widgets/carousel/mask',
//                'antie/widgets/carousel/orientations/vertical'
//            ],
//            function (application, Spinner, Mask, verticalOrientation) {
//                var device, spinner;
//                device = application.getDevice();
//                this.sandbox.stub(device);
//                this.sandbox.stub(Mask.prototype);
//                Mask.prototype.getWidgetStrip.returns({outputElement: "test"});
//                device.moveElementTo.returns(null);
//                spinner = new Spinner(device, new Mask(), verticalOrientation);
//                spinner.moveContentsTo(10, {skipAnim: false});
//                spinner.stopAnimation();
//                sinon.assert.neverCalledWith(device.stopAnimation, null);
//            }
//        );
//    };

}());