
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