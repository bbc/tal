/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.HTML5MemoryLeakUnfixMediaPlayerTests = AsyncTestCase('HTML5MemoryLeakUnfixMediaPlayer');

    var sourceContainer = document.createElement('div');

    var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/mediaplayer/html5memoryleakunfix']}, 'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

    // ---------------
    // Mix in the base HTML5 tests to make sure the sub-modifier doesn't break basic functionality
    // ---------------
    window.commonTests.mediaPlayer.html5.mixinTests(this.HTML5MemoryLeakUnfixMediaPlayerTests, 'antie/devices/mediaplayer/html5memoryleakunfix', config);

    // ---------------
    // Remove tests that are irrelevant for this sub-modifier.
    // ---------------
    delete this.HTML5MemoryLeakUnfixMediaPlayerTests.prototype.testResetUnloadsMediaElementSourceAsPerGuidelines;

    // ---------------
    // Additional tests for this sub-modifier.
    // ---------------
    this.HTML5MemoryLeakUnfixMediaPlayerTests.prototype.testResetDoesNotUnloadMediaElementSourceAsPerNormalHtml5Guidelines = function(queue) {
        expectAsserts(2);
        var self = this;
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            self._mediaPlayer.initialiseMedia(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4', sourceContainer);
            self.stubCreateElementResults.video.load.reset();
            self.sandbox.stub(self.stubCreateElementResults.video, 'removeAttribute');

            self._mediaPlayer.reset();

            assert(self.stubCreateElementResults.video.removeAttribute.withArgs('src').notCalled);
            assert(self.stubCreateElementResults.video.load.notCalled);
        });
    };
})();
