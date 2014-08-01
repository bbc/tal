
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
    }

    this.tests.prototype.testCheckThatPositionGeneratorReturnsCorrectPositionAfterIsOverIsReportedFalseAndThenTrueAgainAndThenArrivesAtResult = function (queue) {
        expectAsserts(5);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/positiongenerator"], function (PositionGenerator) {
            positionGenerator = new PositionGenerator(8);
            positionGenerator.next(true);
            positionGenerator.next(true);
            assertEquals(true, positionGenerator.hasNext(false));
            assertEquals(3, positionGenerator.next(false));
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(2, positionGenerator.next(true));
            assertEquals(false, positionGenerator.hasNext(false));
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