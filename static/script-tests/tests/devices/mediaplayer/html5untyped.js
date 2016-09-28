/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.HTML5UntypedMediaPlayerTests = AsyncTestCase('HTML5UntypedMediaPlayer');

    var config = {'modules':{'base':'antie/devices/browserdevice','modifiers':['antie/devices/mediaplayer/html5untyped']}, 'input':{'map':{}},'layouts':[{'width':960,'height':540,'module':'fixtures/layouts/default','classes':['browserdevice540p']}],'deviceConfigurationKey':'devices-html5-1'};

    // ---------------
    // Mix in the base HTML5 tests to make sure the sub-modifier doesn't break basic functionality
    // ---------------
    window.commonTests.mediaPlayer.html5.mixinTests(this.HTML5UntypedMediaPlayerTests, 'antie/devices/mediaplayer/html5untyped', config);

    // ---------------
    // Remove tests that are irrelevant for this sub-modifier.
    // ---------------
    delete this.HTML5UntypedMediaPlayerTests.prototype.testSourceURLSetAsChildElementOnSetSource;

    // ---------------
    // Additional tests for this sub-modifier.
    // ---------------
    this.HTML5UntypedMediaPlayerTests.prototype.testSourceURLSetAsChildElementWithoutTypeOnSetSource = function(queue) {
        expectAsserts(5);
        var self = this;
        this.runMediaPlayerTest(this, queue, function (MediaPlayer) {
            assertEquals(0, self.stubCreateElementResults.video.children.length);
            self._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, 'http://testurl/', 'video/mp4');
            assertEquals(1, self.stubCreateElementResults.video.children.length);
            var childElement = self.stubCreateElementResults.video.firstChild;
            assertEquals('source', childElement.nodeName.toLowerCase());
            assertEquals('http://testurl/', childElement.src);
            assertFalse(!!childElement.type);
        });
    };

})();
