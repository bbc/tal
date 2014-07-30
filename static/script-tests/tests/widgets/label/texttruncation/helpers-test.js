
(function() {
    this.tests = AsyncTestCase("Truncation Helpers");

    this.tests.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
        this.sourceStr = "This is a test string.";
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
            assertEquals(true, Helpers.isAtWordBoundary(this.sourceStr, 4));
            assertEquals(true, Helpers.isAtWordBoundary(this.sourceStr, 7));
            assertEquals(true, Helpers.isAtWordBoundary(this.sourceStr, 22));
        });
    };

    this.tests.prototype.testCheckIsAtWordBoundaryReturnsFalseWhenExpected = function (queue) {
        expectAsserts(2);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/helpers"], function(Helpers) {
            assertEquals(false, Helpers.isAtWordBoundary(this.sourceStr, 5));
            assertEquals(false, Helpers.isAtWordBoundary(this.sourceStr, 6));
        });
    };

    this.tests.prototype.testCheckGetLastWordBoundaryIndexReturnsProperValueWhenStringContainsWordBoundary = function (queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/helpers"], function(Helpers) {
            assertEquals(14, Helpers.getLastWordBoundaryIndex(this.sourceStr));
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