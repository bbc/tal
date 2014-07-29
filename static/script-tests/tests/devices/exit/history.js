(function() {
	this.HistoryExitTest = AsyncTestCase("Exit (History)");

	this.HistoryExitTest.prototype.testExit = function(queue) {
		expectAsserts(1);

		var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/exit/history"]},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

		queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
			var expected = 0 - (history.length -1);
			sinon.stub(history, 'go', function(length) {
				history.go.restore();
				assertEquals("History.go(length) is " + length, expected, length);
			});

            application.getDevice().exit();
		}, config);
	};
})();