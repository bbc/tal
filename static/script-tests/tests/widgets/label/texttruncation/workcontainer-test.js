
(function() {
    this.tests = AsyncTestCase("Work Container");

    this.tests.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.tests.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    var LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sagittis lacus ac urna tempus molestie. Etiam dignissim at arcu eu tincidunt. Cras molestie sed lacus eget ultrices. Donec fringilla auctor lacus non sagittis. Vivamus egestas eros massa, a bibendum augue ullamcorper a. Praesent ut lacus pulvinar, ullamcorper felis vel, volutpat leo. Nullam luctus vel justo eu commodo. Maecenas elementum felis elit, a aliquet dui lacinia elementum. Aenean non dolor scelerisque leo malesuada laoreet nec ac turpis. Nunc dapibus at risus id malesuada. Donec eu nisi vitae lorem elementum lobortis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec ultricies congue quam quis condimentum. Aliquam commodo iaculis eros, ut tincidunt neque gravida quis. Maecenas a augue a ipsum luctus fermentum. Cras sit amet purus at nisi vestibulum pulvinar.";

    function stubCssManager(sandbox, CssManager) {
        sandbox.stub(CssManager.prototype, "init", function() {});
        sandbox.stub(CssManager.prototype, "restore", function() {});
    }

    function stubWorkContainer(sandbox, WorkContainer, sourceContainer) {
        sandbox.stub(WorkContainer.prototype, "_createContainer", function() {
            return sourceContainer;
        });

        sandbox.stub(WorkContainer.prototype, "_createTxtTruncationElNode", function() {
            return getMockDomTextNode("");
        });
    }

    function stubPositionGenerator(sandbox, PositionGenerator) {
        (function() {
            var positionGeneratorResults = [8, 4, 6];
            sandbox.stub(PositionGenerator.prototype, "init", function () {
            });
            sandbox.stub(PositionGenerator.prototype, "hasNext", function () {
                return positionGeneratorResults.length > 0;
            });
            sandbox.stub(PositionGenerator.prototype, "next", function () {
                return positionGeneratorResults.shift();
            });
        })();
    }

    function getMockDomContainer(w, h) {
        return {
            clientWidth: w,
            clientHeight: h,
            offsetWidth: w,
            offsetHeight: h,
            appendChild: function() {}
        };
    }

    function getMockDomTextNode(txt) {
        return {
            nodeValue: txt
        };
    }


    this.tests.prototype.testCheckTextThatIsMoreThanContainersVerticalHeightWhenMeasuringVerticallyIsReportedAsOver = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/label/texttruncation/workcontainer",
             "antie/widgets/label/texttruncation/cssmanager"],
        function(application, WorkContainer, CssManager) {

            var mockContainer = getMockDomContainer(100, 100);

            stubCssManager(this.sandbox, CssManager);
            stubWorkContainer(this.sandbox, WorkContainer, mockContainer);

            var workContainer = new WorkContainer(application.getDevice(), getMockDomContainer(), false);
            mockContainer.clientHeight = mockContainer.offsetHeight = 150;

            assertEquals(true, workContainer.isOver(""));
        });
    };

    this.tests.prototype.testCheckTextThatIsLessThanContainersHeightWhenMeasuringVerticallyIsNotReportedAsOver = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/label/texttruncation/workcontainer",
                "antie/widgets/label/texttruncation/cssmanager"],
        function(application, WorkContainer, CssManager) {

            var mockContainer = getMockDomContainer(100, 100);

            stubCssManager(this.sandbox, CssManager);
            stubWorkContainer(this.sandbox, WorkContainer, mockContainer);

            var workContainer = new WorkContainer(application.getDevice(), getMockDomContainer(), false);
            mockContainer.clientHeight = mockContainer.offsetHeight = 50;

            assertEquals(false, workContainer.isOver(""));
        });
    };

    this.tests.prototype.testCheckTextThatIsMoreThanContainersWidthWhenMeasuringHorizontallyIsReportedAsOver = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/label/texttruncation/workcontainer",
                "antie/widgets/label/texttruncation/cssmanager"],
        function(application, WorkContainer, CssManager) {

            var mockContainer = getMockDomContainer(100, 100);

            stubCssManager(this.sandbox, CssManager);
            stubWorkContainer(this.sandbox, WorkContainer, mockContainer);

            var workContainer = new WorkContainer(application.getDevice(), getMockDomContainer(), true);
            mockContainer.clientWidth = mockContainer.offsetWidth = 150;

            assertEquals(true, workContainer.isOver(""));
        });
    };

    this.tests.prototype.testCheckTextThatIsLessThanContainersWidthWhenMeasuringHorizontallyIsNotReportedAsOver = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/label/texttruncation/workcontainer",
                "antie/widgets/label/texttruncation/cssmanager"],
        function(application, WorkContainer, CssManager) {

            var mockContainer = getMockDomContainer(100, 100);

            stubCssManager(this.sandbox, CssManager);
            stubWorkContainer(this.sandbox, WorkContainer, mockContainer);

            var workContainer = new WorkContainer(application.getDevice(), getMockDomContainer(), true);
            mockContainer.clientWidth = mockContainer.offsetWidth = 50;

            assertEquals(false, workContainer.isOver(""));
        });
    };


    this.tests.prototype.testCheckGetNumCharactersThatFitReturnsCorrectValue = function (queue) {
        expectAsserts(1);

        queuedApplicationInit(
            queue,
            "lib/mockapplication",
            ["antie/widgets/label/texttruncation/workcontainer",
             "antie/widgets/label/texttruncation/cssmanager",
             "antie/widgets/label/texttruncation/positiongenerator"],
        function(application, WorkContainer, CssManager, PositionGenerator) {

            var mockContainer = getMockDomContainer(100, 100);
            stubCssManager(this.sandbox, CssManager);
            stubWorkContainer(this.sandbox, WorkContainer, mockContainer);
            stubPositionGenerator(this.sandbox, PositionGenerator);

            var workContainer = new WorkContainer(application.getDevice(), getMockDomContainer(), true);
            assertEquals(6, workContainer.getNumCharactersThatFit(LOREM_IPSUM));

        });
    };

})();