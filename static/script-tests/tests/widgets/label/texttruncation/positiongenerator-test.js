
(function() {
    this.tests = AsyncTestCase("Position Generator");

    this.tests.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.tests.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.tests.prototype.testCheckThatPositionGeneratorReturnsCorrectNumberSequenceForDifferentLengthStrings = function (queue) {
        expectAsserts(10 + 7 + 9 + 3 + 1 + 2 + 1);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/positiongenerator"], function(PositionGenerator) {

            var positionGenerator;
            positionGenerator = new PositionGenerator(8);
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(4, positionGenerator.next(true));
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(2, positionGenerator.calculateNext(true));
            assertEquals(2, positionGenerator.next(true));
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(1, positionGenerator.next(true));
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(0, positionGenerator.next(true));
            assertEquals(false, positionGenerator.hasNext(true));

            positionGenerator = new PositionGenerator(8);
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(4, positionGenerator.next(true));
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(2, positionGenerator.next(true));
            assertEquals(true, positionGenerator.hasNext(false));
            assertEquals(3, positionGenerator.next(false));
            assertEquals(false, positionGenerator.hasNext(false));

            positionGenerator = new PositionGenerator(8);
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(4, positionGenerator.next(true));
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(2, positionGenerator.next(true));
            assertEquals(true, positionGenerator.hasNext(false));
            assertEquals(3, positionGenerator.next(false));
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(2, positionGenerator.next(true));
            assertEquals(false, positionGenerator.hasNext(false));

            positionGenerator = new PositionGenerator(1);
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(0, positionGenerator.next(true));
            assertEquals(false, positionGenerator.hasNext(true));

            positionGenerator = new PositionGenerator(1);
            assertEquals(false, positionGenerator.hasNext(false));

            positionGenerator = new PositionGenerator(9);
            assertEquals(true, positionGenerator.hasNext(true));
            assertEquals(1, positionGenerator.next(true));

            positionGenerator = new PositionGenerator(0);
            assertEquals(false, positionGenerator.hasNext(true));
        });
    };

})();