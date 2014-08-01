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
    this.tests = AsyncTestCase("Truncation Helpers");

    var TEST_STR = "This is a test string.";

    this.tests.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.tests.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    function setupParentContainer() {
        var parentContainer = document.createElement("div");
        // try and set the css to that this will render the same in all browsers
        parentContainer.style.display = "block";
        parentContainer.style.margin = "0";
        parentContainer.style.padding = "0";
        parentContainer.style.borderStyle = "none";
        parentContainer.style.fontFamily = "Courier, monospace";
        parentContainer.style.fontStyle = "normal";
        parentContainer.style.fontSize = "20px";
        parentContainer.style.fontWeight = "normal";
        document.body.appendChild(parentContainer);
        return parentContainer;
    }

    function destroyParentContainer(parentContainer) {
        document.body.removeChild(parentContainer);
    }

    this.tests.prototype.testCheckIsAtWordBoundaryReturnsTrueWhenExpected = function (queue) {
        expectAsserts(3);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/helpers"], function(Helpers) {
            assertEquals(true, Helpers.isAtWordBoundary(TEST_STR, 4));
            assertEquals(true, Helpers.isAtWordBoundary(TEST_STR, 7));
            assertEquals(true, Helpers.isAtWordBoundary(TEST_STR, 22));
        });
    };

    this.tests.prototype.testCheckIsAtWordBoundaryReturnsFalseWhenExpected = function (queue) {
        expectAsserts(2);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/helpers"], function(Helpers) {
            assertEquals(false, Helpers.isAtWordBoundary(TEST_STR, 5));
            assertEquals(false, Helpers.isAtWordBoundary(TEST_STR, 6));
        });
    };

    this.tests.prototype.testCheckGetLastWordBoundaryIndexReturnsProperValueWhenStringContainsWordBoundary = function (queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/helpers"], function(Helpers) {
            assertEquals(14, Helpers.getLastWordBoundaryIndex(TEST_STR));
        });
    };

    this.tests.prototype.testCheckGetLastWordBoundaryIndexReturnsProperValueWhenStringDoesNotContainWordBoundary = function (queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/helpers"], function(Helpers) {
            assertEquals(-1, Helpers.getLastWordBoundaryIndex("StringWithNoWordBoundaries."));
        });
    };

    this.tests.prototype.testCheckTrimToWordWorksProperly = function (queue) {
        expectAsserts(4);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/helpers"], function(Helpers) {
            assertEquals("This is a", Helpers.trimToWord("This is a te"));
            assertEquals("This is a", Helpers.trimToWord("This is a "));
            assertEquals("", Helpers.trimToWord("This"));
            assertEquals("", Helpers.trimToWord(""));
        });
    };

    this.tests.prototype.testCheckTrimTrailingWhitespaceWorksProperly = function (queue) {
        expectAsserts(5);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/helpers"], function(Helpers) {
            assertEquals("Test with trailing whitespace.", Helpers.trimTrailingWhitespace("Test with trailing whitespace.         "));
            assertEquals("Testing 123.", Helpers.trimTrailingWhitespace("Testing 123."));
            assertEquals("", Helpers.trimTrailingWhitespace(" "));
            assertEquals("", Helpers.trimTrailingWhitespace(""));
            assertEquals("", Helpers.trimTrailingWhitespace(""));
        });
    };

})();