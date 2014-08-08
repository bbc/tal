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

(function() {
    this.tests = AsyncTestCase("CSS Manager");

    this.tests.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
        this.mockEl = {
            style: {
                position: "invalidPosition",
                whiteSpace: "invalidWhiteSpace",
                width: "invalidWidth",
                height: "invalidHeight",
                display: "invalidDisplay"
            }
        };
    };

    this.tests.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.tests.prototype.testCheckConfigureForAlgorithmWhenMeasuringVertically = function (queue) {
        expectAsserts(5);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/cssmanager"], function(CSSManager) {

            new CSSManager(this.mockEl, false).configureForAlgorithm();
            assertEquals("static", this.mockEl.style.position);
            assertEquals("normal", this.mockEl.style.whiteSpace);
            assertEquals("invalidWidth", this.mockEl.style.width);
            assertEquals("auto", this.mockEl.style.height);
            assertEquals("inline-block", this.mockEl.style.display);
        });
    };

    this.tests.prototype.testCheckConfigureForAlgorithmWhenMeasuringHorizontally = function (queue) {
        expectAsserts(5);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/cssmanager"], function(CSSManager) {

            new CSSManager(this.mockEl, true).configureForAlgorithm();
            assertEquals("static", this.mockEl.style.position);
            assertEquals("nowrap", this.mockEl.style.whiteSpace);
            assertEquals("auto", this.mockEl.style.width);
            assertEquals("auto", this.mockEl.style.height);
            assertEquals("inline-block", this.mockEl.style.display);
        });
    };

    this.tests.prototype.testCheckThatRestoreRestoresCorrectCSSWhenMeasuringVertically = function (queue) {
        expectAsserts(5);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/cssmanager"], function(CSSManager) {

            var instance = new CSSManager(this.mockEl, false);
            instance.configureForAlgorithm();
            instance.restore();
            assertEquals("invalidPosition", this.mockEl.style.position);
            assertEquals("invalidWhiteSpace", this.mockEl.style.whiteSpace);
            assertEquals("invalidWidth", this.mockEl.style.width);
            assertEquals("invalidHeight", this.mockEl.style.height);
            assertEquals("invalidDisplay", this.mockEl.style.display);
        });
    };

    this.tests.prototype.testCheckThatRestoreRestoresCorrectCSSWhenMeasuringHorizontally = function (queue) {
        expectAsserts(5);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/cssmanager"], function(CSSManager) {

            var instance = new CSSManager(this.mockEl, true);
            instance.configureForAlgorithm();
            instance.restore();
            assertEquals("invalidPosition", this.mockEl.style.position);
            assertEquals("invalidWhiteSpace", this.mockEl.style.whiteSpace);
            assertEquals("invalidWidth", this.mockEl.style.width);
            assertEquals("invalidHeight", this.mockEl.style.height);
            assertEquals("invalidDisplay", this.mockEl.style.display);
        });
    };
})();