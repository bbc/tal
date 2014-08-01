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
    this.tests = AsyncTestCase("Truncator");

    this.tests.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.tests.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    var SAMPLE_TEXT = "This is some sample text.";
    var numberOfCharactersToReturnFromWorkContainer;

    function stubWorkContainer(sandbox, WorkContainer) {
        sandbox.stub(WorkContainer.prototype, "init", function() {});
        sandbox.stub(WorkContainer.prototype, "destroy", function() {});
        sandbox.stub(WorkContainer.prototype, "getNumCharactersThatFit", function(txt) {
            // pretend that it's always numberToReturn characters that fit or the entire string
            return txt.length < numberOfCharactersToReturnFromWorkContainer ? txt.length : numberOfCharactersToReturnFromWorkContainer;
        });
    }

    this.tests.prototype.testCheckGetEllipsisIfNecessaryReturnsCorrectValues = function (queue) {
        expectAsserts(3);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/truncator"], function(Truncator) {

            var truncator = new Truncator();
            assertEquals("", truncator._getEllipsisIfNecessary(3, 1));
            assertEquals("...", truncator._getEllipsisIfNecessary(3, 2));
            assertEquals("...", truncator._getEllipsisIfNecessary(0, 0));
        });
    };

    this.tests.prototype.testCheckTextIsTruncatedToCorrectAmountWhenSplittingAtWordBoundaryAndUsingEllipsisText = function (queue) {
        expectAsserts(3);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/truncator",
                              "antie/widgets/label/texttruncation/workcontainer"],
        function(Truncator, WorkContainer) {
            stubWorkContainer(this.sandbox, WorkContainer);

            var truncator = new Truncator();

            truncator.setEllipsisText("...");
            truncator.setSplitAtWordBoundary(true);

            numberOfCharactersToReturnFromWorkContainer = 10;
            assertEquals("This is...", truncator.truncateText(null, SAMPLE_TEXT, 0));

            numberOfCharactersToReturnFromWorkContainer = SAMPLE_TEXT.length;
            assertEquals(SAMPLE_TEXT, truncator.truncateText(null, SAMPLE_TEXT, 0));

            numberOfCharactersToReturnFromWorkContainer = SAMPLE_TEXT.length-1;
            assertEquals("This is some sample...", truncator.truncateText(null, SAMPLE_TEXT, 0));
        });
    };

    this.tests.prototype.testCheckTextIsTruncatedToCorrectAmountWhenNotSplittingAtWordBoundaryAndUsingEllipsisText = function (queue) {
        expectAsserts(2);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/truncator",
                "antie/widgets/label/texttruncation/workcontainer"],
        function(Truncator, WorkContainer) {
            stubWorkContainer(this.sandbox, WorkContainer);

            var truncator = new Truncator();

            truncator.setEllipsisText("...");
            truncator.setSplitAtWordBoundary(false);

            numberOfCharactersToReturnFromWorkContainer = 10;
            assertEquals("This is so...", truncator.truncateText(null, SAMPLE_TEXT, 0));

            numberOfCharactersToReturnFromWorkContainer = SAMPLE_TEXT.length;
            assertEquals(SAMPLE_TEXT, truncator.truncateText(null, SAMPLE_TEXT, 0));
        });
    };

    this.tests.prototype.testCheckTextIsTruncatedToCorrectAmountWhenNotSplittingAtWordBoundaryAndNotUsingEllipsisText = function (queue) {
        expectAsserts(2);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/truncator",
                "antie/widgets/label/texttruncation/workcontainer"],
        function(Truncator, WorkContainer) {
            stubWorkContainer(this.sandbox, WorkContainer);

            var truncator = new Truncator();

            truncator.setEllipsisText("");
            truncator.setSplitAtWordBoundary(false);

            numberOfCharactersToReturnFromWorkContainer = 10;
            assertEquals("This is so", truncator.truncateText(null, SAMPLE_TEXT, 0));

            numberOfCharactersToReturnFromWorkContainer = SAMPLE_TEXT.length;
            assertEquals(SAMPLE_TEXT, truncator.truncateText(null, SAMPLE_TEXT, 0));
        });
    };


})();