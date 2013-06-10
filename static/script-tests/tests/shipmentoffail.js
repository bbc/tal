(function() {
    this.EpicFailTest = AsyncTestCase("Epic Fail");
    this.EpicFailTest.prototype.testSetGetRootWidget = function() {
        assert(false);
    };
})();