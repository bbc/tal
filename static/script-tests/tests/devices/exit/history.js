/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.HistoryExitTest = AsyncTestCase('Exit_History');

    this.HistoryExitTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.HistoryExitTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.HistoryExitTest.prototype.testExit = function(queue) {
        expectAsserts(1);

        var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/exit/history']},'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var expected = 0 - (history.length -1);
            self.sandbox.stub(history, 'go', function(length) {
                history.go.restore();
                assertEquals('History.go(length) is ' + length, expected, length);
            });

            application.getDevice().exit();
        }, config);
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/exit/history'], this.HistoryExitTest);
})();
