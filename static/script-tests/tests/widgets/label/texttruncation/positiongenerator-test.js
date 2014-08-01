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
    this.tests = AsyncTestCase("Position Generator");

    this.tests.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.tests.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.tests.prototype.testCheckThatPositionGeneratorReturnsCorrectNumberSequence = function (queue) {
        expectAsserts(9);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/positiongenerator"], function (PositionGenerator) {

            var positionGenerator;
            positionGenerator = new PositionGenerator(8);
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(4, positionGenerator.next(true));
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(2, positionGenerator.next(true));
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(1, positionGenerator.next(true));
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(0, positionGenerator.next(true));
            assertEquals(false, positionGenerator.hasNext(true));

        });
    };

    this.tests.prototype.testCheckThatPositionGeneratorReturnsCorrectFirstPositionWithStringLengthIsNotAPowerOfTwo = function (queue) {
        expectAsserts(2);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/positiongenerator"], function (PositionGenerator) {
            positionGenerator = new PositionGenerator(9);
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(1, positionGenerator.next(true));
        });
    };

    this.tests.prototype.testCheckThatPositionGeneratorReturnsCorrectPositionAfterIsOverIsReportedFalse = function (queue) {
        expectAsserts(2);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/positiongenerator"], function (PositionGenerator) {
            positionGenerator = new PositionGenerator(4);
            positionGenerator.next(true);
            assertEquals(true, positionGenerator.hasNext(false));
            assertEquals(3, positionGenerator.next(false));
        });
    };

    this.tests.prototype.testCheckThatPositionGeneratorReturnsDecreasingValueAfterPointerHasReachedZero = function (queue) {
        expectAsserts(2);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/positiongenerator"], function (PositionGenerator) {
            positionGenerator = new PositionGenerator(4);
            positionGenerator.next(true);
            positionGenerator.next(false);
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(2, positionGenerator.next(true));
        });
    };

    this.tests.prototype.testCheckThatPositionGeneratorReturnsFalseFromHasNextWhenIsOverAndCheckingStringOfLengthZero = function (queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/positiongenerator"], function (PositionGenerator) {
            positionGenerator = new PositionGenerator(0);
            assertEquals(false, positionGenerator.hasNext(true));
        });
    };

})();