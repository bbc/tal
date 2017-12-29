/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/exit/openclosewindow']},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};
    this.ExitOpenCloseWindowTest = AsyncTestCase('ExitOpenCloseWindow');

    this.ExitOpenCloseWindowTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
        this._windowCloseStub = this.sandbox.stub(window, 'close');
    };

    this.ExitOpenCloseWindowTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    /**
     * Test that window.open() is called.
     */
    this.ExitOpenCloseWindowTest.prototype.testWindowOpenCalled = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            // Stub out window.open() to do nothing
            var windowOpenStub = this.sandbox.stub(window, 'open');

            // Call exit strategy and ensure window.open() was called
            application.getDevice().exit();
            assertEquals('window.open call count', windowOpenStub.callCount, 1);
        }, config);
    };

    /**
     * Test that window.open() is called with no destination URL and _self as the target window.
     */
    this.ExitOpenCloseWindowTest.prototype.testWindowOpenCalledWithCorrectParams = function(queue) {
        expectAsserts(3);

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            // Stub out window.open() with some assertions
            this.sandbox.stub(window, 'open', function(url, windowName, windowFeatures) {
                assertFalse('window.open destination URL specified', !!url);
                assertEquals('window.open with _self as target', '_self', windowName);
                assertFalse('window.open features specified', !!windowFeatures);
            });

            // Call exit strategy.
            application.getDevice().exit();
        }, config);
    };

    /**
     * Test that window.open() is called, followed by window.close().
     */
    this.ExitOpenCloseWindowTest.prototype.testWindowOpenThenCloseCalled = function(queue) {
        expectAsserts(1);

        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            // Stub out window.open() and window.close()
            var windowOpenStub = this.sandbox.stub(window, 'open');

            // Call exit strategy and assert call sequence
            application.getDevice().exit();
            assert('window.close() called after window.open()', this._windowCloseStub.calledAfter(windowOpenStub));
        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/exit/openclosewindow'], this.ExitOpenCloseWindowTest);
})();
