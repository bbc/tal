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
    this.tests = AsyncTestCase("Work Container");

    this.tests.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.tests.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    var LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sagittis lacus ac urna tempus molestie. Etiam dignissim at arcu eu tincidunt. Cras molestie sed lacus eget ultrices. Donec fringilla auctor lacus non sagittis. Vivamus egestas eros massa, a bibendum augue ullamcorper a. Praesent ut lacus pulvinar, ullamcorper felis vel, volutpat leo. Nullam luctus vel justo eu commodo. Maecenas elementum felis elit, a aliquet dui lacinia elementum. Aenean non dolor scelerisque leo malesuada laoreet nec ac turpis. Nunc dapibus at risus id malesuada. Donec eu nisi vitae lorem elementum lobortis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec ultricies congue quam quis condimentum. Aliquam commodo iaculis eros, ut tincidunt neque gravida quis. Maecenas a augue a ipsum luctus fermentum. Cras sit amet purus at nisi vestibulum pulvinar.";

    function stubCssManager(sandbox, CssManager) {
        sandbox.stub(CssManager.prototype, "init");
        sandbox.stub(CssManager.prototype, "restore");
        sandbox.stub(CssManager.prototype, "configureForMeasuring");
        sandbox.stub(CssManager.prototype, "configureForAlgorithm");
    }

    function stubWorkContainer(sandbox, WorkContainer, sourceContainer) {
        sandbox.stub(WorkContainer.prototype, "_createContainer").returns(sourceContainer);
        sandbox.stub(WorkContainer.prototype, "_createTxtTruncationElNode").returns(getMockDomTextNode(""));
    }

    function stubPositionGenerator(sandbox, PositionGenerator) {
        var positionGeneratorResults = [8, 4, 6];
        sandbox.stub(PositionGenerator.prototype, "init");
        sandbox.stub(PositionGenerator.prototype, "hasNext", function () {
            return positionGeneratorResults.length > 0;
        });
        sandbox.stub(PositionGenerator.prototype, "next", function () {
            return positionGeneratorResults.shift();
        });
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

    function fakeSizeOfContainerThatIsCollapsingAroundContent(mockContainer, w, h) {
        mockContainer.clientWidth = mockContainer.offsetWidth = w;
        mockContainer.clientHeight = mockContainer.offsetHeight = h;
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
            fakeSizeOfContainerThatIsCollapsingAroundContent(mockContainer, 100, 101);

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
            fakeSizeOfContainerThatIsCollapsingAroundContent(mockContainer, 100, 100);

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
            fakeSizeOfContainerThatIsCollapsingAroundContent(mockContainer, 101, 100);

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
            fakeSizeOfContainerThatIsCollapsingAroundContent(mockContainer, 99, 100);

            assertEquals(false, workContainer.isOver(""));
        });
    };

    this.tests.prototype.testCheckThatIsOverReturnsTrueWhenBothValuesTheSame = function (queue) {
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
                fakeSizeOfContainerThatIsCollapsingAroundContent(mockContainer, 100, 100);

                assertEquals(true, workContainer.isOver(""));
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