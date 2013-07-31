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
                    onComplete: function () { return true; },
                    skipAnim: "test"
                };

                dummyElement = {dummy: 'element'};
                dummyStrip = { outputElement: dummyElement };
                device = { moveElementTo: this.sandbox.stub() };
                mask = { getWidgetStrip: this.sandbox.stub().returns(dummyStrip) };
                spinner = new Spinner(device, mask, verticalOrientation);

                spinner.moveContentsTo(-100, animOptions);
                moveArgs = device.moveElementTo.getCall(0).args[0];
                assertEquals('onComplete passed to moveElementTo', animOptions.onComplete, moveArgs.onComplete);
                assertEquals('skipAnim passed to moveElementTo', animOptions.skipAnim, moveArgs.skipAnim);
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
                this.sandbox.stub(verticalOrientation);
                spinner = new Spinner(device, mask, verticalOrientation);

                spinner.moveContentsTo(-100, animOptions);

                assertTrue('verticalOrientation edge queried', verticalOrientation.edge.called);

            }
        );
    };



}());