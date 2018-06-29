/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.CEHTMLSeekFinishedEmitEventTests = AsyncTestCase('CEHTMLSeekFinishedEmitEvent');

    var sourceContainer = document.createElement('div');

    var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/mediaplayer/cehtmlseekfinishedemitevent']}, 'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};
    var configWithRestartTimeout = {'restartTimeout':10000, 'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/mediaplayer/cehtmlseekfinishedemitevent']}, 'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

    var eventWasFired = function(eventHandler, eventType) {
        for(var i = 0; i < eventHandler.callCount; i++) {
            if(eventHandler.getCall(i).args[0].type === eventType) {
                return true;
            }
        }
        return false;
    };

    var eventNotFired = function(eventHandler, eventType) {
        return !eventWasFired(eventHandler, eventType);
    };

    // ---------------
    // Mix in the base HTML5 tests to make sure the sub-modifier doesn't break basic functionality
    // ---------------
    window.commonTests.mediaPlayer.cehtml.mixinTests(this.CEHTMLSeekFinishedEmitEventTests, 'antie/devices/mediaplayer/cehtmlseekfinishedemitevent', config);

    // ---------------
    // Remove tests that are irrelevant for this sub-modifier.
    // ---------------

    // ---------------
    // Additional tests for this sub-modifier.
    // ---------------
    this.CEHTMLSeekFinishedEmitEventTests.prototype.testIfTimeIsInRangeAndHasBeenPlaying5TimesWithNoTimeoutWeFireSeekFinishedEvent = function(queue) {
        expectAsserts(7);
        var self = this;
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);

            self._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4', sourceContainer);
            self._mediaPlayer.beginPlaybackFrom(1000);
            self.deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            self.deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assert(eventWasFired(eventHandler, MediaPlayer.EVENT.SEEK_ATTEMPTED));
            for(var i = 0; i < 5; i++) {
                assert(eventNotFired(eventHandler, MediaPlayer.EVENT.SEEK_FINISHED));
                self._clock.tick(500);
                self.fakeCEHTMLObject.playPosition += 500;
                eventHandler.reset();
            }

            self.deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
            assert(eventWasFired(eventHandler, MediaPlayer.EVENT.SEEK_FINISHED));
        });
    };

    this.CEHTMLSeekFinishedEmitEventTests.prototype.testIfWeFiredSeekFinishedEventDoNotFireAnother = function(queue) {
        expectAsserts(8);
        var self = this;
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);

            self._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4', sourceContainer);
            self._mediaPlayer.beginPlaybackFrom(1000);
            self.deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            self.deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assert(eventWasFired(eventHandler, MediaPlayer.EVENT.SEEK_ATTEMPTED));
            for(var i = 0; i < 5; i++) {
                assert(eventNotFired(eventHandler, MediaPlayer.EVENT.SEEK_FINISHED));
                self._clock.tick(500);
                self.fakeCEHTMLObject.playPosition += 500;
                eventHandler.reset();
            }

            self.deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
            assert(eventWasFired(eventHandler, MediaPlayer.EVENT.SEEK_FINISHED));
            eventHandler.reset();

            self.deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
            assert(eventNotFired(eventHandler, MediaPlayer.EVENT.SEEK_FINISHED));
        });
    };

    this.CEHTMLSeekFinishedEmitEventTests.prototype.testIfTimeIsInRangeAndHasBeenPlaying5TimesWith10SecondTimeoutWeFireSeekFinishedEvent = function(queue) {
        var self = this;
        expectAsserts(21);
        this.runMediaPlayerTestWithSpecificConfig(this, queue, function (MediaPlayer) {
            var eventHandler = self.sandbox.stub();
            self._mediaPlayer.addEventCallback(null, eventHandler);

            self._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4', sourceContainer);
            self._mediaPlayer.beginPlaybackFrom(1000);
            self.deviceMockingHooks.sendMetadata(self._mediaPlayer, 0, { start: 0, end: 100 });
            self.deviceMockingHooks.finishBuffering(self._mediaPlayer);

            assert(eventWasFired(eventHandler, MediaPlayer.EVENT.SEEK_ATTEMPTED));

            var numberOfLoops = configWithRestartTimeout.restartTimeout/500;
            for(var i = 0; i < numberOfLoops - 1; i++) {
                self._clock.tick(500);
                self.fakeCEHTMLObject.playPosition += 500;
                assert(eventNotFired(eventHandler, MediaPlayer.EVENT.SEEK_FINISHED));
            }

            self.deviceMockingHooks.makeOneSecondPass(self._mediaPlayer);
            assert(eventWasFired(eventHandler, MediaPlayer.EVENT.SEEK_FINISHED));
        }, configWithRestartTimeout);
    };
})();
