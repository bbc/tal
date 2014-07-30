
(function() {
    this.tests = AsyncTestCase("CSS Manager");

    this.tests.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
        this.mockEl = {
            style: {
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

    this.tests.prototype.testCheckConstructorWhenMeasuringVertically = function (queue) {
        expectAsserts(4);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/cssmanager"], function(CSSManager) {

            new CSSManager(this.mockEl, false);
            assertEquals("normal", this.mockEl.style.whiteSpace);
            assertEquals("invalidWidth", this.mockEl.style.width);
            assertEquals("auto", this.mockEl.style.height);
            assertEquals("inline-block", this.mockEl.style.display);
        });
    };

    this.tests.prototype.testCheckConstructorWhenMeasuringHorizontally = function (queue) {
        expectAsserts(4);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/cssmanager"], function(CSSManager) {

            new CSSManager(this.mockEl, true);
            assertEquals("nowrap", this.mockEl.style.whiteSpace);
            assertEquals("auto", this.mockEl.style.width);
            assertEquals("auto", this.mockEl.style.height);
            assertEquals("inline-block", this.mockEl.style.display);
        });
    };

    this.tests.prototype.testCheckThatRestoreRestoresCorrectCSSWhenMeasuringVertically = function (queue) {
        expectAsserts(4);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/cssmanager"], function(CSSManager) {

            var instance = new CSSManager(this.mockEl, false);
            instance.restore();
            assertEquals("invalidWhiteSpace", this.mockEl.style.whiteSpace);
            assertEquals("invalidWidth", this.mockEl.style.width);
            assertEquals("invalidHeight", this.mockEl.style.height);
            assertEquals("invalidDisplay", this.mockEl.style.display);
        });
    };

    this.tests.prototype.testCheckThatRestoreRestoresCorrectCSSWhenMeasuringHorizontally = function (queue) {
        expectAsserts(4);

        queuedRequire(queue, ["antie/widgets/label/texttruncation/cssmanager"], function(CSSManager) {

            var instance = new CSSManager(this.mockEl, true);
            instance.restore();
            assertEquals("invalidWhiteSpace", this.mockEl.style.whiteSpace);
            assertEquals("invalidWidth", this.mockEl.style.width);
            assertEquals("invalidHeight", this.mockEl.style.height);
            assertEquals("invalidDisplay", this.mockEl.style.display);
        });
    };
})();